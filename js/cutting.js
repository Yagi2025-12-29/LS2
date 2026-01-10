import { machineState } from "./state.js";

export function simulateCutting(state) {
    const zIndex = Math.round(state.realPos.z);
    if (zIndex < 0 || zIndex >= state.workpieceProfile.length) return;

    const targetRadius = state.realPos.x; // ★ これが正しい

    const width = 2;
    for (let i = zIndex - width; i <= zIndex + width; i++) {
        if (i < 0 || i >= state.workpieceProfile.length) continue;

        const current = state.workpieceProfile[i];
        state.workpieceProfile[i] = Math.min(current, targetRadius);
    }
}
