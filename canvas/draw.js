import Firework from './firework';
import Vector from '../util/vector';

// ******************************
// Background
// ******************************
const background = document.getElementsByClassName('background backdrop')[0];
const sun = document.getElementById('sun');
const lights = document.getElementsByClassName('background light');

function drawBackground() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let seconds = new Date().getTime() / 1000;
  let radian = (seconds * Math.PI / 12 / 60 / 60) - (Math.PI / 2);

  let y = height - Math.sin(radian) * height - (sun.style.height / 2);
  let red = Math.sin(radian - Math.PI * .1) * 150;
  let green = Math.sin(radian) * 240;
  let blue = Math.sin(radian) * 250;
  let opacity = (y  - height) / height;

  sun.style.transform = `translate(${width / 3}px, ${y}px)`;
  background.style.background = `rgb(${red}, ${green}, ${blue})`; 
  
  for(let i = 0; i < lights.length; i++) {
    lights[i].style.opacity = opacity - opacity * i * .75;
  }
}

// ******************************
// Fireworks
// ******************************
const canvas = document.getElementById('foreground-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let fireworks = [];
let gravity = new Vector(0, .2, 0);

let draw;
function drawFireworks() {
  draw = requestAnimationFrame(drawFireworks);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(Math.random() < (canvas.width / 7500)) {
    let firework = new Firework(Math.random() * canvas.width, canvas.height, 1, gravity);
    firework.velocity = new Vector((Math.random() * 2) - 1, - Math.sqrt(2 * gravity.y * canvas.height * (.2 + Math.random() * .6)));

    fireworks.push(firework);
  }
  
  for(let i = fireworks.length -1; i >= 0; i--) {
    let firework = fireworks[i];

    firework.update();
    firework.show(ctx);

    if(firework.expired()) {
      let index = fireworks.indexOf(firework);
      fireworks.splice(index, 1);
    }
  }

  return draw;
}

export {
  drawFireworks,
  drawBackground
}