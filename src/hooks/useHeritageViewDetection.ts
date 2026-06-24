import type { HeritageViewType, ViewSample } from '../types/tactileSync';

/**
 * Pure view classifier from a camera sample.
 * - explicit hotspot     → 'focus'
 * - looking down steeply  → 'top'
 * - zoomed in past 1.6×   → 'detail'
 * - otherwise by azimuth  → 'front' / 'side'
 *
 * The jar/tower models are near-axisymmetric, so the rear quadrant is treated
 * as 'front' (its tactile profile is effectively identical).
 */
export function detectViewType(s: ViewSample, hotspot?: string | null): HeritageViewType {
  if (hotspot) return 'focus';
  if (s.polarDeg < 32) return 'top';

  const zoom = s.baseDistance / Math.max(s.distance, 0.0001);
  if (zoom > 1.6) return 'detail';

  const a = ((s.azimuthDeg % 360) + 360) % 360;
  if (a >= 315 || a < 45) return 'front';
  if (a >= 45 && a < 135) return 'side';
  if (a >= 135 && a < 225) return 'front'; // back ≈ front (axisymmetric)
  return 'side';
}
