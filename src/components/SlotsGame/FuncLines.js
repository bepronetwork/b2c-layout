export const Line1 = ElementId => {
  const c = document.getElementById(ElementId);
  const ctx = c.getContext("2d");

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "gray";
  ctx.moveTo(60, 35);
  ctx.lineTo(80, 40); // L - A
  ctx.lineTo(450, 40);
  ctx.stroke(); // Draw it
};
export const Line2 = ElementId => {
  const c = document.getElementById(ElementId);
  const ctx = c.getContext("2d");

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "gray";
  ctx.moveTo(60, 110);
  ctx.lineTo(80, 115); // L - A
  ctx.lineTo(450, 115);
  ctx.stroke(); // Draw it
};

export const Line3 = (
  ElementId,
  firstValueMove,
  secondValueMove,
  firstValueLine,
  secondValueLine
) => {
  const c = document.getElementById(ElementId);
  const ctx = c.getContext("2d");

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "white";
  ctx.moveTo(firstValueMove, secondValueMove);
  ctx.lineTo(firstValueLine, secondValueLine);
  ctx.stroke(); // Draw it
};
