const backgroundAudio = new Audio("./audio/sound_playing.mp3");

export default function playBackgroundAudio() {
  backgroundAudio.loop = true;
  backgroundAudio.autoplay = true;

  // Đảm bảo rằng âm thanh đã tải xong trước khi phát nó
  backgroundAudio.addEventListener("canplaythrough", function () {
    backgroundAudio.play();
  });
}
