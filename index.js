import Firework from "./canvas/firework";
import Vector from "./util/vector";

import google from "./services/googleapi";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const countDownDate = new Date('Januar 1, 2021 00:00:00').getTime();
//const countDownDate = new Date(Date.now() + 5000).getTime();
const countdown = document.getElementById('countdown');
const title = document.getElementById('title');

const currentSong = document.getElementById('currentSong');
const previousTrack = document.getElementById('previousTrack');
const toggleTrack = document.getElementById('toggleTrack');
const nextTrack = document.getElementById('nextTrack');
const playlistId = 'PLr6S79MwreeUBXyVbLKjIuOZ2QWV4U79f';

// ******************************
// Fireworks
// ******************************
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
}

// ******************************
// Countdown
// ******************************
let countdownInterval = setInterval(() => {
  // until New Year
  let now = new Date().getTime();
  let until = countDownDate - now;

  let days = Math.floor(until / (1000 * 60 * 60 * 24));
  let hours = Math.floor((until % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((until % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((until % (1000 * 60)) / 1000);

  countdown.innerHTML = `${formatTime(days)}d ${formatTime(hours)}h ${formatTime(minutes)}m ${formatTime(seconds)}s`;
  title.innerHTML = "until New Year's Eve";

  if(until < 0) {
    drawFireworks();

    countdown.innerHTML = 'HAPPY NEW YEAR';
    title.innerHTML = new Date().toTimeString().substr(0, 8);

    // After New Year
    setInterval(() => {
      let time = new Date().toTimeString().substr(0, 8);
    
      countdown.innerHTML = 'HAPPY NEW YEAR';
      title.innerHTML = time;
      
      clearInterval(countdownInterval);
    }, 1000);
  }
}, 1000);

function formatTime(number) {
  if(number < 10)
    return `0${number}`;
  else
    return number;
}

// ******************************
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
  playlistItemCount = await google.getPlaylistItemCount(playlistId);
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
}

// Player Events
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
  if(event.data == YT.PlayerState.ENDED) nextVideo();

  currentSong.setAttribute('href', event.target.playerInfo.videoUrl);
}

function onError(event) {
  switch (event.data) {
    case 5:
    case 100:
    case 101:
    case 150:
      console.error(player.getVideoUrl())
      nextVideo();

      break;
  }
}

// ******************************
// LOFI-PLAYER - Controls
// ******************************
function hitBounds(left) {
  let index = player.getPlaylistIndex();

  if(index == 0 && left) {
    player.playVideoAt(playlistItemCount -1);
    return true;
  } else if(index == playlistItemCount -1 && !left) {
    player.playVideoAt(0);
    return true;
  }

  return false;
}

function nextVideo() {
  if(!hitBounds(false)) player.nextVideo();
}

function previousVideo() {
  if(!hitBounds(true)) player.previousVideo();
}

previousTrack.addEventListener('click', () => {
  if(player)
    previousVideo();
});

toggleTrack.addEventListener('click', () => {
  if(!player) return;

  if(player.getPlayerState() == YT.PlayerState.PLAYING) {
    player.pauseVideo();
    toggleTrack.innerHTML = 'play_arrow';
  }
  else {
    player.playVideo();
    toggleTrack.innerHTML = 'pause'
  }
    
});

nextTrack.addEventListener('click', () => {
  if(player)
    nextVideo();
});

window.onload = initPlayer();