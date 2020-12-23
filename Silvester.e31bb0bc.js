// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"util/vector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Vector {
  constructor(x, y, z) {
    this.set(x, y, z);
  }

  set(x, y, z) {
    if (x) this.x = x;else this.x = 0;
    if (y) this.y = y;else this.y = 0;
    if (z) this.z = z;else this.z = 0;
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
    if (mag != 0) this.div(mag);
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
    if (factor) {
      return new Vector(vector.x * factor, vector.y * factor, vector.z * factor);
    } else {
      // vector is actually scalar
      this.set(this.x * vector, this.y * vector, this.z * vector);
    }
  }

  div(vector, factor) {
    if (factor) {
      return new Vector(vector.x / factor, vector.y / factor, vector.z / factor);
    } else {
      // vector is actually scalar
      this.set(this.x / vector, this.y / vector, this.z / vector);
    }
  }

  add(v1, v2) {
    if (v2) {
      return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    } else {
      this.set(this.x + v1.x, this.y + v1.y, this.z + v1.z);
    }
  }

  subtr(v1, v2) {
    if (v2) {
      return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    } else {
      this.set(this.x - v1.x, this.y - v1.y, this.z - v1.z);
    }
  }

}

var _default = Vector;
exports.default = _default;
},{}],"canvas/particle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vector = _interopRequireDefault(require("../util/vector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Particle {
  constructor(x, y, mass) {
    this.pos = new _vector.default(x, y);
    this.prevPos = new _vector.default(x, y);
    this.mass = mass;
    this.velocity = new _vector.default(0, 0);
    this.acceleration = new _vector.default(0, 0);
    this.lifespan = -1;
    this.deltaTime = 0;
    this.color = {
      colorMode: 'rgba',
      r: 255,
      g: 255,
      b: 255,
      a: 255
    };
  }

  update() {
    this.updatePrevPos();
    this.velocity.add(this.acceleration);
    this.pos.add(this.velocity);
    this.acceleration.set(0, 0);

    if (this.lifespan != -1) {
      this.deltaTime++;
    }
  }

  updatePrevPos() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    this.prevPos.z = this.pos.z;
  }

  show(ctx) {
    if (this.lifespan != -1) {
      let a = this.color.a - this.color.a * (this.deltaTime / this.lifespan);
      ctx.strokeStyle = "".concat(this.color.colorMode, "(").concat(this.color.r, ", ").concat(this.color.g, ", ").concat(this.color.b, ", ").concat(a, ")");
    } else {
      ctx.strokeStyle = "".concat(this.color.colorMode, "(").concat(this.color.r, ", ").concat(this.color.g, ", ").concat(this.color.b, ", ").concat(this.color.a, ")");
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
    let f = new _vector.default().mult(force, this.mass);
    this.acceleration.add(f);
  }

}

var _default = Particle;
exports.default = _default;
},{"../util/vector":"util/vector.js"}],"util/perlin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vector = _interopRequireDefault(require("./vector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Perlin {
  constructor() {
    this.seed();
  }

  gradientVector() {
    let theta = Math.random() * 2 * Math.PI;
    return new _vector.default(Math.cos(theta), Math.sin(theta), Math.tan(theta));
  }

  dotProductGrid(x, y, z, vx, vy, vz) {
    let gradientVector;
    let dVector = new _vector.default(x - vx, y - vy, z - vz);

    if (this.gradients[[vx, vy, vz]]) {
      gradientVector = this.gradients[[vx, vy, vz]];
    } else {
      gradientVector = this.gradientVector();
      this.gradients[[vx, vy, vz]] = gradientVector;
    }

    return dVector.x * gradientVector.x + dVector.y * gradientVector.y + dVector.z * gradientVector.z;
  }

  interpolate(x, a, b) {
    return a + (6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3) * (b - a);
  }

  seed() {
    this.gradients = {};
  }

  get(x, y, z) {
    if (!x) return;
    if (!y) y = 0;
    if (!z) z = 0;
    let xf = Math.floor(x);
    let yf = Math.floor(y);
    let zf = Math.floor(z); // Interpolation

    let tl = this.dotProductGrid(x, y, z, xf, yf, zf);
    let tr = this.dotProductGrid(x, y, z, xf + 1, yf, zf);
    let bl = this.dotProductGrid(x, y, z, xf, yf + 1, zf);
    let br = this.dotProductGrid(x, y, z, xf + 1, yf + 1, zf);
    let dtl = this.dotProductGrid(x, y, z, xf, yf, zf + 1);
    let dtr = this.dotProductGrid(x, y, z, xf + 1, yf, zf + 1);
    let dbl = this.dotProductGrid(x, y, z, xf, yf + 1, zf + 1);
    let dbr = this.dotProductGrid(x, y, z, xf + 1, yf + 1, zf + 1);
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

var _default = Perlin;
exports.default = _default;
},{"./vector":"util/vector.js"}],"canvas/firework.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _particle = _interopRequireDefault(require("./particle"));

