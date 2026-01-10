// main.js - LEO-80A Simulator 2025 Ver.8 (Final Optimized)
// 1mm = 5px スケール

// ================================
// 1. 状態管理
// ================================
const machineState = {
    // スタート位置 (右下外側)
    realPos: { x: 180, z: 450, s: 0 },
    zeroRef: { x: 180, z: 450, s: 0 },
    prevPos: { x: 180, z: 450, s: 0 },

    isFeedOn: false,
    isHalfNutOn: false,
    threadMoveDir: 0,

    accelValue: 0,
    holdTimer: null,
    holdInterval: null,

    // ワーク設定 (Φ60x58L, 掴み12, 突出46)
    work: { d: 60, out: 46, grab: 12 },

    step1: {
        faceCut: false,
        zZero: false,
        finishUsed: false,
        badRpm: false,
        chamferDone: false,
        threadDone: false
    },

    currentStep: 1,

    // 外径プロファイル (半径px)
    workpieceProfile: new Array(500).fill(150),
    // 内径プロファイル (削られた穴の半径px)
    innerProfile: new Array(500).fill(0)
};

// ================================
// 2. 工具描画
// ================================
function drawOuterTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(bX + 5, bY + 40);
    ctx.lineTo(bX + 30, bY + 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.stroke();
}

function drawInnerTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.moveTo(bX, bY); // 刃先
    ctx.lineTo(bX + 5, bY - 35);
    ctx.lineTo(bX + 80, bY - 30);
    ctx.lineTo(bX + 80, bY - 10);
    ctx.lineTo(bX + 10, bY - 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.stroke();
}

function drawThreadTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(bX + 8, bY + 25);
    ctx.lineTo(bX - 8, bY + 25);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.stroke();
}

function drawChamferTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(bX + 30, bY + 30);
    ctx.lineTo(bX + 30, bY + 60);
    ctx.lineTo(bX - 10, bY + 60);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.stroke();
}

function drawDrillTool(ctx, bX, bY, isCenter = false) {
    ctx.fillStyle = "#ffd700";
    const radius = isCenter ? 6 : 31;
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(bX + 15, bY - radius);
    ctx.lineTo(bX + 150, bY - radius);
    ctx.lineTo(bX + 150, bY + radius);
    ctx.lineTo(bX + 15, bY + radius);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#555";
    ctx.fillRect(bX + 150, bY - 15, 80, 30);
}

function drawPartingTool(ctx, bX, bY) {
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(bX - 2, bY, 4, 45);
}

// ================================
// 3. 描画処理
// ================================
function renderWorkpiece() {
    const canvas = document.getElementById("latheCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 800, 400);
    const midY = 200;
    const chuckX = 150;

    // 背景
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, 800, 400);

    // チャック
    ctx.fillStyle = "#333";
    ctx.fillRect(0, midY - 125, chuckX, 250);

    // ワークの描画
    const outLenPx = machineState.work.out * 5;
    ctx.fillStyle = "#aaa";
    for (let z = 0; z < outLenPx; z++) {
        if (z >= machineState.workpieceProfile.length) break;
        let outerR = machineState.workpieceProfile[z];
        let innerR = machineState.innerProfile[z];
        const xPos = chuckX + z;

        // 上半分
        ctx.fillRect(xPos, midY - outerR, 1, outerR - innerR);
        // 下半分
        ctx.fillRect(xPos, midY + innerR, 1, outerR - innerR);

        // 内径の色
        if (innerR > 0) {
            ctx.fillStyle = "#444";
            ctx.fillRect(xPos, midY - innerR, 1, innerR * 2);
            ctx.fillStyle = "#aaa";
        }
    }

    // 中心線
    ctx.setLineDash([5, 5]); ctx.strokeStyle = "#444";
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(800, midY); ctx.stroke();
    ctx.setLineDash([]);

    // 工具
    const type = document.getElementById("toolSelect").value;
    const combinedZ = machineState.realPos.z + machineState.realPos.s;
    const bX = chuckX + combinedZ;
    const bY = midY + machineState.realPos.x;

    ctx.save();
    if (type === "outerRough" || type === "outerFinish") drawOuterTool(ctx, bX, bY);
    if (type === "innerRough" || type === "innerFinish") drawInnerTool(ctx, bX, bY);
    if (type === "thread") drawThreadTool(ctx, bX, bY);
    if (type === "chamfer") drawChamferTool(ctx, bX, bY);
    if (type === "centerDrill") drawDrillTool(ctx, bX, midY, true);
    if (type === "drill25") drawDrillTool(ctx, bX, midY, false);
    if (type === "parting") drawPartingTool(ctx, bX, bY);
    ctx.restore();
}

