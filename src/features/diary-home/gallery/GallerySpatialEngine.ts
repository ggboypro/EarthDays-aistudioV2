// src/features/diary-home/gallery/GallerySpatialEngine.ts
// Mathematical spatial calculations for continuous Gallery depth, tilt, elevation, and side peek

export interface SpatialCardProps {
  distance: number; // Continuous distance from center (0 = center, -1 = prev, +1 = next)
  scale: number;
  opacity: number;
  rotation: number;
  offsetY: number;
  zIndex: number;
  isCenter: boolean;
}

export function computeSpatialProps(distance: number): SpatialCardProps {
  const absDist = Math.abs(distance);
  const isCenter = absDist < 0.08;

  // 1. Continuous Smooth Scale Curve (Center: 1.0, Next/Prev: ~0.89, Far: ~0.76)
  // Gentle progressive decline with no sharp derivative kinks
  const scale = Math.max(
    0.74,
    1 - 0.11 * Math.min(1, Math.pow(absDist, 1.15)) - (absDist > 1 ? (absDist - 1) * 0.045 : 0)
  );

  // 2. Continuous Gaussian-like Opacity Falloff (Center: 1.0, Next/Prev: ~0.70, Far: ~0.20)
  const opacity = Math.max(
    0.16,
    Math.min(1.0, Math.exp(-0.36 * Math.pow(absDist, 1.2)))
  );

  // 3. Smooth Harmonic S-Curve Rotation (Soft organic parchment tilt on wooden desk)
  // Uses hyperbolic tangent for smooth asymptotic saturation (max ±1.85 deg)
  const rotation = Math.tanh(distance * 0.52) * -1.85;

  // 4. Smooth Parabolic Elevation Arc (Side cards rest softly lower on desk plane)
  const offsetY = Math.min(14, Math.pow(absDist, 1.22) * 5.2);

  // 5. Smooth Z-Index Ordering
  const zIndex = Math.max(1, Math.round(100 - absDist * 16));

  return {
    distance,
    scale,
    opacity,
    rotation,
    offsetY,
    zIndex,
    isCenter,
  };
}