var _perlin = _interopRequireDefault(require("../util/perlin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Firework extends _particle.default {
  constructor(x, y, mass, gravity) {
    super(x, y, mass);
    this.delay = Math.random() * 2 - 1;
    this.exploded = false;
    this.gravity = gravity;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.applyForce(this.gravity);
      super.update();

      if (this.velocity.y >= this.delay) {
        this.explode();
      }
    } else {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        let particle = this.particles[i];
        particle.applyForce(this.gravity);
        particle.update();

        if (particle.expired()) {
          let index = this.particles.indexOf(particle);
          this.particles.splice(index, 1);
        }
      }
    }
  }

  explode() {
    let particleCount = Math.round(100 + Math.random() * 20);
    let perlinRed = new _perlin.default();
    let perlinGreen = new _perlin.default();
    let perlinBlue = new _perlin.default();

    for (let i = 0; i < particleCount; i++) {
      let particle = new _particle.default(this.pos.x, this.pos.y, this.mass / particleCount);
      let perlin = new _perlin.default();
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
    if (!this.exploded) {
      super.show(ctx);
    } else {
      for (let particle of this.particles) {
        particle.show(ctx);
      }
    }
  }

}

var _default = Firework;
exports.default = _default;
},{"./particle":"canvas/particle.js","../util/perlin":"util/perlin.js"}],"services/googleapi/sdk.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPlaylist = getPlaylist;
exports.getPlaylistItemCount = getPlaylistItemCount;
const api = "https://www.googleapis.com/youtube/v3/playlistItems";

async function getPlaylist(id) {
  let url = new URLSearchParams();
  url.set('key', "AIzaSyCQd5Qo1J0R9iIyS6QPobS8SAMEfiZdYKE");
  url.set('part', 'id');
  url.set('playlistId', id);
  let request = await fetch(api + '?' + url.toString());
  let response = await request.json();
  return response;
}

async function getPlaylistItemCount(id) {
  let response = await getPlaylist(id);
  console.log(response);
  return response.pageInfo.totalResults;
}
},{}],"services/googleapi/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var google = _interopRequireWildcard(require("./sdk"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = _objectSpread({}, google);