// ================================
// 4. 切削ロジック (ネジ深さ・幅対応)
// ================================
function simulateCutting(state) {
    const combinedZ = state.realPos.z + state.realPos.s;
    const prevZ = state.prevPos.z + state.prevPos.s;
    const zStart = Math.min(combinedZ, prevZ);
    const zEnd = Math.max(combinedZ, prevZ);

    const midY = 200;
    const type = document.getElementById("toolSelect").value;
    const toolRadius = Math.abs(state.realPos.x);
    const limitZ = state.work.out * 5;

    for (let zIndex = Math.round(zStart); zIndex <= Math.round(zEnd); zIndex++) {
        if (zIndex < 0 || zIndex >= limitZ) continue;

        if (type.startsWith("inner")) {
            // 内径バイト
            if (toolRadius > state.innerProfile[zIndex] && toolRadius < state.workpieceProfile[zIndex]) {
                state.innerProfile[zIndex] = toolRadius;
            }
        } else if (type === "centerDrill" || type === "drill25") {
            // ドリル
            const dR = (type === "centerDrill") ? 6 : 31;
            if (dR > state.innerProfile[zIndex]) state.innerProfile[zIndex] = dR;
        } else if (type === "thread") {
            // ネジ切り: 現在の位置のプロファイルを直接削る
            if (toolRadius < state.workpieceProfile[zIndex]) {
                state.workpieceProfile[zIndex] = toolRadius;
            }
        } else if (type === "chamfer") {
            // 面取り: 45度
            const dx = zIndex - combinedZ;
            const chamferR = toolRadius + Math.max(0, dx);
            if (chamferR < state.workpieceProfile[zIndex]) {
                state.workpieceProfile[zIndex] = chamferR;
            }
        } else {
            // 外径
            if (toolRadius < state.workpieceProfile[zIndex]) {
                state.workpieceProfile[zIndex] = toolRadius;
                if (zIndex < 1) state.step1.faceCut = true;
            }
        }
    }
    state.prevPos.z = state.realPos.z;
    state.prevPos.s = state.realPos.s;
}

// ================================
// 5. ミッション判定 (簡易)
// ================================
function loadStep(id) {
    const steps = [
        { id: 1, title: "STEP1：端面基準出し", description: "外径荒バイトを使用し、端面を削ってZ 0セットを行う。" },
        { id: 2, title: "STEP2：外径荒加工", description: "Φ50まで荒加工する。" },
        { id: 3, title: "STEP3：ネジ切り加工", description: "ピッチ2.5mmでネジを切る。中ハンドルで深さ、小ハンドルで幅を調整。" }
    ];
    const s = steps.find(x => x.id === id) || steps[0];
    machineState.currentStep = id;
    document.getElementById("mission-text").innerHTML = `【STEP${id}】${s.title}<br>${s.description}`;
}

// ================================
// 6. UI
// ================================
function updateDRO() {
    const dispZ = (machineState.realPos.z - machineState.zeroRef.z) / 5;
    const dispX = ((machineState.realPos.x - machineState.zeroRef.x) * 2) / 5;
    const dispS = (machineState.realPos.s - machineState.zeroRef.s) / 5;
    document.getElementById("droZ").innerText = dispZ.toFixed(1);
    document.getElementById("droX").innerText = dispX.toFixed(1);
    document.getElementById("droS").innerText = dispS.toFixed(1);
}

function setRelativeZero(axis) {
    machineState.zeroRef[axis] = machineState.realPos[axis];
    if (axis === "z") machineState.step1.zZero = true;
    updateDRO();
}

function doMove(dir, axis, accel) {
    const type = document.getElementById("toolSelect").value;
    if (axis === "z" && machineState.isHalfNutOn) return;
    if (axis === "x" && type.includes("Drill")) return;

    const step = 0.5 * (1 + accel * 10);
    if (axis === "z") machineState.realPos.z += dir * step;
    if (axis === "s") machineState.realPos.s += dir * step;
    if (axis === "x") machineState.realPos.x -= dir * step;

    updateDRO();
    renderWorkpiece();
}

