// cutting.js
import { machineState } from "./state.js";

// ================================
// 切削処理（ワークを削る）
// ================================
export function simulateCutting(state) {
    const zIndex = Math.round(state.realPos.z);
    if (zIndex < 0 || zIndex >= state.workpieceProfile.length) return;

    const toolRadius = getToolEffectiveRadius(state.toolId);
    const targetRadius = state.realPos.x + toolRadius;

    const width = 2;
    for (let i = zIndex - width; i <= zIndex + width; i++) {
        if (i < 0 || i >= state.workpieceProfile.length) continue;
        const current = state.workpieceProfile[i];
        state.workpieceProfile[i] = Math.min(current, targetRadius);
    }

    // STEP判定
    checkCuttingAchievements(state, zIndex, targetRadius);
}

// ================================
// 工具の当たり半径
// ================================
function getToolEffectiveRadius(toolId) {
    switch (toolId) {
        case "outerRough":
        case "outerFinish":
        case "groove":
        case "chamfer":
        default:
            return 0;
    }
}

// ================================
// STEP判定（faceCut / chamferDone / threadDone）
// ================================
function checkCuttingAchievements(state, zIndex, targetRadius) {

    // 端面切削
    if (!state.step1.faceCut) {
        if (state.toolId === "outerRough" || state.toolId === "outerFinish") {
            if (zIndex < 5 && targetRadius < state.work.d * 5) {
                state.step1.faceCut = true;
            }
        }
    }

    // 面取り
    if (!state.step1.chamferDone) {
        if (state.toolId === "chamfer") {
            if (targetRadius < state.work.d * 5 - 5 && zIndex < 10) {
                state.step1.chamferDone = true;
            }
        }
    }

    // ネジ切り
    if (!state.step1.threadDone) {
        if (state.toolId === "thread") {
            if (zIndex < -20) {
                state.step1.threadDone = true;
            }
        }
    }
}
