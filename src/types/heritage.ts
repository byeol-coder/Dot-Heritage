export type DotCell = 0 | 1 | 2 | 3;

export interface DotMatrix {
  width: 60;
  height: 40;
  cells: DotCell[][];
}

export interface DotPadAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMatrix(matrix: DotMatrix): Promise<void>;
  clear(): Promise<void>;
}

export type LocalizedText = { ko: string; en: string };

export type TactileLayer = 'overview' | 'part' | 'focus' | 'quiz';
export type InteractionType = 'listen' | 'touch' | 'find' | 'quiz';
export type VisualType = '3d' | 'image' | 'diagram';
export type CameraView = 'front' | 'side' | 'top' | 'detail' | 'section';
export type AppMode = 'standard' | 'museum' | 'school';

export type TactileLayerType = 'silhouette' | 'structure' | 'detail' | 'focus';

export interface HeritageSlide {
  id: string;
  heritageId: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  visualType: VisualType;
  cameraView: CameraView;
  ttsText: LocalizedText;
  brailleText: string[];
  tactileGraphicId: string;
  tactileLayer: TactileLayer;
  highlightPart?: string;
  interactionType: InteractionType;
  focusInstruction?: LocalizedText;
  quizOptions?: LocalizedText[];
  quizAnswer?: string;
}

export interface HeritageMetadata {
  dataSource: string;
  curatorVerified: boolean;
  accessibilityTested: boolean;
  testDate?: string;
  recommendedModes: ('museum' | 'school' | 'workshop')[];
  accessibilityTags: string[];
  institutionCredit?: string;
}

export interface Heritage {
  id: string;
  title: LocalizedText;
  period: LocalizedText;
  location: LocalizedText;
  type: LocalizedText;
  description: LocalizedText;
  tactileDifficulty: 'Easy' | 'Medium' | 'Hard';
  recommendedFor: string[];
  thumbnailUrl?: string;
  metadata?: HeritageMetadata;
  slides: HeritageSlide[];
}
