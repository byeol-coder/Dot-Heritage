# Narration Manifest — pre-rendered audio (GPT-SoVITS)

Generate one audio file per row per language with a natural voice, then
place them at `public/assets/audio/<lang>/<key>.mp3` and add the matching
`'<lang>/<key>'` entries to `AVAILABLE_AUDIO` in
`src/engine/narration/audioManifest.ts`. The app plays the file when present
and otherwise falls back to the browser voice — no code changes needed.


Total: **34 keys × 2 languages = 68 files**.


| key | file (ko / en) | 한국어 | English |
|---|---|---|---|
| `cs-01` | `ko/cs-01.mp3` · `en/cs-01.mp3` | 먼저 첨성대의 전체 외곽을 만져보세요. 아래는 넓고 위로 갈수록 좁아지는 석조 구조입니다. | Begin by feeling the full outline. It is wide at the base and tapers as it rises. |
| `cs-02` | `ko/cs-02.mp3` · `en/cs-02.mp3` | 첨성대의 중앙부에는 작은 네모 모양의 창이 있습니다. 닷패드의 가운데보다 조금 위쪽을 만져보세요. | There is a small square opening in the middle section. Feel slightly above the center. |
| `cs-03` | `ko/cs-03.mp3` · `en/cs-03.mp3` | 아래쪽에는 넓고 안정적인 받침 구조가 있습니다. 닷패드의 하단 부분을 만져보세요. | The lower section has a wide, stable base. Feel the bottom area of the Dot Pad. |
| `cs-04` | `ko/cs-04.mp3` · `en/cs-04.mp3` | 첨성대의 위쪽은 아래보다 좁아지며 평평한 구조로 마무리됩니다. 상단과 하단의 폭 차이를 비교해보세요. | The top narrows and ends with a flat cap. Compare the width at top versus bottom. |
| `cs-05` | `ko/cs-05.mp3` · `en/cs-05.mp3` | 퀴즈입니다. 첨성대의 창은 어디에 있었나요? 상단, 중앙, 하단 중에서 선택해보세요. | Quiz time. Where was the window? Choose: top, middle, or bottom. |
| `mj-01` | `ko/mj-01.mp3` · `en/mj-01.mp3` | 백자 달항아리의 전체 형태를 만져보세요. 달처럼 크고 둥근 형태입니다. 위쪽에 작은 목 부분이 있고, 아래쪽에는 짧은 굽이 있습니다. | Feel the overall form of the Moon Jar. It is round and full like the moon, with a small neck at the top and a short foot at the bottom. |
| `mj-02` | `ko/mj-02.mp3` · `en/mj-02.mp3` | 달항아리는 세 부분으로 나뉩니다. 위쪽의 좁은 목, 가운데의 넓은 몸체, 아래쪽의 짧은 굽입니다. 경계선을 따라 손가락을 이동해보세요. | The Moon Jar has three parts: a narrow neck at the top, a wide body in the middle, and a short foot at the bottom. Trace the boundaries with your finger. |
| `mj-03` | `ko/mj-03.mp3` · `en/mj-03.mp3` | 달항아리의 표면에는 위도선처럼 가로로 흐르는 미묘한 곡선이 있습니다. 이 선들이 항아리의 둥근 입체감을 표현합니다. | The surface has subtle horizontal curves, like latitude lines on a globe. These lines convey the three-dimensional roundness of the jar. |
| `mj-04` | `ko/mj-04.mp3` · `en/mj-04.mp3` | 달항아리는 완벽한 원형이 아닙니다. 위아래 두 개의 반구를 붙여 만들기 때문에 미묘하게 좌우가 다릅니다. 이 불완전한 아름다움이 달항아리의 매력입니다. | The Moon Jar is not a perfect sphere. Made by joining two half-spheres, it has subtle left-right asymmetry. This imperfection is its beauty. |
| `mj-05` | `ko/mj-05.mp3` · `en/mj-05.mp3` | 퀴즈입니다. 달항아리에서 가장 넓은 부분은 어디일까요? 위쪽 목 부분, 가운데 몸체 부분, 아래쪽 굽 부분 중 선택하세요. | Quiz: Where is the widest part of the Moon Jar? Top neck, middle body, or bottom foot? |
| `rt-01` | `ko/rt-01.mp3` · `en/rt-01.mp3` | 수막새의 전체 형태는 원형입니다. 테두리를 손끝으로 따라가며 원의 형태를 느껴보세요. | The roof tile is circular. Trace the border with your fingertip to feel the round shape. |
| `rt-02` | `ko/rt-02.mp3` · `en/rt-02.mp3` | 중앙에서 8개의 연꽃잎이 방사형으로 뻗어납니다. 마치 꽃이 피어나는 것처럼 각 잎을 하나씩 찾아보세요. | Eight lotus petals radiate from the center like a blooming flower. Find each petal one by one. |
| `rt-03` | `ko/rt-03.mp3` · `en/rt-03.mp3` | 각 연꽃잎에는 중심을 가로지르는 선이 있습니다. 이 선을 따라 꽃잎의 잎맥을 느껴보세요. | Each lotus petal has a central spine line. Feel the vein running through each petal. |
| `rt-04` | `ko/rt-04.mp3` · `en/rt-04.mp3` | 패드 중앙에 높이 솟아오른 꽃심이 있습니다. 이 부분이 수막새에서 가장 높은 곳입니다. 중앙의 돌기를 손끝으로 찾아보세요. | At the center is a raised boss—the highest point of the tile. Find this raised area with your fingertip. |
| `rt-05` | `ko/rt-05.mp3` · `en/rt-05.mp3` | 퀴즈입니다. 수막새의 연꽃잎은 몇 개일까요? 6개, 8개, 10개 중에서 선택하세요. | Quiz: How many lotus petals does the roof tile have? Choose: 6, 8, or 10. |
| `ts-01` | `ko/ts-01.mp3` · `en/ts-01.mp3` | 전통 선박의 전체 형태를 만져보세요. 배는 왼쪽이 넓적한 고물, 오른쪽이 뾰족한 이물입니다. 가운데에 돛대가 있습니다. | Feel the overall shape of the traditional vessel. The left side is the stern, the right is the pointed bow. The mast stands in the middle. |
| `ts-02` | `ko/ts-02.mp3` · `en/ts-02.mp3` | 조선 선박의 가장 큰 특징은 평평한 밑바닥입니다. 서양 배처럼 뾰족한 용골이 없어 얕은 바다에서도 다닐 수 있었습니다. 닷패드 아래쪽 평평한 선을 느껴보세요. | The defining feature is the flat bottom—unlike Western ships with a pointed keel, this allowed navigation in shallow waters. Feel the flat line at the bottom of the Dot Pad. |
| `ts-03` | `ko/ts-03.mp3` · `en/ts-03.mp3` | 배의 양쪽에 노의 위치가 표시되어 있습니다. 왼쪽 끝에는 방향을 조종하는 방향타가 있습니다. 이 장치들 덕분에 좁은 해안도 항해할 수 있었습니다. | Oar positions are marked on both sides. At the far left is the rudder for steering. These devices allowed navigation in narrow coastal waters. |
| `ts-04` | `ko/ts-04.mp3` · `en/ts-04.mp3` | 이물(오른쪽)은 물살을 가르기 위해 좁고 뾰족합니다. 고물(왼쪽)은 넓고 평평합니다. 양쪽 끝을 손으로 비교해보세요. | The bow (right) is narrow and pointed to cut through water. The stern (left) is wider and flat. Compare both ends with your hands. |
| `ts-05` | `ko/ts-05.mp3` · `en/ts-05.mp3` | 퀴즈입니다. 조선 전통 선박의 특징적인 밑바닥 구조는 무엇일까요? 평저형, 첨저형, 원저형 중에서 선택하세요. | Quiz: What type of hull bottom does the traditional Korean vessel have? Flat-bottomed, V-shaped, or round-bottomed? |
| `moon-jar-front` | `ko/moon-jar-front.mp3` · `en/moon-jar-front.mp3` | 둥근 몸체의 정면 윤곽입니다. 위쪽 좁은 목, 가운데 넓은 몸체, 아래 짧은 굽으로 이어집니다. | Front outline of the round body — a narrow neck on top, a wide belly in the middle, and a short foot below. |
| `moon-jar-side` | `ko/moon-jar-side.mp3` · `en/moon-jar-side.mp3` | 목·몸체·굽 세 구역의 구조를 옆에서 본 모습입니다. | Side view showing the three zones: neck, body, and foot. |
| `moon-jar-top` | `ko/moon-jar-top.mp3` · `en/moon-jar-top.mp3` | 입구에서 내려다본 동심원입니다. 가장 안쪽 작은 원이 입(아가리)입니다. | Concentric rings seen looking down the mouth; the small inner ring is the opening. |
| `moon-jar-detail` | `ko/moon-jar-detail.mp3` · `en/moon-jar-detail.mp3` | 둥근 표면을 가로지르는 곡선 결로, 항아리의 입체감을 표현합니다. | Curved contour lines across the round surface that convey its volume. |
| `cheomseongdae-front` | `ko/cheomseongdae-front.mp3` · `en/cheomseongdae-front.mp3` | 아래는 넓고 위로 갈수록 좁아지는 석조 천문대의 정면 윤곽입니다. | Front outline of the stone observatory — wide at the base, tapering toward the top. |
| `cheomseongdae-side` | `ko/cheomseongdae-side.mp3` · `en/cheomseongdae-side.mp3` | 완만하게 휘어 오르는 곡선 몸체를 옆에서 본 모습입니다. | Side view of the gently curving body as it rises. |
| `cheomseongdae-top` | `ko/cheomseongdae-top.mp3` · `en/cheomseongdae-top.mp3` | 정상부의 평평한 정자석 구조입니다. | The flat well-frame stones at the very top. |
| `cheomseongdae-detail` | `ko/cheomseongdae-detail.mp3` · `en/cheomseongdae-detail.mp3` | 넓고 안정적인 받침 구조입니다. | The wide, stable base platform. |
| `moon-jar-hotspot-mouth` | `ko/moon-jar-hotspot-mouth.mp3` · `en/moon-jar-hotspot-mouth.mp3` | 위쪽의 좁은 입 부분입니다. 살짝 비대칭으로 벌어져 달항아리 특유의 멋을 줍니다. | The narrow mouth on top. Its slight asymmetry gives the moon jar its distinctive charm. |
| `moon-jar-hotspot-equator` | `ko/moon-jar-hotspot-equator.mp3` · `en/moon-jar-hotspot-equator.mp3` | 달항아리에서 가장 넓은 부분, 몸체의 한가운데입니다. 위아래 두 반구를 이어 붙인 자리입니다. | The widest part, at the middle of the body — where the two thrown halves were joined. |
| `moon-jar-hotspot-foot` | `ko/moon-jar-hotspot-foot.mp3` · `en/moon-jar-hotspot-foot.mp3` | 아래쪽의 짧은 굽으로, 넉넉한 몸체를 안정적으로 받칩니다. | The short foot at the bottom that steadies the generous body. |
| `cheomseongdae-hotspot-window` | `ko/cheomseongdae-hotspot-window.mp3` · `en/cheomseongdae-hotspot-window.mp3` | 몸체 가운데의 네모난 창으로, 드나드는 출입구 역할을 했습니다. | The square window in the middle of the body, which served as the entrance. |
| `cheomseongdae-hotspot-base` | `ko/cheomseongdae-hotspot-base.mp3` · `en/cheomseongdae-hotspot-base.mp3` | 아래쪽의 넓고 안정적인 받침 구조입니다. | The wide, stable supporting base at the bottom. |
| `cheomseongdae-hotspot-top` | `ko/cheomseongdae-hotspot-top.mp3` · `en/cheomseongdae-hotspot-top.mp3` | 정상부의 우물 정(井)자 모양 돌 구조입니다. | The well-shaped (井) stone frame at the summit. |

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
