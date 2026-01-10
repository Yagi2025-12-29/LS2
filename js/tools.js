// tools.js
// 工具描画専用モジュール
// すべての関数は render.js から呼び出される

// 外径バイト（荒・仕上）
export function drawOuterTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffcc00"; // 黄（超硬）
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(bX, bY + 40);
    ctx.lineTo(bX + 25, bY + 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.stroke();
}

// 内径バイト（荒・仕上）
export function drawInnerTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(bX, bY - 40);
    ctx.lineTo(bX + 25, bY - 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.stroke();
}

// ネジ切りバイト
export function drawThreadTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffd700"; // 金
    const h = 40;
    const w = 30;
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(bX - w / 2, bY + h);
    ctx.lineTo(bX + w / 2, bY + h);
    ctx.closePath();
    ctx.fill();
}

// 面取りバイト
export function drawChamferTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffd700";
    const size = 35;
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(bX + size, bY + size);
    ctx.lineTo(bX + size, bY + size + 20);
    ctx.closePath();
    ctx.fill();
}

// センタドリル・ドリル
export function drawDrillTool(ctx, bX, bY, length = 100) {
    ctx.fillStyle = "#ffd700";
    const shaftLen = length;
    const shaftHalf = 10;

    ctx.beginPath();
    ctx.fillRect(bX, bY - shaftHalf, shaftLen, shaftHalf * 2);

    ctx.moveTo(bX, bY);
    ctx.lineTo(bX - 20, bY - 15);
    ctx.lineTo(bX - 20, bY + 15);
    ctx.closePath();
    ctx.fill();
}

// 突切りバイト
export function drawPartingTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffd700";
    const w = 5;
    const h = 45;
    ctx.fillRect(bX, bY, w, h);
}
