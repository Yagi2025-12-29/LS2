const step1 = {
  faceCut: false,
  zZero: false,
  finishUsed: false,
  badRpm: false
};

let realPos = { x: 200, z: 600, s: 0 };
let zeroRef = { x: 200, z: 600, s: 0 };

let isFeedOn = false;
let isHalfNutOn = false;
let threadMoveDir = 0;

let accelValue = 0;
let holdTimer = null;
let holdInterval = null;

let work = { d: 60, out: 46, grab: 12 };
