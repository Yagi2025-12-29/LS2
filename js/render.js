// render.js
import { machineState } from "./state.js";
import {
    drawOuterTool,
    drawInnerTool,
    drawThreadTool,
    drawChamferTool,
    drawDrillTool,
    drawPartingTool
} from "./tools.js";

// ================================
// ワーク & 工具描画
// ================================
export function renderWorkpiece() {
    const canvas = document.getElementById("latheCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 800, 400);

    const midY = 200;
    const chuckX = 150;
    const scale = 5;

    // ----------------------------
    // チャック
    // ----------------------------
    ctx.fillStyle = "#444";
    ctx.fillRect(0, midY - 100, chuckX, 200);

   // ----------------------------
// ワーク（削れた形状を描画）
// ----------------------------
ctx.fillStyle = "#999";

for (let z = 0; z < machineState.workpieceProfile.length; z++) {
    const radius = machineState.workpieceProfile[z];
    if (radius === undefined) continue;

    const xPos = chuckX + z; // Z方向の位置
    const yTop = midY - radius;
    const yBottom = midY + radius;

    ctx.fillRect(xPos, yTop, 1, radius * 2);
}

    // ----------------------------
    // 工具位置計算
    // ----------------------------
    const type = document.getElementById("toolSelect").value;

    let bX = machineState.realPos.z + machineState.realPos.s;
    let bY = machineState.realPos.x;

    // 工具色
    if (type.includes("Rough")) ctx.fillStyle = "#ff0";
    else if (type.includes("Finish")) ctx.fillStyle = "#e5e5e5";
    else ctx.fillStyle = "#ffd700";

    // 内径工具は反転
    if (type.includes("inner")) {
        bY = midY + (midY - machineState.realPos.x);
    }

    // ドリルは中心固定
    if (
        type.includes("Drill") ||
        type === "drill25" ||
        type === "centerDrill"
    ) {
        bY = midY;
    }

    // ----------------------------
    // 工具描画
    // ----------------------------
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
