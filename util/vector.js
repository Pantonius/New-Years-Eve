class Vector {
  constructor(x, y, z) {
    this.set(x, y, z);
  }

  set(x, y, z) {
    if(x) this.x = x;
    else this.x = 0;

    if(y) this.y = y;
    else this.y = 0;

    if(z) this.z = z;
    else this.z = 0;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  magSq() {
    const mag = this.mag();
    return Math.pow(mag, 2);
  }

  normalize() {
    const mag = this.mag();
    
    if(mag != 0)
      this.div(mag);
  }

  setMag(mag) {
    this.normalize();
    this.mult(mag);
  }

  fromAngle(angle) {
    this.set(Math.cos(angle), Math.sin(angle));
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  mult(vector, factor) {
    if(factor) {
      return new Vector(vector.x * factor, vector.y * factor, vector.z * factor);
    } else {
      // vector is actually scalar
      this.set(this.x * vector, this.y * vector, this.z * vector);
    }
  }

  div(vector, factor) {
    if(factor) {
      return new Vector(vector.x / factor, vector.y / factor, vector.z / factor);
    } else {
      // vector is actually scalar
      this.set(this.x / vector, this.y / vector, this.z / vector);
    }
  }

  add(v1, v2) {
    if(v2) {
      return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    } else {
      this.set(this.x + v1.x, this.y + v1.y, this.z + v1.z);
    }
  }

  subtr(v1, v2) {
    if(v2) {
      return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    } else {
      this.set(this.x - v1.x, this.y - v1.y, this.z - v1.z);
    }
  }
}

export default Vector;