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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 800, 400);

    const midY = 200;
    const chuckX = 150;

    // 背景（ベッド・機械内部のイメージ）
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, 800, 400);

    // チャック
    ctx.fillStyle = "#333";
    ctx.fillRect(0, midY - 120, chuckX, 240);
    ctx.fillStyle = "#444";
    ctx.fillRect(chuckX - 20, midY - 100, 20, 200);

    // ★ workpieceProfile を描画
    ctx.fillStyle = "#aaa"; // ワークの色
    for (let z = 0; z < machineState.workpieceProfile.length; z++) {
        const radius = machineState.workpieceProfile[z];
        const xPos = chuckX + z;
        ctx.fillRect(xPos, midY - radius, 1, radius * 2);
    }

    // 中心線
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#444";
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(800, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 工具位置
    const type = document.getElementById("toolSelect").value;
    const bX = chuckX + machineState.realPos.z;
    const bY = machineState.realPos.x;

    ctx.save();
    if (type === "outerRough" || type === "outerFinish") drawOuterTool(ctx, bX, bY);
    if (type === "innerRough" || type === "innerFinish") drawInnerTool(ctx, bX, bY);
    if (type === "thread") drawThreadTool(ctx, bX, bY);
    if (type === "chamfer") drawChamferTool(ctx, bX, bY);
    if (type === "centerDrill" || type === "drill25") drawDrillTool(ctx, bX, midY); // ドリル系は芯高固定
    if (type === "parting") drawPartingTool(ctx, bX, bY);
    ctx.restore();
}
