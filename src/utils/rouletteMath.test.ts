import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTargetRotation, getIndexAtPointer, POINTER_ANGLE_DEG } from './rouletteMath.ts';

test('calculateTargetRotation lands precisely on targetIndex slice', () => {
  const totalSlices = 5;
  for (let targetIndex = 0; targetIndex < totalSlices; targetIndex++) {
    // Test with center landing (jitterFraction = 0)
    const finalRotation = calculateTargetRotation(targetIndex, totalSlices, 0, 5, 0);
    const resolvedIndex = getIndexAtPointer(finalRotation, totalSlices, POINTER_ANGLE_DEG);
    assert.equal(
      resolvedIndex,
      targetIndex,
      `Expected pointer to resolve to slice ${targetIndex}, got ${resolvedIndex} at rotation ${finalRotation}`
    );
  }
});

test('calculateTargetRotation works with continuous rotations and existing angles', () => {
  const totalSlices = 4;
  let currentRotation = 1845.5; // from previous spin
  
  for (let spin = 0; spin < 10; spin++) {
    const target = spin % totalSlices;
    const nextRotation = calculateTargetRotation(target, totalSlices, currentRotation, 4, 0.1);
    
    assert.ok(nextRotation > currentRotation + 4 * 360, 'Must rotate forward at least 4 full turns');
    const resolvedIndex = getIndexAtPointer(nextRotation, totalSlices, POINTER_ANGLE_DEG);
    assert.equal(resolvedIndex, target, `Spin ${spin} targeting ${target} resolved to ${resolvedIndex}`);
    currentRotation = nextRotation;
  }
});
