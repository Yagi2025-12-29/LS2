export const machineState = {
  realPos: { x: 200, z: 600, s: 0 },
  zeroRef: { x: 200, z: 600, s: 0 },

  isFeedOn: false,
  isHalfNutOn: false,
  threadMoveDir: 0,

  accelValue: 0,
  holdTimer: null,
  holdInterval: null,

  work: { d: 60, out: 46, grab: 12 },

  step1: {
    faceCut: false,
    zZero: false,
    finishUsed: false,
    badRpm: false,
    chamferDone: false,
    threadDone: false
  },

  // ★ ワーク形状データ（半径150px = Φ60mm）
  workpieceProfile: new Array(500).fill(150)
};