function bindHandle(id, dir, axis) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const start = e => {
        e.preventDefault();
        machineState.accelValue = 0;
        doMove(dir, axis, 0);
        machineState.holdTimer = setTimeout(() => {
            machineState.holdInterval = setInterval(() => {
                if (machineState.accelValue < 1.0) machineState.accelValue += 0.1;
                doMove(dir, axis, machineState.accelValue);
            }, 30);
        }, 200);
    };
    const end = () => { clearTimeout(machineState.holdTimer); clearInterval(machineState.holdInterval); };
    btn.addEventListener("mousedown", start); btn.addEventListener("mouseup", end);
    btn.addEventListener("touchstart", start); btn.addEventListener("touchend", end);
}

function initWork() {
    const val = document.getElementById("workSelect").value;
    if (val === "60") machineState.work = { d: 60, out: 46, grab: 12 };
    else if (val === "50") machineState.work = { d: 50, out: 65, grab: 25 };
    else if (val === "50t") machineState.work = { d: 50, out: 45, grab: 45 };

    const rPx = (machineState.work.d / 2) * 5;
    machineState.workpieceProfile.fill(rPx);
    machineState.innerProfile.fill(0);

    machineState.realPos.z = 450;
    machineState.realPos.s = 0;
    machineState.realPos.x = rPx + 20;
    setRelativeZero("x"); setRelativeZero("z"); setRelativeZero("s");
    renderWorkpiece();
}

function checkToolMode() {
    const type = document.getElementById("toolSelect").value;
    machineState.isHalfNutOn = (type === "thread");

    // UI 反映
    const zLeft = document.getElementById("z-left");
    const zRight = document.getElementById("z-right");
    if (zLeft) zLeft.classList.toggle("locked", machineState.isHalfNutOn);
    if (zRight) zRight.classList.toggle("locked", machineState.isHalfNutOn);

    if (type.includes("Drill")) {
        machineState.realPos.x = 0;
        updateDRO();
    }

    const area = document.getElementById("mode-switch-area");
    if (machineState.isHalfNutOn) {
        area.innerHTML = `<div class="thread-ctrl-box">
            <button class="btn-thread" onmousedown="machineState.threadMoveDir=-1" onmouseup="machineState.threadMoveDir=0">正転 (送り)</button>
            <button class="btn-thread" onmousedown="machineState.threadMoveDir=1" onmouseup="machineState.threadMoveDir=0">逆転 (戻り)</button>
        </div>`;
    } else {
        area.innerHTML = `<button id="feed-btn" onclick="toggleFeed()" style="height:100%;font-size:10px;font-weight:bold;">自動送り<br>ON/OFF</button>`;
    }
    renderWorkpiece();
}

function toggleFeed() {
    if (machineState.isHalfNutOn) return;
    machineState.isFeedOn = !machineState.isFeedOn;
    const fb = document.getElementById("feed-btn");
    fb && fb.classList.toggle("btn-active", machineState.isFeedOn);
}

function startSimulation() {
    setInterval(() => {
        const rpm = parseInt(document.getElementById("rpmSelect").value);
        if (rpm > 0) {
            if (machineState.isFeedOn) {
                const p = parseFloat(document.getElementById("gearSelect").value);
                if (p > 0) machineState.realPos.z -= (rpm / 3600) * p * 5;
            } else if (machineState.isHalfNutOn && machineState.threadMoveDir !== 0) {
                // ピッチ 2.5mm 固定
                machineState.realPos.z += (rpm / 3600) * 2.5 * machineState.threadMoveDir * 5;
            }
            simulateCutting(machineState);
        }
        updateDRO();
        renderWorkpiece();
    }, 20);
}

window.onload = () => {
    initWork(); checkToolMode();
    bindHandle("z-left", -1, "z"); bindHandle("z-right", 1, "z");
    bindHandle("x-left", -1, "x"); bindHandle("x-right", 1, "x");
    bindHandle("ts-left", 1, "s"); bindHandle("ts-right", -1, "s");
    loadStep(1); startSimulation();
};

window.setRelativeZero = setRelativeZero;
window.initWork = initWork;
window.checkToolMode = checkToolMode;
window.toggleFeed = toggleFeed;
