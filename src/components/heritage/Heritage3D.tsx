import { Cheomseongdae3D } from './Cheomseongdae3D';
import { MoonJar3D } from './MoonJar3D';
import { RoofTile3D } from './RoofTile3D';
import { TraditionalShip3D } from './TraditionalShip3D';

interface Props {
  heritageId: string;
  highlightPart?: string;
  cameraView?: string;
}

export function Heritage3D({ heritageId, highlightPart, cameraView }: Props) {
  switch (heritageId) {
    case 'moon-jar':
      return <MoonJar3D highlightPart={highlightPart} cameraView={cameraView} />;
    case 'roof-tile':
      return <RoofTile3D highlightPart={highlightPart} cameraView={cameraView} />;
    case 'traditional-ship':
      return <TraditionalShip3D highlightPart={highlightPart} cameraView={cameraView} />;
    default:
      return <Cheomseongdae3D highlightPart={highlightPart} cameraView={cameraView} />;
  }
}
