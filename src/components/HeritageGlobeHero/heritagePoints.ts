import type { DotCell, DotMatrix } from '../../types/heritage';

const ASSET = import.meta.env.BASE_URL;
const WIDTH = 60;
const HEIGHT = 40;

type MatrixKind = 'temple' | 'pyramid' | 'dome' | 'tower' | 'pagoda';

export type HeritagePoint = {
  id: string;
  country: string;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  image: string;
  imageAlt: string;
  x: number;
  y: number;
  braille: string[];
  features: string[];
  matrix: DotMatrix;
};

function createEmptyMatrix(): DotCell[][] {
  return Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => 0 as DotCell));
}

function setCell(cells: DotCell[][], x: number, y: number, value: DotCell = 3) {
  if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
    cells[y][x] = value;
  }
}

function drawHorizontal(cells: DotCell[][], y: number, x1: number, x2: number, value: DotCell = 3) {
  const start = Math.max(0, Math.min(x1, x2));
  const end = Math.min(WIDTH - 1, Math.max(x1, x2));
  for (let x = start; x <= end; x += 1) setCell(cells, x, y, value);
}

function drawVertical(cells: DotCell[][], x: number, y1: number, y2: number, value: DotCell = 3) {
  const start = Math.max(0, Math.min(y1, y2));
  const end = Math.min(HEIGHT - 1, Math.max(y1, y2));
  for (let y = start; y <= end; y += 1) setCell(cells, x, y, value);
}

function drawDiagonal(cells: DotCell[][], x1: number, y1: number, x2: number, y2: number, value: DotCell = 3) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i += 1) {
    const x = Math.round(x1 + ((x2 - x1) * i) / steps);
    const y = Math.round(y1 + ((y2 - y1) * i) / steps);
    setCell(cells, x, y, value);
  }
}

function createTactileMatrix(kind: MatrixKind): DotMatrix {
  const cells = createEmptyMatrix();

  if (kind === 'temple') {
    drawHorizontal(cells, 31, 13, 47);
    drawHorizontal(cells, 28, 15, 45);
    drawDiagonal(cells, 15, 17, 30, 9);
    drawDiagonal(cells, 30, 9, 45, 17);
    drawHorizontal(cells, 17, 16, 44);
    [19, 25, 31, 37, 43].forEach(x => drawVertical(cells, x, 18, 28));
    drawHorizontal(cells, 14, 24, 36, 2);
  }

  if (kind === 'pyramid') {
    drawHorizontal(cells, 32, 10, 50);
    drawDiagonal(cells, 10, 32, 30, 9);
    drawDiagonal(cells, 30, 9, 50, 32);
    drawDiagonal(cells, 30, 9, 36, 32, 2);
    drawHorizontal(cells, 25, 16, 44, 2);
    drawHorizontal(cells, 18, 22, 38, 2);
  }

  if (kind === 'dome') {
    drawHorizontal(cells, 31, 14, 46);
    drawHorizontal(cells, 28, 18, 42);
    drawHorizontal(cells, 25, 20, 40, 2);
    drawDiagonal(cells, 20, 25, 30, 12);
    drawDiagonal(cells, 30, 12, 40, 25);
    drawVertical(cells, 17, 22, 31);
    drawVertical(cells, 43, 22, 31);
    [24, 30, 36].forEach(x => drawVertical(cells, x, 25, 31));
    setCell(cells, 30, 9, 3);
  }

  if (kind === 'tower') {
    drawHorizontal(cells, 33, 20, 40);
    drawHorizontal(cells, 28, 22, 38);
    drawHorizontal(cells, 22, 23, 37);
    drawHorizontal(cells, 16, 24, 36);
    drawVertical(cells, 23, 16, 33);
    drawVertical(cells, 37, 16, 33);
    drawDiagonal(cells, 24, 16, 27, 8);
    drawDiagonal(cells, 36, 16, 33, 8);
    drawHorizontal(cells, 8, 27, 33);
    drawVertical(cells, 30, 10, 14, 2);
  }

  if (kind === 'pagoda') {
    [14, 19, 24, 29].forEach((y, index) => {
      const inset = index * 3;
      drawHorizontal(cells, y, 14 + inset, 46 - inset);
      drawHorizontal(cells, y + 2, 18 + inset, 42 - inset, 2);
    });
    drawVertical(cells, 25, 14, 32);
    drawVertical(cells, 35, 14, 32);
    drawHorizontal(cells, 34, 18, 42);
    drawDiagonal(cells, 27, 10, 30, 6);
    drawDiagonal(cells, 33, 10, 30, 6);
  }

  return { width: WIDTH, height: HEIGHT, cells };
}

