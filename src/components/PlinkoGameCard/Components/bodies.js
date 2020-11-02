import { getAppCustomization } from "../../../lib/helpers";

export const PLINKO = {
  FRICTION: 0,
  RESTITUTION: 1.5,
  RADIUS: 5,
  FILL: getAppCustomization().theme === "light" ? "#969696" : "#fff",
};

PLINKO.DIAMETER = PLINKO.RADIUS * 2;

export const PARTICLE = {
  DENSITY: 1 / 10,
  FRICTION: 0,
  RESTITUTION: 1.2,
  RADIUS: 7,
  FILL: "#ff4827",
};

PARTICLE.DIAMETER = PARTICLE.RADIUS * 2;
