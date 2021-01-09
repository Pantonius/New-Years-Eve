import google from './services/googleapi';
import canvas from './canvas';

const countdown = document.getElementById('countdown');
const title = document.getElementById('title');

const currentSong = document.getElementById('currentSong');
const previousTrack = document.getElementById('previousTrack');
const toggleTrack = document.getElementById('toggleTrack');
const nextTrack = document.getElementById('nextTrack');
const volumeRange = document.getElementById('volume');
const playlistId = 'PLr6S79MwreeUBXyVbLKjIuOZ2QWV4U79f';

// ******************************
// Countdown
// ******************************
let countdownInterval = setInterval(() => {
  // until New Year
  let countDownDate = new Date(`Jan 1 ${ new Date().getFullYear() + 1 } 00:00:00`).getTime();
  let now = new Date().getTime();
  let until = countDownDate - now;

  let year = new Date(now).getFullYear();
  let leapYear = (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);

  let draw;

  // begin countdown with first day of december
  if(convertTime(until).days < 31) {
    if(draw) cancelAnimationFrame(draw);

    let time = convertTime(until);

    countdown.innerHTML = `${formatTime(time.days)}d ${formatTime(time.hours)}h ${formatTime(time.minutes)}m ${formatTime(time.seconds)}s`;
    
    title.classList.toggle('hidden', false);
    title.innerHTML = "until New Year's Eve";
    
  // draw fireworks on NYE
  } else if(convertTime(until).days >= (365 + leapYear) - 1) {
    if(draw) cancelAnimationFrame(draw);

    countdown.innerHTML = 'HAPPY NEW YEAR';
    
    title.classList.toggle('hidden', false);
    title.innerHTML = new Date(now).toTimeString().substr(0, 8);

    draw = canvas.drawFireworks();
  } else {
    if(draw) cancelAnimationFrame(draw);

    countdown.innerHTML = new Date(now).toTimeString().substr(0, 8);
    title.classList.toggle('hidden', true);
  }
}, 1000);

function formatTime(number) {
  if(number < 10)
    return `0${number}`;
  else
    return number;
}

function convertTime(millis) {
  return {
    days: Math.floor(millis / (1000 * 60 * 60 * 24)),
    hours: Math.floor((millis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((millis % (1000 * 60)) / 1000)
  };
}

// ******************************
// LOFI-PLAYER
// ******************************

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
      console.error('Could not play video: ' + player.getVideoUrl())
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

volumeRange.addEventListener('input', () => {
  player.setVolume(volumeRange.value);
});
volumeRange.value = 80;

// ******************************
// Initialize
// ******************************
async function init() {
  canvas.drawBackground();
  setInterval(canvas.drawBackground, 1000);
  
  await initPlayer();
}

window.onload = init();