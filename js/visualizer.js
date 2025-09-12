const audioFiles = [
  "assets/music/track1.mp3",
  "assets/music/track2.mp3",
  "assets/music/track3.mp3"
];

let currentTrack = 0;
let isPlaying = false;
let audio = new Audio(audioFiles[currentTrack]);
let audioCtx, analyser, source, dataArray;
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function setupAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
}

function draw() {
  requestAnimationFrame(draw);
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / dataArray.length) * 1.5;
  let x = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

// Controls
document.getElementById("play").addEventListener("click", () => {
  setupAudio();
  if (isPlaying) {
    audio.pause();
    document.getElementById("play").innerText = "▶";
  } else {
    audio.play();
    audioCtx.resume();
    document.getElementById("play").innerText = "⏸";
    draw();
  }
  isPlaying = !isPlaying;
});

document.getElementById("prev").addEventListener("click", () => {
  audio.pause();
  currentTrack = (currentTrack - 1 + audioFiles.length) % audioFiles.length;
  audio = new Audio(audioFiles[currentTrack]);
  setupAudio();
  if (isPlaying) audio.play();
});

document.getElementById("next").addEventListener("click", () => {
  audio.pause();
  currentTrack = (currentTrack + 1) % audioFiles.length;
  audio = new Audio(audioFiles[currentTrack]);
  setupAudio();
  if (isPlaying) audio.play();
});
