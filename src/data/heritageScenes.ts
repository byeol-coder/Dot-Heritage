import type { HeritageScene } from '../types/tactileSync';

const BASE = import.meta.env.BASE_URL;

/**
 * Interactive sync scenes: 3D model + per-view tactile mappings + key-point
 * hotspots. Ordered for prev/next heritage navigation.
 */
export const heritageScenes: HeritageScene[] = [
  {
    id: 'moon-jar',
    name: '백자 달항아리',
    modelUrl: `${BASE}models/moon-jar.glb`,
    tactileViews: {
      front: {
        patternId: 'moon-jar-front',
        brailleText: '달항아리 정면',
        description: '둥근 몸체의 정면 윤곽입니다. 위쪽 좁은 목, 가운데 넓은 몸체, 아래 짧은 굽으로 이어집니다.',
      },
      side: {
        patternId: 'moon-jar-side',
        brailleText: '달항아리 측면',
        description: '목·몸체·굽 세 구역의 구조를 옆에서 본 모습입니다.',
      },
      top: {
        patternId: 'moon-jar-top',
        brailleText: '달항아리 윗면',
        description: '입구에서 내려다본 동심원입니다. 가장 안쪽 작은 원이 입(아가리)입니다.',
      },
      detail: {
        patternId: 'moon-jar-detail',
        brailleText: '표면 곡선',
        description: '둥근 표면을 가로지르는 곡선 결로, 항아리의 입체감을 표현합니다.',
      },
    },
    hotspots: [
      {
        id: 'mouth',
        label: '입(아가리)',
        position: [0, 1.9, 0],
        patternId: 'moon-jar-hotspot-mouth',
        brailleText: '입 부분',
        narration: '위쪽의 좁은 입 부분입니다. 살짝 비대칭으로 벌어져 달항아리 특유의 멋을 줍니다.',
      },
      {
        id: 'equator',
        label: '몸체 최대지름',
        position: [2.0, 0.1, 0],
        patternId: 'moon-jar-hotspot-equator',
        brailleText: '가장 넓은 곳',
        narration: '달항아리에서 가장 넓은 부분, 몸체의 한가운데입니다. 위아래 두 반구를 이어 붙인 자리입니다.',
      },
      {
        id: 'foot',
        label: '굽',
        position: [0, -1.9, 0],
        patternId: 'moon-jar-hotspot-foot',
        brailleText: '굽 부분',
        narration: '아래쪽의 짧은 굽으로, 넉넉한 몸체를 안정적으로 받칩니다.',
      },
    ],
  },
  {
    id: 'cheomseongdae',
    name: '첨성대',
    modelUrl: `${BASE}models/cheomseongdae.glb`,
    tactileViews: {
      front: {
        patternId: 'cheomseongdae-front',
        brailleText: '첨성대 정면',
        description: '아래는 넓고 위로 갈수록 좁아지는 석조 천문대의 정면 윤곽입니다.',
      },
      side: {
        patternId: 'cheomseongdae-side',
        brailleText: '첨성대 측면',
        description: '완만하게 휘어 오르는 곡선 몸체를 옆에서 본 모습입니다.',
      },
      top: {
        patternId: 'cheomseongdae-top',
        brailleText: '첨성대 상단',
        description: '정상부의 평평한 정자석 구조입니다.',
      },
      detail: {
        patternId: 'cheomseongdae-detail',
        brailleText: '하단 기단',
        description: '넓고 안정적인 받침 구조입니다.',
      },
    },
    hotspots: [
      {
        id: 'window',
        label: '중앙 창',
        position: [1.0, 0.3, 0.6],
        patternId: 'cheomseongdae-hotspot-window',
        brailleText: '중앙 창',
        narration: '몸체 가운데의 네모난 창으로, 드나드는 출입구 역할을 했습니다.',
      },
      {
        id: 'base',
        label: '하단 기단',
        position: [0, -2.6, 0],
        patternId: 'cheomseongdae-hotspot-base',
        brailleText: '하단 기단',
        narration: '아래쪽의 넓고 안정적인 받침 구조입니다.',
      },
      {
        id: 'top',
        label: '상단 정자석',
        position: [0, 2.8, 0],
        patternId: 'cheomseongdae-hotspot-top',
        brailleText: '상단 구조',
        narration: '정상부의 우물 정(井)자 모양 돌 구조입니다.',
      },
    ],
  },
];

export function getScene(id: string): HeritageScene | undefined {
  return heritageScenes.find((s) => s.id === id);
}
