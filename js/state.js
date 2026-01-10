export const machineState = {
  realPos: { x: 40, z: 480, s: 0 },
  zeroRef: { x: 40, z: 480, s: 0 },

  isFeedOn: false,
  isHalfNutOn: false,
  threadMoveDir: 0,

  accelValue: 0,
  holdTimer: null,
  holdInterval: null,

  work: { d: 60, out: 500, grab: 12 },

  step1: {
    faceCut: false,
    zZero: false,
    finishUsed: false,
    badRpm: false,
    chamferDone: false,
    threadDone: false
  },

  // Φ60mm (半径30mm) = 150px
  workpieceProfile: new Array(500).fill(150)
};
