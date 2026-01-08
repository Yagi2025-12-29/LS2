import { machineState } from "./state.js";
import { simulateCutting } from "./simulate.js";
import { renderWorkpiece } from "./render.js";

export function moveZ(delta) {
  machineState.z += delta;
  simulateCutting(machineState);
  renderWorkpiece(machineState);
}

export function moveX(delta) {
  machineState.x += delta;
  simulateCutting(machineState);
  renderWorkpiece(machineState);
}

export function setRpm(rpm) {
  machineState.rpm = rpm;
}

export function setTool(toolId) {
  machineState.toolId = toolId;
}
