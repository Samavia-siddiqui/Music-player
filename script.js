const songs = [
  { title: "Acoustic Folk", artist: "Pixabay", src: "songs/song1.mp3" },
  { title: "Chill Sunset", artist: "Finley", src: "songs/song2.mp3" },
  { title: "Beat of Nature", artist: "Pixabay", src: "songs/song3.mp3" },
  { title: "Sad Piano", artist: "Ludosoundx", src: "songs/song4.mp3" },
  { title: "Lofi Girl", artist: "Mondamusic", src: "songs/song5.mp3" },
  { title: "The Mountain", artist: "Pixabay", src: "songs/song6.mp3" },
];

let currentIndex = 0;
let isPlaying = false;

const audio = new Audio();
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const progressBar = document.getElementById('progressBar');
const volumeSlider = document.getElementById('volumeSlider');
const albumArt = document.getElementById('albumArt');
const playlistEl = document.getElementById('playlist');

function formatTime(secs) {
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function loadSong(index) {
  const song = songs[index];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  audio.src = song.src;
  audio.volume = volumeSlider.value;
  progressFill.style.width = '0%';
  progressThumb.style.left = '0%';
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  updatePlaylist();
}

function buildPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, i) => {
    const item = document.createElement('div');
    item.className = 'playlist-item' + (i === currentIndex ? ' active' : '');
    item.innerHTML = `
      <span class="p-num">${i + 1}</span>
      <div class="p-info">
        <div class="p-title">${song.title}</div>
        <div class="p-artist">${song.artist}</div>
      </div>
      <span class="p-dur" id="dur-${i}">0:00</span>
    `;
    item.addEventListener('click', () => {
      currentIndex = i;
      loadSong(currentIndex);
      playSong();
    });
    playlistEl.appendChild(item);
  });
}

function updatePlaylist() {
  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === currentIndex);
    const pNum = item.querySelector('.p-num');
    if (i === currentIndex && isPlaying) {
      pNum.innerHTML = `<div class="bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>`;
    } else {
      pNum.textContent = i + 1;
    }
  });
}

function playSong() {
  audio.play();
  isPlaying = true;
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';
  albumArt.classList.add('playing');
  updatePlaylist();
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  albumArt.classList.remove('playing');
  updatePlaylist();
}

playBtn.addEventListener('click', () => {
  if (isPlaying) pauseSong();
  else playSong();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
});

audio.addEventListener('timeupdate', () => {
  const pct = (audio.currentTime / audio.duration) * 100 || 0;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
  const durEl = document.getElementById(`dur-${currentIndex}`);
  if (durEl) durEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
});

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (isPlaying) pauseSong(); else playSong();
  }
  if (e.code === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) playSong();
  }
  if (e.code === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) playSong();
  }
});

buildPlaylist();
loadSong(currentIndex);