export const heritagePoints: HeritagePoint[] = [
  {
    id: 'parthenon',
    country: 'Greece',
    title: 'Parthenon',
    subtitle: 'Greece · Parthenon',
    period: '5th Century BC',
    description: '고대 그리스 건축의 비례감과 기둥 구조를 촉각 윤곽으로 탐험합니다.',
    image: `${ASSET}assets/heritage/parthenon.svg`,
    imageAlt: '골드 라인으로 표현한 파르테논 신전 일러스트',
    x: 34,
    y: 32,
    braille: ['파르테논', '기둥 신전'],
    features: ['3D', 'TTS', 'Dot Pad', 'Braille'],
    matrix: createTactileMatrix('temple'),
  },
  {
    id: 'pyramid',
    country: 'Egypt',
    title: 'Great Pyramid',
    subtitle: 'Egypt · Great Pyramid',
    period: 'Ancient Egypt',
    description: '거대한 삼각 실루엣과 층위 구조를 단순한 촉각 그래픽으로 이해합니다.',
    image: `${ASSET}assets/heritage/pyramid.svg`,
    imageAlt: '골드 라인으로 표현한 이집트 피라미드 일러스트',
    x: 38,
    y: 50,
    braille: ['피라미드', '삼각 석조'],
    features: ['3D', 'TTS', 'Dot Pad', 'Braille'],
    matrix: createTactileMatrix('pyramid'),
  },
  {
    id: 'taj-mahal',
    country: 'India',
    title: 'Taj Mahal',
    subtitle: 'India · Taj Mahal',
    period: '17th Century',
    description: '돔과 좌우 대칭 구조를 중심으로 인도의 대표 유산을 만져봅니다.',
    image: `${ASSET}assets/heritage/taj-mahal.svg`,
    imageAlt: '골드 라인으로 표현한 타지마할 일러스트',
    x: 64,
    y: 47,
    braille: ['타지마할', '돔 대칭'],
    features: ['3D', 'TTS', 'Dot Pad', 'Braille'],
    matrix: createTactileMatrix('dome'),
  },
  {
    id: 'cheomseongdae',
    country: 'Korea',
    title: 'Cheomseongdae',
    subtitle: 'Korea · Cheomseongdae',
    period: '7th Century',
    description: '동양에서 가장 오래된 천문 관측대 중 하나를 Dot Pad로 탐험합니다.',
    image: `${ASSET}assets/heritage/cheomseongdae.jpg`,
    imageAlt: '첨성대 대표 이미지',
    x: 76,
    y: 36,
    braille: ['첨성대 신라', '천문 관측대'],
    features: ['3D', 'TTS', 'Dot Pad', 'Braille'],
    matrix: createTactileMatrix('tower'),
  },
  {
    id: 'horyuji',
    country: 'Japan',
    title: 'Horyuji',
    subtitle: 'Japan · Horyuji',
    period: '7th Century',
    description: '목조 탑의 반복되는 처마와 수직 구조를 촉각적으로 비교합니다.',
    image: `${ASSET}assets/heritage/horyuji.svg`,
    imageAlt: '골드 라인으로 표현한 호류지 오층탑 일러스트',
    x: 80,
    y: 67,
    braille: ['호류지', '목조 탑'],
    features: ['3D', 'TTS', 'Dot Pad', 'Braille'],
    matrix: createTactileMatrix('pagoda'),
  },
];
