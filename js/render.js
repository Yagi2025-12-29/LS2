export function renderWorkpiece(state) {
  const canvas = document.getElementById("workpiece");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);

  state.workpieceProfile.forEach((r, i) => {
    const x = i * 3;
    const y = canvas.height - r * 2;
    ctx.lineTo(x, y);
  });

  ctx.strokeStyle = "black";
  ctx.stroke();
}
