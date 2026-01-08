export function evaluateStep(step, state) {
  const okZ = checkAxis(step.target.z, step.tolerance.z, state.z);
  const okX = checkAxis(step.target.x, step.tolerance.x, state.x);
  const okTool = !step.requiredTool || state.toolId === step.requiredTool;
  const okRpm = !step.requiredRpm || state.rpm === step.requiredRpm;
  const okFeed =
    step.requiredFeed === undefined ||
    (state.feedOn === step.requiredFeedOn && state.feed === step.requiredFeed);

  const correct = okZ && okX && okTool && okRpm && okFeed;

  if (correct) {
    return {
      correct: true,
      nextStepId: step.onCorrect,
      message: "正解です。次の工程に進みましょう。"
    };
  } else {
    return {
      correct: false,
      nextStepId: step.onWrong.retryStepId,
      message: step.onWrong.hintText
    };
  }
}

function checkAxis(target, tol, value) {
  if (target === null || tol === null || target === undefined || tol === undefined) return true;
  return Math.abs(value - target) <= tol;
}