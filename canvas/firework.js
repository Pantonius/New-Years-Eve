import Particle from "./particle";
import Perlin from "../util/perlin";

class Firework extends Particle {

  constructor(x, y, mass, gravity) {
    super(x, y, mass);
    
    this.delay = Math.random() * 2 - 1;
    this.exploded = false;

    this.gravity = gravity;

    this.particles = [];
  }

  update() {
    if(!this.exploded) {
      this.applyForce(this.gravity);
      super.update();
      
      if(this.velocity.y >= this.delay) {
        this.explode();
      }
    } else {
      for(let i = this.particles.length -1; i >= 0; i--) {
        let particle = this.particles[i];
        
        particle.applyForce(this.gravity);
        particle.update();
        
        if(particle.expired()) {
          let index = this.particles.indexOf(particle);
          this.particles.splice(index, 1);
        }
      }
    }
  }

  explode() {
    let particleCount = Math.round(100 + Math.random() * 20);
    
    let perlinRed = new Perlin();
    let perlinGreen = new Perlin();
    let perlinBlue = new Perlin();
    for(let i = 0; i < particleCount; i++) {
      let particle = new Particle(this.pos.x, this.pos.y, this.mass / particleCount);
      
      let perlin = new Perlin();

      let angle = Math.random() * 360;
      particle.velocity.x = Math.sin(angle);
      particle.velocity.y = Math.cos(angle);
      particle.velocity.setMag(perlin.get(i / 10, 0, 0) * 10);
      
      particle.lifespan = perlin.get(i / 10 + 5, 0, 0) * 420;
      
      particle.colorVal(127 + perlinRed.get(i / 10) * 255, 127 + perlinGreen.get(i / 2) * 255, 127 + perlinBlue.get(i / 3) * 255, 1);
      
      this.particles.push(particle);
    }

    this.exploded = true;
  }
  
  expired() {
    return this.exploded && this.particles.length == 0;
  }
  
  show(ctx) {
    if(!this.exploded) {
      super.show(ctx);
    } else {
      for(let particle of this.particles) {
        particle.show(ctx);
      }
    }
  }
}

export default Firework;