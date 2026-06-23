import type { Heritage } from '../types/heritage';

export const heritageList: Heritage[] = [
  {
    id: 'cheomseongdae',
    title: { ko: '첨성대', en: 'Cheomseongdae' },
    period: { ko: '신라, 7세기', en: 'Silla Dynasty, 7th Century' },
    location: { ko: '경주', en: 'Gyeongju' },
    type: { ko: '건축', en: 'Architecture' },
    description: {
      ko: '첨성대는 동아시아에서 가장 오래된 천문 관측대입니다. 화강암 362개로 쌓인 석조 구조물로, 아래가 넓고 위로 갈수록 좁아지는 독특한 형태가 특징입니다.',
      en: 'Cheomseongdae is the oldest surviving astronomical observatory in Asia. Built from 362 granite stones, it features a distinctive tapered form—wide at the base and narrowing toward the top.',
    },
    tactileDifficulty: 'Easy',
    recommendedFor: ['School', 'Museum', 'Intro Demo'],
    slides: [
      {
        id: 'cs-01', heritageId: 'cheomseongdae',
        title: { ko: '전체 형태', en: 'Overall Shape' },
        subtitle: { ko: '첨성대의 외곽을 먼저 만져봅니다.', en: 'First, feel the outline of Cheomseongdae.' },
        visualType: '3d', cameraView: 'front',
        ttsText: {
          ko: '먼저 첨성대의 전체 외곽을 만져보세요. 아래는 넓고 위로 갈수록 좁아지는 석조 구조입니다.',
          en: 'Begin by feeling the full outline of Cheomseongdae. It is a stone structure—wide at the base and tapering as it rises.',
        },
        brailleText: ['첨성대 전체', '아래 넓고 위 좁음'],
        tactileGraphicId: 'cheomseongdae-silhouette',
        tactileLayer: 'overview', interactionType: 'touch',
      },
      {
        id: 'cs-02', heritageId: 'cheomseongdae',
        title: { ko: '중앙 창', en: 'Central Window' },
        subtitle: { ko: '중앙의 작은 네모를 찾아봅니다.', en: 'Find the small square in the center.' },
        visualType: '3d', cameraView: 'detail',
        ttsText: {
          ko: '첨성대의 중앙부에는 작은 네모 모양의 창이 있습니다. 닷패드의 가운데보다 조금 위쪽을 만져보세요.',
          en: 'There is a small square opening in the middle section. Feel slightly above the center of the Dot Pad.',
        },
        brailleText: ['중앙 창', '가운데 네모'],
        tactileGraphicId: 'cheomseongdae-window',
        tactileLayer: 'focus', highlightPart: 'window', interactionType: 'find',
      },
      {
        id: 'cs-03', heritageId: 'cheomseongdae',
        title: { ko: '하단 기단부', en: 'Lower Base' },
        subtitle: { ko: '아래쪽 받침 구조를 탐색합니다.', en: 'Explore the wide base platform.' },
        visualType: '3d', cameraView: 'front',
        ttsText: {
          ko: '아래쪽에는 넓고 안정적인 받침 구조가 있습니다. 닷패드의 하단 부분을 만져보세요.',
          en: 'The lower section has a wide, stable base platform. Feel the bottom area of the Dot Pad.',
        },
        brailleText: ['하단 기단', '넓은 받침'],
        tactileGraphicId: 'cheomseongdae-base',
        tactileLayer: 'part', highlightPart: 'base', interactionType: 'touch',
      },
      {
        id: 'cs-04', heritageId: 'cheomseongdae',
        title: { ko: '상단 구조', en: 'Upper Structure' },
        subtitle: { ko: '위쪽이 좁아지는 구조를 확인합니다.', en: 'Notice how the top narrows.' },
        visualType: '3d', cameraView: 'front',
        ttsText: {
          ko: '첨성대의 위쪽은 아래보다 좁아지며 평평한 구조로 마무리됩니다. 상단과 하단의 폭 차이를 비교해보세요.',
          en: 'The top of Cheomseongdae narrows and ends with a flat cap. Compare the width at the top versus the bottom.',
        },
        brailleText: ['상단 구조', '위쪽은 좁음'],
        tactileGraphicId: 'cheomseongdae-top',
        tactileLayer: 'part', highlightPart: 'top', interactionType: 'touch',
      },
      {
        id: 'cs-05', heritageId: 'cheomseongdae',
        title: { ko: '창 위치 찾기', en: 'Find the Window' },
        subtitle: { ko: '퀴즈: 창이 있는 위치를 고르세요.', en: 'Quiz: choose where the window is located.' },
        visualType: 'diagram', cameraView: 'front',
        ttsText: {
          ko: '퀴즈입니다. 첨성대의 창은 어디에 있었나요? 상단, 중앙, 하단 중에서 선택해보세요.',
          en: 'Quiz time. Where was the window of Cheomseongdae? Choose: top, middle, or bottom.',
        },
        brailleText: ['퀴즈', '창 위치 찾기'],
        tactileGraphicId: 'cheomseongdae-quiz',
        tactileLayer: 'quiz', highlightPart: 'window', interactionType: 'quiz',
        quizOptions: [
          { ko: '상단', en: 'Top' },
          { ko: '중앙', en: 'Middle' },
          { ko: '하단', en: 'Bottom' },
        ],
        quizAnswer: '중앙',
      },
    ],
  },
  {
    id: 'moon-jar',
    title: { ko: '백자 달항아리', en: 'Moon Jar' },
    period: { ko: '조선, 17–18세기', en: 'Joseon Dynasty, 17–18th Century' },
    location: { ko: '서울', en: 'Seoul' },
    type: { ko: '도자기', en: 'Ceramics' },
    description: {
      ko: '백자 달항아리는 조선시대 백자 중 가장 아름다운 작품으로 꼽힙니다. 달처럼 둥글고 넉넉한 형태가 특징입니다.',
      en: 'The Moon Jar is considered one of the finest examples of Joseon white porcelain—round as the moon, generous in form.',
    },
    tactileDifficulty: 'Easy',
    recommendedFor: ['School', 'Museum'],
    slides: [],
  },
  {
    id: 'roof-tile',
    title: { ko: '신라 수막새', en: 'Silla Roof-end Tile' },
    period: { ko: '신라, 7–8세기', en: 'Silla Dynasty, 7–8th Century' },
    location: { ko: '경주', en: 'Gyeongju' },
    type: { ko: '기와', en: 'Roof Tile' },
    description: {
      ko: '신라의 수막새는 연꽃 문양이 정교하게 새겨진 원형 기와입니다. 원의 중심에서 방사형으로 뻗어나오는 연꽃잎 패턴이 특징입니다.',
      en: 'Silla roof-end tiles feature an intricate lotus design. The petals radiate outward from the center in a circular pattern.',
    },
    tactileDifficulty: 'Medium',
    recommendedFor: ['School', 'Museum'],
    slides: [],
  },
  {
    id: 'traditional-ship',
    title: { ko: '전통 선박', en: 'Traditional Ship' },
    period: { ko: '조선, 15–19세기', en: 'Joseon Dynasty, 15–19th Century' },
    location: { ko: '전국', en: 'Nationwide' },
    type: { ko: '선박', en: 'Vessel' },
    description: {
      ko: '조선의 전통 선박은 독특한 평저선 구조로 얕은 바다에서도 안정적으로 항해할 수 있었습니다.',
      en: 'The traditional Korean vessel featured a flat-bottomed hull suited for shallow coastal waters.',
    },
    tactileDifficulty: 'Hard',
    recommendedFor: ['School'],
    slides: [],
  },
];

export const getTactileMatrix = (id: string) => {
  // Dynamically imported in components
  return id;
};