exports.default = _default;
},{"./sdk":"services/googleapi/sdk.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _firework = _interopRequireDefault(require("./canvas/firework"));

var _vector = _interopRequireDefault(require("./util/vector"));

var _googleapi = _interopRequireDefault(require("./services/googleapi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const countDownDate = new Date('Januar 1, 2021 00:00:00').getTime(); //const countDownDate = new Date(Date.now() + 5000).getTime();

const countdown = document.getElementById('countdown');
const title = document.getElementById('title');
const currentSong = document.getElementById('currentSong');
const previousTrack = document.getElementById('previousTrack');
const toggleTrack = document.getElementById('toggleTrack');
const nextTrack = document.getElementById('nextTrack');
const playlistId = 'PLr6S79MwreeUBXyVbLKjIuOZ2QWV4U79f'; // ******************************
// Fireworks
// ******************************

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
let fireworks = [];
let gravity = new _vector.default(0, .2, 0);
let draw;

function drawFireworks() {
  draw = requestAnimationFrame(drawFireworks);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < canvas.width / 7500) {
    let firework = new _firework.default(Math.random() * canvas.width, canvas.height, 1, gravity);
    firework.velocity = new _vector.default(Math.random() * 2 - 1, -Math.sqrt(2 * gravity.y * canvas.height * (.2 + Math.random() * .6)));
    fireworks.push(firework);
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    let firework = fireworks[i];
    firework.update();
    firework.show(ctx);

    if (firework.expired()) {
      let index = fireworks.indexOf(firework);
      fireworks.splice(index, 1);
    }
  }
} // ******************************
// Countdown
// ******************************


let countdownInterval = setInterval(() => {
  // until New Year
  let now = new Date().getTime();
  let until = countDownDate - now;
  let days = Math.floor(until / (1000 * 60 * 60 * 24));
  let hours = Math.floor(until % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  let minutes = Math.floor(until % (1000 * 60 * 60) / (1000 * 60));
  let seconds = Math.floor(until % (1000 * 60) / 1000);
  countdown.innerHTML = "".concat(formatTime(days), "d ").concat(formatTime(hours), "h ").concat(formatTime(minutes), "m ").concat(formatTime(seconds), "s");
  title.innerHTML = "until New Year's Eve";

  if (until < 0) {
    drawFireworks();
    countdown.innerHTML = 'HAPPY NEW YEAR';
    title.innerHTML = new Date().toTimeString().substr(0, 8); // After New Year

    setInterval(() => {
      let time = new Date().toTimeString().substr(0, 8);
      countdown.innerHTML = 'HAPPY NEW YEAR';
      title.innerHTML = time;
      clearInterval(countdownInterval);
    }, 1000);
  }
}, 1000);

function formatTime(number) {
  if (number < 10) return "0".concat(number);else return number;
} // ******************************
// LOFI-PLAYER
// ******************************
// Load API asynchronously

/*let iframeApiScriptTag = document.createElement('script');
iframeApiScriptTag.src = "https://www.youtube.com/iframe_api";
let playerScriptTag = document.getElementById('player');
playerScriptTag.parentNode.insertBefore(iframeApiScriptTag, playerScriptTag);
*/
// Initialize Player


let player;
let playlistItemCount;

async function initPlayer() {
  playlistItemCount = await _googleapi.default.getPlaylistItemCount(playlistId);
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    playerVars: {
      controls: 0,
      autoplay: 1,
      playlist: playlistId,
      loop: 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onError
    }
  });
  console.log(player);
} // Player Events


function onPlayerReady(event) {
  event.target.loadPlaylist({
    list: playlistId,
    listType: 'playlist',
    index: Math.round(Math.random() * (playlistItemCount - 1)),
    startSeconds: 0,
    suggestedQuality: "small"
  });
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) nextVideo();
  currentSong.setAttribute('href', event.target.playerInfo.videoUrl);
}

function onError(event) {
  switch (event.data) {
    case 5:
    case 100:
    case 101:
    case 150:
      console.error(player.getVideoUrl());
      nextVideo();
      break;
  }
} // ******************************
// LOFI-PLAYER - Controls
// ******************************


function hitBounds(left) {
  let index = player.getPlaylistIndex();

  if (index == 0 && left) {
    player.playVideoAt(playlistItemCount - 1);
    return true;
  } else if (index == playlistItemCount - 1 && !left) {
    player.playVideoAt(0);
    return true;
  }

  return false;
}

function nextVideo() {
  if (!hitBounds(false)) player.nextVideo();
}

function previousVideo() {
  if (!hitBounds(true)) player.previousVideo();
}

previousTrack.addEventListener('click', () => {
  if (player) previousVideo();
});
toggleTrack.addEventListener('click', () => {
  if (!player) return;

  if (player.getPlayerState() == YT.PlayerState.PLAYING) {
    player.pauseVideo();
    toggleTrack.innerHTML = 'play_arrow';
  } else {
    player.playVideo();
    toggleTrack.innerHTML = 'pause';
  }
});
nextTrack.addEventListener('click', () => {
  if (player) nextVideo();
});
window.onload = initPlayer();
},{"./canvas/firework":"canvas/firework.js","./util/vector":"util/vector.js","./services/googleapi":"services/googleapi/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53098" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/Silvester.e31bb0bc.js.map