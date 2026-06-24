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


def synthesize(api, text, lang, refs):
    """Call GPT-SoVITS /tts. Adjust params to your server's API."""
    ref = refs[lang]
    payload = {
        "text": text,
        "text_lang": lang,
        "ref_audio_path": ref["audio"],
        "prompt_text": ref["text"],
        "prompt_lang": lang,
        "media_type": "mp3",
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
    args = ap.parse_args()

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
                audio = synthesize(args.api, text, lang, refs)
                open(out, "wb").write(audio)
                done += 1
                print(f"  ✓ {lang}/{key}.mp3  ({len(audio)//1024} KB)")
            except Exception as e:
                print(f"  ✗ {lang}/{key}: {e}", file=sys.stderr)
    print(f"\nGenerated {done} files into {OUT_DIR}")
    print("Next: add the 'ko/<key>' / 'en/<key>' entries to AVAILABLE_AUDIO.")


if __name__ == "__main__":
    main()
