# Narration Manifest — pre-rendered audio (GPT-SoVITS)

Generate one audio file per row per language with a natural voice, then place
them at `public/assets/audio/<lang>/<key>.mp3` and add the matching
`'<lang>/<key>'` entries to `AVAILABLE_AUDIO` in
`src/engine/narration/audioManifest.ts`. The app plays the file when present
and otherwise falls back to the browser voice — no code changes needed.


Total: **34 keys × 2 languages = 68 files**.


## Voice & tone

Target: **a bright, friendly museum docent who explains clearly**
(명랑하지만 설명을 잘하는 도슨트). Warm and upbeat so it's welcoming to blind /
low-vision, children, and older visitors — but articulate and well-paced so the
information lands. The narration text itself is already written in this voice
(friendly 해요체 / warm conversational English).

With GPT-SoVITS the tone comes mostly from the **reference clip**, so choose a
voice sample that is already cheerful, clear, and unhurried (a docent / friendly
narrator read works well — avoid flat news-reading or overly dramatic clips).
Use a clean 5–10s reference per language with the matching `--ref-*-text`.

Recommended generation settings (defaults in `scripts/generate_narration.py`):
`speed_factor ≈ 1.06` (lively, not rushed), `temperature 1.0`, `top_k 15`,
`top_p 1.0`, split on punctuation. Tune with `--speed` / `--temperature`.


