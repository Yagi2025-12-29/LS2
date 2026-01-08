export function simulateCutting(state) {
  const zIndex = Math.round(state.z);
  if (zIndex < 0 || zIndex >= state.workpieceProfile.length) return;

  const toolRadius = getToolEffectiveRadius(state.toolId); // 工具形状に応じた当たり位置
  const targetRadius = state.x + toolRadius;

  // Z方向に少し幅を持たせて削る
  const width = 2; // ±2mm
  for (let i = zIndex - width; i <= zIndex + width; i++) {
    if (i < 0 || i >= state.workpieceProfile.length) continue;
    const current = state.workpieceProfile[i];
    state.workpieceProfile[i] = Math.min(current, targetRadius);
  }
}

function getToolEffectiveRadius(toolId) {
  switch (toolId) {
    case "outerRough":
    case "outerFinish":
      return 0; // 単純化：Xがそのまま半径
    case "groove":
      return 0;
    case "chamfer":
      return 0; // ここは後で角度を加味してもよい
    default:
      return 0;
  }
}