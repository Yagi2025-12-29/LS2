export function simulateCutting(state) {
  // Z位置を machineState.realPos.z から取得
  const zIndex = Math.round(state.realPos.z);

  if (zIndex < 0 || zIndex >= state.workpieceProfile.length) return;

  // 工具の当たり半径
  const toolRadius = getToolEffectiveRadius(state.toolId);

  // X位置（半径方向）も realPos.x から取得
  const targetRadius = state.realPos.x + toolRadius;

  // 削る幅（Z方向 ±2mm）
  const width = 2;

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
      return 0;
    case "groove":
      return 0;
    case "chamfer":
      return 0;
    default:
      return 0;
  }
}