| key | file (ko / en) | 한국어 | English |
|---|---|---|---|
| `cs-01` | `ko/cs-01.mp3` · `en/cs-01.mp3` | 자, 먼저 첨성대의 전체 외곽부터 만져볼까요? 아래는 넓고 위로 갈수록 좁아지는 석조 구조랍니다. | Let's start by feeling the full outline together. It's wide at the base and gently narrows as it rises. |
| `cs-02` | `ko/cs-02.mp3` · `en/cs-02.mp3` | 첨성대의 중앙부에는 작고 네모난 창이 하나 있어요. 닷패드의 가운데보다 조금 위쪽을 만져보세요. | In the middle section you'll find a small square opening. Feel slightly above the center to meet it. |
| `cs-03` | `ko/cs-03.mp3` · `en/cs-03.mp3` | 아래쪽에는 넓고 안정적인 받침 구조가 있답니다. 닷패드의 하단 부분을 만져보세요. | Down below sits a wide, stable base. Feel the bottom area of the Dot Pad. |
| `cs-04` | `ko/cs-04.mp3` · `en/cs-04.mp3` | 위쪽은 아래보다 좁아지면서 평평하게 마무리돼요. 상단과 하단의 폭 차이를 한번 비교해볼까요? | The top narrows and finishes with a flat cap. Try comparing the width at the top with the width at the bottom. |
| `cs-05` | `ko/cs-05.mp3` · `en/cs-05.mp3` | 자, 퀴즈예요! 첨성대의 창은 어디에 있었을까요? 상단, 중앙, 하단 중에서 골라보세요. | Here's a quiz! Where was the window? Choose: top, middle, or bottom. |
| `mj-01` | `ko/mj-01.mp3` · `en/mj-01.mp3` | 백자 달항아리의 전체 형태를 만져볼까요? 달처럼 크고 둥글답니다. 위쪽엔 작은 목이, 아래쪽엔 짧은 굽이 있어요. | Let's feel the whole shape of the Moon Jar. It's round and full like the moon, with a small neck up top and a short foot below. |
| `mj-02` | `ko/mj-02.mp3` · `en/mj-02.mp3` | 달항아리는 세 부분으로 나뉘어요. 위쪽 좁은 목, 가운데 넓은 몸체, 아래쪽 짧은 굽이지요. 경계선을 따라 손가락을 옮겨보세요. | The Moon Jar has three parts: a narrow neck on top, a wide body in the middle, and a short foot below. Trace along the boundaries with your finger. |
| `mj-03` | `ko/mj-03.mp3` · `en/mj-03.mp3` | 표면에는 위도선처럼 가로로 흐르는 미묘한 곡선들이 있어요. 이 선들이 항아리의 둥근 입체감을 살려준답니다. | Across the surface run subtle horizontal curves, like latitude lines on a globe. They're what bring out the jar's rounded, three-dimensional feel. |
| `mj-04` | `ko/mj-04.mp3` · `en/mj-04.mp3` | 사실 달항아리는 완벽한 원형이 아니에요. 위아래 두 반구를 붙여 만들어서 좌우가 살짝 다르답니다. 바로 이 불완전한 아름다움이 매력이지요. | Here's a secret: the Moon Jar isn't a perfect sphere. Made by joining two half-spheres, it's a touch asymmetrical left to right — and that little imperfection is exactly its charm. |
| `mj-05` | `ko/mj-05.mp3` · `en/mj-05.mp3` | 자, 퀴즈예요! 달항아리에서 가장 넓은 부분은 어디일까요? 위쪽 목 부분, 가운데 몸체 부분, 아래쪽 굽 부분 중에서 골라보세요. | Quiz time! Where's the widest part of the Moon Jar? Top neck, middle body, or bottom foot? |
| `rt-01` | `ko/rt-01.mp3` · `en/rt-01.mp3` | 수막새의 전체 형태는 동그란 원형이에요. 테두리를 손끝으로 따라가며 둥근 모양을 느껴보세요. | The roof tile is a circle. Trace the border with your fingertip and enjoy that round shape. |
| `rt-02` | `ko/rt-02.mp3` · `en/rt-02.mp3` | 중앙에서 연꽃잎 8개가 방사형으로 쭉 뻗어나가요. 꽃이 활짝 피어나듯, 잎을 하나씩 찾아볼까요? | From the center, eight lotus petals spread outward like a flower in bloom. Let's find each petal, one by one. |
| `rt-03` | `ko/rt-03.mp3` · `en/rt-03.mp3` | 연꽃잎마다 중심을 가로지르는 선이 하나씩 있어요. 이 선을 따라 꽃잎의 잎맥을 느껴보세요. | Each lotus petal carries a central spine line. Follow it to feel the vein running through the petal. |
| `rt-04` | `ko/rt-04.mp3` · `en/rt-04.mp3` | 패드 중앙에는 높이 솟아오른 꽃심이 있는데, 수막새에서 가장 높은 곳이랍니다. 중앙의 돌기를 손끝으로 찾아보세요. | At the center rises the flower's heart — a raised boss, the highest point of the tile. Find that raised spot with your fingertip. |
| `rt-05` | `ko/rt-05.mp3` · `en/rt-05.mp3` | 자, 퀴즈예요! 수막새의 연꽃잎은 모두 몇 개일까요? 6개, 8개, 10개 중에서 골라보세요. | Here's a quiz! How many lotus petals does the roof tile have? Choose: 6, 8, or 10. |
| `ts-01` | `ko/ts-01.mp3` · `en/ts-01.mp3` | 전통 선박의 전체 형태를 만져볼까요? 왼쪽은 넓적한 고물, 오른쪽은 뾰족한 이물이에요. 가운데엔 돛대가 서 있답니다. | Let's feel the whole shape of this traditional vessel. The left side is the broad stern, the right is the pointed bow, and the mast stands tall in the middle. |
| `ts-02` | `ko/ts-02.mp3` · `en/ts-02.mp3` | 조선 선박의 가장 큰 특징은 바로 평평한 밑바닥이에요. 서양 배처럼 뾰족한 용골이 없어서 얕은 바다도 잘 다녔답니다. 닷패드 아래쪽 평평한 선을 느껴보세요. | The standout feature is its flat bottom. Unlike Western ships with a pointed keel, this let it sail through shallow waters with ease. Feel the flat line along the bottom of the Dot Pad. |
| `ts-03` | `ko/ts-03.mp3` · `en/ts-03.mp3` | 배의 양쪽에는 노의 위치가 표시되어 있어요. 왼쪽 끝에는 방향을 조종하는 방향타가 있고요. 이 장치들 덕분에 좁은 해안도 거뜬히 항해할 수 있었답니다. | Oar positions are marked on both sides, and at the far left is the rudder for steering. Thanks to these, the ship could navigate even narrow coastal waters. |
| `ts-04` | `ko/ts-04.mp3` · `en/ts-04.mp3` | 오른쪽 이물은 물살을 가르려고 좁고 뾰족하고, 왼쪽 고물은 넓고 평평해요. 양쪽 끝을 손으로 비교해볼까요? | The bow on the right is narrow and pointed to cut through the water, while the stern on the left is wide and flat. Try comparing both ends with your hands. |
| `ts-05` | `ko/ts-05.mp3` · `en/ts-05.mp3` | 자, 퀴즈예요! 조선 전통 선박의 특징적인 밑바닥 구조는 무엇일까요? 평저형, 첨저형, 원저형 중에서 골라보세요. | Quiz time! What kind of hull bottom does the traditional Korean vessel have? Flat-bottomed, V-shaped, or round-bottomed? |
| `moon-jar-front` | `ko/moon-jar-front.mp3` · `en/moon-jar-front.mp3` | 둥근 몸체를 정면에서 본 윤곽이에요. 위쪽 좁은 목, 가운데 넓은 몸체, 아래 짧은 굽으로 이어진답니다. | Here's the front outline of that round body — a narrow neck on top, a wide belly in the middle, and a short foot below. |
| `moon-jar-side` | `ko/moon-jar-side.mp3` · `en/moon-jar-side.mp3` | 목, 몸체, 굽 이렇게 세 구역의 구조를 옆에서 본 모습이에요. | This is the side view, showing the three zones: neck, body, and foot. |
| `moon-jar-top` | `ko/moon-jar-top.mp3` · `en/moon-jar-top.mp3` | 입구에서 내려다본 동심원이에요. 가장 안쪽의 작은 원이 바로 입, 아가리랍니다. | Looking down the mouth, you see concentric rings — and the small inner ring is the opening itself. |
| `moon-jar-detail` | `ko/moon-jar-detail.mp3` · `en/moon-jar-detail.mp3` | 둥근 표면을 가로지르는 곡선 결이에요. 이 결이 항아리의 입체감을 살려준답니다. | These are the curved contour lines crossing the round surface — they're what give the jar its sense of volume. |
| `cheomseongdae-front` | `ko/cheomseongdae-front.mp3` · `en/cheomseongdae-front.mp3` | 아래는 넓고 위로 갈수록 좁아지는 석조 천문대를 정면에서 본 윤곽이에요. | Here's the front outline of the stone observatory — wide at the base and tapering toward the top. |
| `cheomseongdae-side` | `ko/cheomseongdae-side.mp3` · `en/cheomseongdae-side.mp3` | 완만하게 휘어 오르는 곡선 몸체를 옆에서 본 모습이에요. | This is the side view of that gently curving body as it rises. |
| `cheomseongdae-top` | `ko/cheomseongdae-top.mp3` · `en/cheomseongdae-top.mp3` | 정상부의 평평한 정자석 구조랍니다. | And here are the flat well-frame stones right at the top. |
| `cheomseongdae-detail` | `ko/cheomseongdae-detail.mp3` · `en/cheomseongdae-detail.mp3` | 넓고 안정적인 받침 구조예요. | This is the wide, stable base platform. |
| `moon-jar-hotspot-mouth` | `ko/moon-jar-hotspot-mouth.mp3` · `en/moon-jar-hotspot-mouth.mp3` | 위쪽의 좁은 입 부분이에요. 살짝 비대칭으로 벌어져서 달항아리 특유의 멋을 더해준답니다. | This is the narrow mouth on top. Its slight asymmetry is just what gives the moon jar its distinctive charm. |
| `moon-jar-hotspot-equator` | `ko/moon-jar-hotspot-equator.mp3` · `en/moon-jar-hotspot-equator.mp3` | 달항아리에서 가장 넓은 곳, 몸체의 한가운데예요. 위아래 두 반구를 이어 붙인 바로 그 자리랍니다. | This is the widest part, right at the middle of the body — exactly where the two thrown halves were joined. |
| `moon-jar-hotspot-foot` | `ko/moon-jar-hotspot-foot.mp3` · `en/moon-jar-hotspot-foot.mp3` | 아래쪽의 짧은 굽이에요. 넉넉한 몸체를 든든하게 받쳐준답니다. | This is the short foot at the bottom, steadying that generous body so nicely. |
| `cheomseongdae-hotspot-window` | `ko/cheomseongdae-hotspot-window.mp3` · `en/cheomseongdae-hotspot-window.mp3` | 몸체 가운데의 네모난 창이에요. 드나드는 출입구 역할을 했답니다. | This is the square window in the middle of the body — it served as the entrance. |
| `cheomseongdae-hotspot-base` | `ko/cheomseongdae-hotspot-base.mp3` · `en/cheomseongdae-hotspot-base.mp3` | 아래쪽의 넓고 안정적인 받침 구조예요. | This is the wide, stable supporting base at the bottom. |
| `cheomseongdae-hotspot-top` | `ko/cheomseongdae-hotspot-top.mp3` · `en/cheomseongdae-hotspot-top.mp3` | 정상부의 우물 정(井)자 모양 돌 구조랍니다. | And up top is the well-shaped stone frame, like the character 井. |

