import { World,Bodies } from 'matter-js';

export class GameWallObject {
  constructor({ id, x, y }) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  addToEngine(world) {
    World.add(world, this.body);
  }
}




class Wall extends GameWallObject {
    constructor({ x, y, width, height }) {
      super({ x, y })
      this.width = width;
      this.height = height;
      this.type = 'wall';
      this.createPhysics({ width, height });
    }
  
    createPhysics({width, height}) {
      let options = {
        restitution: 0.1,
        friction: 0.9,
      }
  
      this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, options);
      this.body.isStatic = true;
      this.body.position.x = this.x;
      this.body.position.y = this.y;
      this.body.label = this.type;      
 
    }
  }


  export default class VerticalWall extends Wall {
    constructor({x, y}) {
      super({x, y, width: 4, height: 570});
    }
  }