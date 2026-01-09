// ui.js
import { machineState } from "./state.js";
import { renderWorkpiece } from "./render.js";
import { simulateCutting } from "./simulate.js";
import { evaluateStep } from "./evaluate.js";

// ================================
// 相対ゼロセット
// ================================
export function setRelativeZero(axis) {
    machineState.zeroRef[axis] = machineState.realPos[axis];
    updateDRO();

    // STEP1：Zゼロ設定を記録
    if (axis === "z") {
        machineState.step1.zZero = true;
    }
}

// ================================
// ワーク変更
// ================================
export function initWork() {
    const val = document.getElementById("workSelect").value;

    if (val === "60") machineState.work = { d: 60, out: 46, grab: 12 };
    else if (val === "50") machineState.work = { d: 50, out: 65, grab: 25 };
    else if (val === "50t") machineState.work = { d: 50, out: 45, grab: 45 };

    // DROリセット
    setRelativeZero("x");
    setRelativeZero("z");
    setRelativeZero("s");

    renderWorkpiece();
}

// ================================
// 工具モード切替
// ================================
export function checkToolMode() {
    const type = document.getElementById("toolSelect").value;
    const area = document.getElementById("mode-switch-area");

    machineState.isHalfNutOn = (type === "thread");

    if (machineState.isHalfNutOn) {
        area.innerHTML = `
            <div class="thread-ctrl-box">
                <button class="btn-thread"
                    onmousedown="machineState.threadMoveDir=-1"
                    onmouseup="machineState.threadMoveDir=0"
                    ontouchstart="machineState.threadMoveDir=-1"
                    ontouchend="machineState.threadMoveDir=0">
                    正転 (進む)
                </button>
                <button class="btn-thread"
                    onmousedown="machineState.threadMoveDir=1"
                    onmouseup="machineState.threadMoveDir=0"
                    ontouchstart="machineState.threadMoveDir=1"
                    ontouchend="machineState.threadMoveDir=0">
                    逆転 (戻る)
                </button>
            </div>
        `;
        machineState.isFeedOn = false;
    } else {
        area.innerHTML = `
            <button id="feed-btn" onclick="toggleFeed()" 
                style="height:100%;font-size:10px;font-weight:bold;">
                自動送り<br>ON/OFF
            </button>`;
    }

    // Zラベル変更
    document.getElementById("z-label").innerText =
        type.includes("Drill") || type === "drill25"
            ? "芯押し(大)"
            : "Z(大)";

    // Zボタンロック
    const zBtns = [
        document.getElementById("z-left"),
        document.getElementById("z-right")
    ];
    zBtns.forEach(btn => btn.classList.toggle("locked", machineState.isHalfNutOn));

    renderWorkpiece();
}

// ================================
// 自動送り ON/OFF
// ================================
export function toggleFeed() {
    if (machineState.isHalfNutOn) return;
    if (document.getElementById("gearSelect").value === "0") return;

    machineState.isFeedOn = !machineState.isFeedOn;

    const feedBtn = document.getElementById("feed-btn");
    if (feedBtn) feedBtn.classList.toggle("btn-active", machineState.isFeedOn);
}

// ================================
// DRO更新
// ================================
export function updateDRO() {
    const dispZ = (machineState.realPos.z - machineState.zeroRef.z) / 5;
    const dispX = (machineState.zeroRef.x - machineState.realPos.x) / 5;
    const dispS = (machineState.realPos.s - machineState.zeroRef.s) / 5;

    document.getElementById("droZ").innerText = dispZ.toFixed(1);
    document.getElementById("droX").innerText = dispX.toFixed(1);
    document.getElementById("droS").innerText = dispS.toFixed(1);
}

// ================================
// 手動移動（Z / X / S）
// ================================
export function doMove(dir, axis, accel) {
    if (axis === "z" && machineState.isHalfNutOn) return;

    const baseUnit = 0.5;
    const step = baseUnit * (1 + accel * 15);

    if (axis === "z") machineState.realPos.z += dir * step;
    if (axis === "x") machineState.realPos.x -= dir * step;
    if (axis === "s") machineState.realPos.s += dir * step;

    updateDRO();
    renderWorkpiece();
    evaluateStep();       
}

// ================================
// ハンドル（長押し加速）
// ================================
function bindHandle(id, dir, axis) {
    const btn = document.getElementById(id);

    const start = e => {
        e.preventDefault();
        machineState.accelValue = 0;
        doMove(dir, axis, machineState.accelValue);

        machineState.holdTimer = setTimeout(() => {
            machineState.holdInterval = setInterval(() => {
                if (machineState.accelValue < 1.0)
                    machineState.accelValue += 0.08;

                doMove(dir, axis, machineState.accelValue);
            }, 30);
        }, 250);
    };

    const end = () => {
        clearTimeout(machineState.holdTimer);
        clearInterval(machineState.holdInterval);
        machineState.accelValue = 0;
    };

    btn.addEventListener("touchstart", start);
    btn.addEventListener("touchend", end);
    btn.addEventListener("mousedown", start);
    btn.addEventListener("mouseup", end);
}

// ================================
// ハンドル登録
// ================================
export function bindAllHandles() {
    bindHandle("z-left", -1, "z");
    bindHandle("z-right", 1, "z");

    bindHandle("x-left", -1, "x");
    bindHandle("x-right", 1, "x");

    bindHandle("ts-left", 1, "s");
    bindHandle("ts-right", -1, "s");
}
