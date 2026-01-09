// simulate.js
import { machineState } from "./state.js";
import { renderWorkpiece } from "./render.js";
import { updateDRO } from "./ui.js";

// ================================
// 自動送り・ネジ切りシミュレーション
// ================================
export function startSimulation() {
    setInterval(() => {
        const rpm = parseInt(document.getElementById("rpmSelect").value);

        // ----------------------------
        // 自動送り（feed）
        // ----------------------------
        if (machineState.isFeedOn) {
            const p = parseFloat(document.getElementById("gearSelect").value);

            if (p > 0) {
                // Z方向へ自動送り
                machineState.realPos.z -= (rpm / 3600) * p * 5;
            }
        }

        // ----------------------------
        // ネジ切り（ハーフナット ON）
        // ----------------------------
        else if (machineState.isHalfNutOn && machineState.threadMoveDir !== 0) {
            machineState.realPos.z +=
                (rpm / 3600) * 2.5 * machineState.threadMoveDir * 5;
        }

        // ----------------------------
        // 表示更新 & 描画更新
        // ----------------------------
        updateDRO();
        renderWorkpiece();

    }, 20); // 20msごとに更新（50fps）
}
