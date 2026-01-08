export const machineState = {
  // 現在位置（機械座標 or 教材用相対座標）
  z: 0,
  x: 0,

  // 相対ゼロ
  zZero: 0,
  xZero: 0,

  // 主軸・送り
  rpm: 0,
  feed: 0.0,
  feedOn: false,

  // 工具・工程
  toolId: "outerRough", // outerRough, outerFinish, groove, chamfer, centerDrill, drill, cutOff...
  currentStepId: 1,

  // 素材形状（Z方向の半径プロファイル）
  // 例：Zを0〜90mmを1mm刻み → 長さ91の配列
  workpieceProfile: new Array(91).fill(30.0), // φ60 → 半径30

  // 任意のメタ情報
  workpieceLength: 90,
  workpieceInitialRadius: 30.0
};