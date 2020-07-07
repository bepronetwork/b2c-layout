export const Line1 = (
  ElementId,
  moveToX,
  moveToY,
  line1ToX,
  line1ToY,
  line2ToX,
  line2ToY
) => {
  const c = document.getElementById(ElementId);
  const ctx = c.getContext("2d");

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "gray";
  ctx.moveTo(moveToX, moveToY);
  ctx.lineTo(line1ToX, line1ToY); // L - A
  ctx.lineTo(line2ToX, line2ToY);
  // ctx.moveTo(80, 60);
  // ctx.lineTo(90, 65); // L - A
  // ctx.lineTo(450, 65);
  ctx.stroke(); // Draw it
};

export const Line2 = ElementId => {
  const c = document.getElementById(ElementId);
  const ctx = c.getContext("2d");

  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "gray";
  ctx.moveTo(80, 120);
  ctx.lineTo(90, 125); // L - A
  ctx.lineTo(450, 125);
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
