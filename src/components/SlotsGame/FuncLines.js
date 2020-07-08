export const Line1 = async (
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
  ctx.lineTo(line1ToX, line1ToY);
  ctx.lineTo(line2ToX, line2ToY);
  ctx.stroke();

  return new Promise(resolve => setTimeout(() => resolve(), 3000));
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
  ctx.stroke();
};
