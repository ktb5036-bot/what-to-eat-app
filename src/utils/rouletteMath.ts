/**
 * Roulette Geometry & Target Rotation Math
 * 
 * Slices are arranged 0 to N-1 starting at angle 0 deg (or from top).
 * By standard convention, top pointer is at 270 degrees (or -90 degrees from standard 0 = 3 o'clock).
 */

export const POINTER_ANGLE_DEG = 270; // Top position (12 o'clock)

/**
 * Calculates the exact target rotation (in degrees) so that slice at `targetIndex`
 * lands under the pointer after at least `minSpins` full rotations.
 * 
 * @param targetIndex Index of the winning item (0-based)
 * @param totalSlices Total number of items on the wheel
 * @param currentRotation Current wheel rotation angle in degrees
 * @param minSpins Minimum number of full spins (default 5)
 * @param jitterFraction Random offset within slice (-0.35 to +0.35 of slice width) to avoid always hitting dead center
 */
export function calculateTargetRotation(
  targetIndex: number,
  totalSlices: number,
  currentRotation: number = 0,
  minSpins: number = 5,
  jitterFraction: number = 0
): number {
  if (totalSlices <= 0) return currentRotation;
  const sliceAngle = 360 / totalSlices;

  // Center angle of target slice in the unrotated wheel coordinate
  const sliceCenter = targetIndex * sliceAngle + sliceAngle / 2;
  const jitter = (sliceAngle * 0.7) * Math.max(-0.4, Math.min(0.4, jitterFraction));
  const targetAngleOnWheel = sliceCenter + jitter;

  // We want: (targetAngleOnWheel + finalRotation) % 360 === POINTER_ANGLE_DEG % 360
  // So: finalRotation % 360 === (POINTER_ANGLE_DEG - targetAngleOnWheel) % 360
  let desiredBase = (POINTER_ANGLE_DEG - targetAngleOnWheel) % 360;
  if (desiredBase < 0) desiredBase += 360;

  // Ensure forward rotation of at least minSpins * 360 beyond currentRotation
  const currentBase = currentRotation % 360;
  let delta = desiredBase - currentBase;
  if (delta <= 0) {
    delta += 360;
  }

  const finalRotation = currentRotation + delta + minSpins * 360;
  return finalRotation;
}

/**
 * Determines which slice index is currently under the pointer for any given rotation.
 */
export function getIndexAtPointer(
  rotationDeg: number,
  totalSlices: number,
  pointerAngleDeg: number = POINTER_ANGLE_DEG
): number {
  if (totalSlices <= 0) return 0;
  const sliceAngle = 360 / totalSlices;

  // What angle on the wheel is at pointerAngleDeg?
  // (wheelAngle + rotationDeg) % 360 = pointerAngleDeg
  // wheelAngle = (pointerAngleDeg - rotationDeg) % 360
  let wheelAngle = (pointerAngleDeg - (rotationDeg % 360)) % 360;
  if (wheelAngle < 0) wheelAngle += 360;

  const index = Math.floor(wheelAngle / sliceAngle);
  return Math.min(totalSlices - 1, Math.max(0, index));
}

/**
 * Refined, harmonious curation palette for roulette slices.
 * Carefully selected warm coral, terracotta, amber, sage, and indigo tones.
 */
export const ROULETTE_COLORS = [
  '#FF5A36', // Coral Orange (Signature)
  '#2A9D8F', // Sage Teal
  '#F4A261', // Warm Amber Gold
  '#E76F51', // Terracotta
  '#3D5A80', // Deep Muted Indigo
  '#E07A5F', // Rose Clay
  '#10B981', // Fresh Mint
  '#F28E2B', // Peach Apricot
];
