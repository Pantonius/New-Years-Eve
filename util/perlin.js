import Vector from "./vector";

class Perlin {

  constructor() {
    this.seed();
  }

  gradientVector() {
    let theta = Math.random() * 2 * Math.PI;
    return new Vector(Math.cos(theta), Math.sin(theta), Math.tan(theta));
  }

  dotProductGrid(x, y, z, vx, vy, vz) {
    let gradientVector;
    let dVector = new Vector(x - vx, y - vy, z - vz);

    if(this.gradients[[vx, vy, vz]]) {
      gradientVector = this.gradients[[vx, vy, vz]];
    } else {
      gradientVector = this.gradientVector();
      this.gradients[[vx, vy, vz]] = gradientVector;
    }

    return dVector.x * gradientVector.x + dVector.y * gradientVector.y + dVector.z * gradientVector.z;
  }

  interpolate(x, a, b) {
    return a + (6*x**5 - 15*x**4 + 10*x**3) * (b-a);
  }

  seed() {
    this.gradients = {};
  }

  get(x, y, z) {
    if(!x) return;
    if(!y) y = 0;
    if(!z) z = 0;

    let xf = Math.floor(x);
    let yf = Math.floor(y);
    let zf = Math.floor(z);

    // Interpolation
    let tl = this.dotProductGrid(x, y, z, xf, yf, zf);
    let tr = this.dotProductGrid(x, y, z, xf +1, yf, zf);
    let bl = this.dotProductGrid(x, y, z, xf, yf +1, zf);
    let br = this.dotProductGrid(x, y, z, xf +1, yf +1, zf);
    let dtl = this.dotProductGrid(x, y, z, xf, yf, zf +1);
    let dtr = this.dotProductGrid(x, y, z, xf +1, yf, zf +1);
    let dbl = this.dotProductGrid(x, y, z, xf, yf +1, zf +1);
    let dbr = this.dotProductGrid(x, y, z, xf +1, yf +1, zf +1);
    
    let xt = this.interpolate(x - xf, tl, tr);
    let xb = this.interpolate(x - xf, bl, br);
    let xdt = this.interpolate(x - xf, dtl, dtr);
    let xdb = this.interpolate(x - xf, dbl, dbr);
    
    let ya = this.interpolate(y - yf, xt, xb);
    let yd = this.interpolate(y - yf, xdt, xdb);

    let value = this.interpolate(z - zf, ya, yd);

    return value;
  }
}

export default Perlin;