import { machineState } from "./state.js";

export function updateDRO() {
    const dispZ = (machineState.realPos.z - machineState.zeroRef.z) / 5;
    const dispX = (machineState.zeroRef.x - machineState.realPos.x) / 5;
    const dispS = (machineState.realPos.s - machineState.zeroRef.s) / 5;

    document.getElementById("droZ").innerText = dispZ.toFixed(1);
    document.getElementById("droX").innerText = dispX.toFixed(1);
    document.getElementById("droS").innerText = dispS.toFixed(1);
}
