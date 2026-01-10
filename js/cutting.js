import { machineState } from "./state.js";

export function simulateCutting(state) {
    const zIndex = Math.round(state.realPos.z);
    if (zIndex < 0 || zIndex >= state.workpieceProfile.length) return;

    const midY = 200;
    const type = document.getElementById("toolSelect") ? document.getElementById("toolSelect").value : "";

    // 工具の刃先半径（中心線からの距離）
    // 外径バイトなどは Y=200 より上にあると想定
    const toolRadius = Math.max(0, midY - state.realPos.x);

    const width = 2; // 刃先の幅
    for (let i = zIndex - width; i <= zIndex + width; i++) {
        if (i < 0 || i >= state.workpieceProfile.length) continue;

        const current = state.workpieceProfile[i];

        if (type.startsWith("inner")) {
            // 内径バイト：削ると半径が増えるイメージ（もし内径プロファイルがあれば）
            // 現状は外径プロファイルのみなので、内径は描画上の工夫が必要
        } else {
            // 外径バイト系：削ると中心に向かって半径が減る
            if (toolRadius < current) {
                state.workpieceProfile[i] = toolRadius;

                // 初めて削った時にフラグを立てる（STEP判定用）
                if (zIndex < 5) state.step1.faceCut = true;
            }
        }
    }
}
