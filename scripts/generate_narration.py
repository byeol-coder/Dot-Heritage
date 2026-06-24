#!/usr/bin/env python3
"""
Batch-generate Dot Heritage narration audio with a GPT-SoVITS server.

Run this on the machine where GPT-SoVITS is set up (with a reference voice
loaded). It reads scripts/narration.json and writes:
    public/assets/audio/<lang>/<key>.mp3

Then add the produced "<lang>/<key>" entries to AVAILABLE_AUDIO in
src/engine/narration/audioManifest.ts (NARRATION_MANIFEST.md lists them).

Usage:
    python3 scripts/generate_narration.py --api http://127.0.0.1:9880 \
        --ref-ko ref_ko.wav --ref-ko-text "참조 문장" \
        --ref-en ref_en.wav --ref-en-text "Reference sentence"

The exact request shape depends on your GPT-SoVITS build; adjust `synthesize()`
to match your /tts endpoint. This is a template, intentionally minimal.
"""
import argparse, json, os, sys, urllib.request, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "scripts", "narration.json")
OUT_DIR = os.path.join(ROOT, "public", "assets", "audio")

LANGS = {"ko": "ko", "en": "en"}


# Target tone: a bright, friendly museum docent who explains clearly
# (명랑하지만 설명을 잘하는 도슨트). With GPT-SoVITS the tone comes mostly from the
# reference clip — pick a warm, upbeat, articulate voice sample. These params
# nudge delivery to be lively yet clear (a touch brisk, natural variation).
TONE = {
    "speed_factor": 1.06,   # slightly brisk = energetic, not rushed
    "temperature": 1.0,     # natural expressive variation
    "top_k": 15,
    "top_p": 1.0,
    "text_split_method": "cut5",  # split on punctuation for clean phrasing
}


def synthesize(api, text, lang, refs, tone):
    """Call GPT-SoVITS /tts. Adjust params to your server's API."""
    ref = refs[lang]
    payload = {
        "text": text,
        "text_lang": lang,
        "ref_audio_path": ref["audio"],
        "prompt_text": ref["text"],
        "prompt_lang": lang,
        "media_type": "mp3",
        **tone,
    }
    url = api.rstrip("/") + "/tts?" + urllib.parse.urlencode(payload)
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--api", required=True, help="GPT-SoVITS base URL, e.g. http://127.0.0.1:9880")
    ap.add_argument("--ref-ko", required=True); ap.add_argument("--ref-ko-text", required=True)
    ap.add_argument("--ref-en", required=True); ap.add_argument("--ref-en-text", required=True)
    ap.add_argument("--only", help="comma-separated keys to (re)generate; default all")
    ap.add_argument("--speed", type=float, default=TONE["speed_factor"],
                    help="delivery speed (1.0 neutral; ~1.06 = lively docent)")
    ap.add_argument("--temperature", type=float, default=TONE["temperature"])
    args = ap.parse_args()

    tone = {**TONE, "speed_factor": args.speed, "temperature": args.temperature}
    refs = {
        "ko": {"audio": args.ref_ko, "text": args.ref_ko_text},
        "en": {"audio": args.ref_en, "text": args.ref_en_text},
    }
    items = json.load(open(MANIFEST, encoding="utf-8"))
    only = set(args.only.split(",")) if args.only else None

    for lang in LANGS:
        os.makedirs(os.path.join(OUT_DIR, lang), exist_ok=True)

    done = 0
    for it in items:
        key = it["key"]
        if only and key not in only:
            continue
        for lang in LANGS:
            text = it[lang]
            out = os.path.join(OUT_DIR, lang, f"{key}.mp3")
            try:
                audio = synthesize(args.api, text, lang, refs, tone)
                open(out, "wb").write(audio)
                done += 1
                print(f"  ✓ {lang}/{key}.mp3  ({len(audio)//1024} KB)")
            except Exception as e:
                print(f"  ✗ {lang}/{key}: {e}", file=sys.stderr)
    print(f"\nGenerated {done} files into {OUT_DIR}")
    print("Next: add the 'ko/<key>' / 'en/<key>' entries to AVAILABLE_AUDIO.")


if __name__ == "__main__":
    main()
