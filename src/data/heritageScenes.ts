import type { HeritageScene } from '../types/tactileSync';

const BASE = import.meta.env.BASE_URL;

/**
 * Interactive sync scenes: 3D model + per-view tactile mappings + key-point
 * hotspots. Ordered for prev/next heritage navigation. All copy is bilingual.
 */
export const heritageScenes: HeritageScene[] = [
  {
    id: 'moon-jar',
    name: { ko: '백자 달항아리', en: 'White Porcelain Moon Jar' },
    modelUrl: `${BASE}models/moon-jar.glb`,
    tactileViews: {
      front: {
        patternId: 'moon-jar-front',
        brailleText: { ko: '달항아리 정면', en: 'Moon Jar · front' },
        description: {
          ko: '둥근 몸체를 정면에서 본 윤곽이에요. 위쪽 좁은 목, 가운데 넓은 몸체, 아래 짧은 굽으로 이어진답니다.',
          en: 'Here\'s the front outline of that round body — a narrow neck on top, a wide belly in the middle, and a short foot below.',
        },
      },
      side: {
        patternId: 'moon-jar-side',
        brailleText: { ko: '달항아리 측면', en: 'Moon Jar · side' },
        description: {
          ko: '목, 몸체, 굽 이렇게 세 구역의 구조를 옆에서 본 모습이에요.',
          en: 'This is the side view, showing the three zones: neck, body, and foot.',
        },
      },
      top: {
        patternId: 'moon-jar-top',
        brailleText: { ko: '달항아리 윗면', en: 'Moon Jar · top' },
        description: {
          ko: '입구에서 내려다본 동심원이에요. 가장 안쪽의 작은 원이 바로 입, 아가리랍니다.',
          en: 'Looking down the mouth, you see concentric rings — and the small inner ring is the opening itself.',
        },
      },
      detail: {
        patternId: 'moon-jar-detail',
        brailleText: { ko: '표면 곡선', en: 'Surface curve' },
        description: {
          ko: '둥근 표면을 가로지르는 곡선 결이에요. 이 결이 항아리의 입체감을 살려준답니다.',
          en: 'These are the curved contour lines crossing the round surface — they\'re what give the jar its sense of volume.',
        },
      },
    },
    hotspots: [
      {
        id: 'mouth',
        label: { ko: '입(아가리)', en: 'Mouth' },
        position: [0, 1.9, 0],
        patternId: 'moon-jar-hotspot-mouth',
        brailleText: { ko: '입 부분', en: 'Mouth' },
        narration: {
          ko: '위쪽의 좁은 입 부분이에요. 살짝 비대칭으로 벌어져서 달항아리 특유의 멋을 더해준답니다.',
          en: 'This is the narrow mouth on top. Its slight asymmetry is just what gives the moon jar its distinctive charm.',
        },
      },
      {
        id: 'equator',
        label: { ko: '몸체 최대지름', en: 'Widest body' },
        position: [2.0, 0.1, 0],
        patternId: 'moon-jar-hotspot-equator',
        brailleText: { ko: '가장 넓은 곳', en: 'Widest point' },
        narration: {
          ko: '달항아리에서 가장 넓은 곳, 몸체의 한가운데예요. 위아래 두 반구를 이어 붙인 바로 그 자리랍니다.',
          en: 'This is the widest part, right at the middle of the body — exactly where the two thrown halves were joined.',
        },
      },
      {
        id: 'foot',
        label: { ko: '굽', en: 'Foot' },
        position: [0, -1.9, 0],
        patternId: 'moon-jar-hotspot-foot',
        brailleText: { ko: '굽 부분', en: 'Foot' },
        narration: {
          ko: '아래쪽의 짧은 굽이에요. 넉넉한 몸체를 든든하게 받쳐준답니다.',
          en: 'This is the short foot at the bottom, steadying that generous body so nicely.',
        },
      },
    ],
  },
  {
    id: 'cheomseongdae',
    name: { ko: '첨성대', en: 'Cheomseongdae' },
    modelUrl: `${BASE}models/cheomseongdae.glb`,
    tactileViews: {
      front: {
        patternId: 'cheomseongdae-front',
        brailleText: { ko: '첨성대 정면', en: 'Cheomseongdae · front' },
        description: {
          ko: '아래는 넓고 위로 갈수록 좁아지는 석조 천문대를 정면에서 본 윤곽이에요.',
          en: 'Here\'s the front outline of the stone observatory — wide at the base and tapering toward the top.',
        },
      },
      side: {
        patternId: 'cheomseongdae-side',
        brailleText: { ko: '첨성대 측면', en: 'Cheomseongdae · side' },
        description: {
          ko: '완만하게 휘어 오르는 곡선 몸체를 옆에서 본 모습이에요.',
          en: 'This is the side view of that gently curving body as it rises.',
        },
      },
      top: {
        patternId: 'cheomseongdae-top',
        brailleText: { ko: '첨성대 상단', en: 'Cheomseongdae · top' },
        description: {
          ko: '정상부의 평평한 정자석 구조랍니다.',
          en: 'And here are the flat well-frame stones right at the top.',
        },
      },
      detail: {
        patternId: 'cheomseongdae-detail',
        brailleText: { ko: '하단 기단', en: 'Lower base' },
        description: {
          ko: '넓고 안정적인 받침 구조예요.',
          en: 'This is the wide, stable base platform.',
        },
      },
    },
    hotspots: [
      {
        id: 'window',
        label: { ko: '중앙 창', en: 'Central window' },
        position: [1.0, 0.3, 0.6],
        patternId: 'cheomseongdae-hotspot-window',
        brailleText: { ko: '중앙 창', en: 'Window' },
        narration: {
          ko: '몸체 가운데의 네모난 창이에요. 드나드는 출입구 역할을 했답니다.',
          en: 'This is the square window in the middle of the body — it served as the entrance.',
        },
      },
      {
        id: 'base',
        label: { ko: '하단 기단', en: 'Base' },
        position: [0, -2.6, 0],
        patternId: 'cheomseongdae-hotspot-base',
        brailleText: { ko: '하단 기단', en: 'Base' },
        narration: {
          ko: '아래쪽의 넓고 안정적인 받침 구조예요.',
          en: 'This is the wide, stable supporting base at the bottom.',
        },
      },
      {
        id: 'top',
        label: { ko: '상단 정자석', en: 'Top stones' },
        position: [0, 2.8, 0],
        patternId: 'cheomseongdae-hotspot-top',
        brailleText: { ko: '상단 구조', en: 'Top' },
        narration: {
          ko: '정상부의 우물 정(井)자 모양 돌 구조랍니다.',
          en: 'And up top is the well-shaped stone frame, like the character 井.',
        },
      },
    ],
  },
];

export function getScene(id: string): HeritageScene | undefined {
  return heritageScenes.find((s) => s.id === id);
}