## Paste into AVAILABLE_AUDIO once files exist

```ts
  'ko/cs-01', 'en/cs-01',
  'ko/cs-02', 'en/cs-02',
  'ko/cs-03', 'en/cs-03',
  'ko/cs-04', 'en/cs-04',
  'ko/cs-05', 'en/cs-05',
  'ko/mj-01', 'en/mj-01',
  'ko/mj-02', 'en/mj-02',
  'ko/mj-03', 'en/mj-03',
  'ko/mj-04', 'en/mj-04',
  'ko/mj-05', 'en/mj-05',
  'ko/rt-01', 'en/rt-01',
  'ko/rt-02', 'en/rt-02',
  'ko/rt-03', 'en/rt-03',
  'ko/rt-04', 'en/rt-04',
  'ko/rt-05', 'en/rt-05',
  'ko/ts-01', 'en/ts-01',
  'ko/ts-02', 'en/ts-02',
  'ko/ts-03', 'en/ts-03',
  'ko/ts-04', 'en/ts-04',
  'ko/ts-05', 'en/ts-05',
  'ko/moon-jar-front', 'en/moon-jar-front',
  'ko/moon-jar-side', 'en/moon-jar-side',
  'ko/moon-jar-top', 'en/moon-jar-top',
  'ko/moon-jar-detail', 'en/moon-jar-detail',
  'ko/cheomseongdae-front', 'en/cheomseongdae-front',
  'ko/cheomseongdae-side', 'en/cheomseongdae-side',
  'ko/cheomseongdae-top', 'en/cheomseongdae-top',
  'ko/cheomseongdae-detail', 'en/cheomseongdae-detail',
  'ko/moon-jar-hotspot-mouth', 'en/moon-jar-hotspot-mouth',
  'ko/moon-jar-hotspot-equator', 'en/moon-jar-hotspot-equator',
  'ko/moon-jar-hotspot-foot', 'en/moon-jar-hotspot-foot',
  'ko/cheomseongdae-hotspot-window', 'en/cheomseongdae-hotspot-window',
  'ko/cheomseongdae-hotspot-base', 'en/cheomseongdae-hotspot-base',
  'ko/cheomseongdae-hotspot-top', 'en/cheomseongdae-hotspot-top',
```
