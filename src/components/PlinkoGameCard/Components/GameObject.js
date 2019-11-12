import shortid from 'shortid';
import { World } from 'matter-js';

export default class GameObject {
  constructor({ id, x, y, r }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.renderId = shortid.generate();
  }
  addToEngine(world) {
    World.add(world, this.body);
  }
}
