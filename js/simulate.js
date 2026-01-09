import { machineState } from "./state.js";
import { renderWorkpiece } from "./render.js";
import { updateDRO } from "./ui.js";

export function startSimulation() {
    setInterval(() => {
        const rpm = parseInt(document.getElementById("rpmSelect").value);

        // 自動送り
        if (machineState.isFeedOn) {
            const p = parseFloat(document.getElementById("gearSelect").value);
            if (p > 0) {
                machineState.realPos.z -= (rpm / 3600) * p * 5;
            }

        // ネジ切り
        } else if (machineState.isHalfNutOn && machineState.threadMoveDir !== 0) {
            machineState.realPos.z += (rpm / 3600) * 2.5 * machineState.threadMoveDir * 5;
        }

        updateDRO();
        renderWorkpiece();

    }, 20);
}
