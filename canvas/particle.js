import Vector from "../util/vector";

class Particle {

  constructor(x, y, mass) {
    this.pos = new Vector(x, y);
    this.prevPos = new Vector(x, y);

    this.mass = mass;

    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    
    this.lifespan = -1;
    this.deltaTime = 0;
    
    this.color = {
      colorMode: 'rgba',
      r: 255,
      g: 255,
      b: 255,
      a: 255
    }
  }

  update() {
    this.updatePrevPos();
    
    this.velocity.add(this.acceleration);
    this.pos.add(this.velocity);
    this.acceleration.set(0, 0);
    
    if(this.lifespan != -1) {
      this.deltaTime++;
    }
  }
  
  updatePrevPos() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    this.prevPos.z = this.pos.z;
  }

  show(ctx) {

    if(this.lifespan != -1) {
      let a = this.color.a - this.color.a * (this.deltaTime / this.lifespan);

      ctx.strokeStyle = `${this.color.colorMode}(${this.color.r}, ${this.color.g}, ${this.color.b}, ${a})`;
    } else {
      ctx.strokeStyle = `${this.color.colorMode}(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
    }

    ctx.beginPath();
    ctx.lineWidth = 8 + 8 * this.mass;
    ctx.moveTo(this.prevPos.x, this.prevPos.y);
    ctx.lineTo(this.pos.x, this.pos.y);
    ctx.stroke();
  }

  colorVal(r, g, b, a) {
    this.color.r = r;
    this.color.g = g;
    this.color.b = b;
    this.color.a = a;
  }

  colorMode(colorMode) {
    this.color.colorMode = colorMode;
  }
  
  expired() {
    return this.lifespan == -1 || this.lifespan - this.deltaTime <= 0;
  }

  applyForce(force) {
    let f = new Vector().mult(force, this.mass);
    this.acceleration.add(f);
  }
}

export default Particle;