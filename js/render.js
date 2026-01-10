import { machineState } from "./state.js";
import {
    drawOuterTool,
    drawInnerTool,
    drawThreadTool,
    drawChamferTool,
    drawDrillTool,
    drawPartingTool
} from "./tools.js";

export function renderWorkpiece() {
    const canvas = document.getElementById("latheCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 800, 400);

    const midY = 200;
    const chuckX = 150;

    // チャック
    ctx.fillStyle = "#444";
    ctx.fillRect(0, midY - 100, chuckX, 200);

    // ★ workpieceProfile を描画
    ctx.fillStyle = "#999";
    for (let z = 0; z < machineState.workpieceProfile.length; z++) {
        const radius = machineState.workpieceProfile[z];
        const xPos = chuckX + z;
        ctx.fillRect(xPos, midY - radius, 1, radius * 2);
    }

    // 工具位置
    const type = document.getElementById("toolSelect").value;
    const bX = chuckX + machineState.realPos.z; // ★ これが正しい
    const bY = machineState.realPos.x;

    ctx.save();
    if (type === "outerRough" || type === "outerFinish") drawOuterTool(ctx, bX, bY);
    if (type === "thread") drawThreadTool(ctx, bX, bY);
    if (type === "chamfer") drawChamferTool(ctx, bX, bY);
    ctx.restore();
}
