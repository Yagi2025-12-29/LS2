import { machineState } from "./state.js";
import { drawOuterTool, drawInnerTool, drawThreadTool, drawChamferTool, drawDrillTool, drawPartingTool } from "./tools.js";

export function renderWorkpiece() {
    const canvas = document.getElementById("latheCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 800, 400);

    const midY = 200;
    const chuckX = 150;
    const scale = 5;

    // ワーク描画
    ctx.fillStyle = "#444";
    ctx.fillRect(0, midY - 100, chuckX, 200);

    ctx.fillStyle = "#999";
    ctx.fillRect(
        chuckX,
        midY - (machineState.work.d * scale / 2),
        machineState.work.out * scale,
        machineState.work.d * scale
    );

    ctx.strokeStyle = "#fff";
    ctx.strokeRect(
        chuckX,
        midY - (machineState.work.d * scale / 2),
        machineState.work.out * scale,
        machineState.work.d * scale
    );

    // 工具位置
    const type = document.getElementById("toolSelect").value;

    let bX = machineState.realPos.z + machineState.realPos.s;
    let bY = machineState.realPos.x;

    // 工具色
    if (type.includes("Rough")) ctx.fillStyle = "#ff0";
    else if (type.includes("Finish")) ctx.fillStyle = "#e5e5e5";
    else ctx.fillStyle = "#ffd700";

    // 内径工具の反転
    if (type.includes("inner")) {
        bY = midY + (midY - machineState.realPos.x);
    }

    // ドリルは中心に固定
    if (type.includes("Drill") || type === "drill25" || type === "centerDrill") {
        bY = midY;
    }

    ctx.save();

    if (type === "outerRough" || type === "outerFinish") {
        drawOuterTool(ctx, bX, bY);
    } else if (type === "innerRough" || type === "innerFinish") {
        drawInnerTool(ctx, bX, bY);
    } else if (type === "thread") {
        drawThreadTool(ctx, bX, bY);
    } else if (type === "chamfer") {
        drawChamferTool(ctx, bX, bY);
    } else if (type === "centerDrill") {
        drawDrillTool(ctx, bX, bY, 50);
    } else if (type === "drill25") {
        drawDrillTool(ctx, bX, bY, 80);
    } else if (type === "parting") {
        drawPartingTool(ctx, bX, bY);
    }

    ctx.restore();
}
