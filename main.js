import playBackgroundAudio from "./sound_effect.js";

// Gọi hàm playBackgroundAudio() để phát âm thanh
playBackgroundAudio();

const snakeHeadImg = document.getElementById("snakeHead");
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const gridSize = 25;
let snake = [
  { x: 10, y: 10 },
  { x: 10, y: 10 },
  { x: 10, y: 10 },
  { x: 10, y: 10 },
];
let direction = "right";
let food = { x: 5, y: 5 };
let gameOver = false; // Biến để kiểm tra trạng thái kết thúc trò chơi
let gameRestarted = false; // Biến để kiểm tra xem đã khởi động lại trò chơi hay chưa
let initialSnakeSpeed = 180; // Tốc độ ban đầu của con rắn
let snakeSpeed = initialSnakeSpeed; // Biến để theo dõi tốc độ hiện tại của con rắn
let gameInterval; // Biến để lưu trữ interval
let score = 0; // Biến để lưu trữ điểm số
let level = 1; // Biến để lưu trữ cấp độ khó của game
let isPaused = false;

function drawSnake() {
  // Màu trong suốt (đặt alpha thành 0.5)
  snake.forEach((segment, key) => {
    if (key === 0) {
      context.fillStyle = "white";
      context.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
    } else {
      context.fillStyle = "green";
      context.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
    }
  });
}

function drawFood() {
  context.fillStyle = "red";
  context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function updateScoreAndLevel() {
  const scoreElement = document.getElementById("score");
  const levelsElement = document.getElementById("levels");
  scoreElement.textContent = `Score: ${score}`;
  levelsElement.textContent = `Levels: ${level}`;
}

function moveSnake() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "right") {
    snakeHeadImg.style.transform = "rotate(-90deg)";
    snakeHeadImg.style.left = headX * gridSize + 25 + "px";
    snakeHeadImg.style.top = headY * gridSize - 2 + "px";
    headX++;
  } else if (direction === "left") {
    snakeHeadImg.style.transform = "rotate(90deg)";
    snakeHeadImg.style.left = headX * gridSize - 30 + "px";
    snakeHeadImg.style.top = headY * gridSize - 2 + "px";
    headX--;
  } else if (direction === "up") {
    snakeHeadImg.style.transform = "rotate(180deg)";
    snakeHeadImg.style.left = headX * gridSize - 2 + "px";
    snakeHeadImg.style.top = headY * gridSize - 30 + "px";
    headY--;
  } else if (direction === "down") {
    snakeHeadImg.style.transform = "rotate(0deg)";
    snakeHeadImg.style.left = headX * gridSize - 2 + "px";
    snakeHeadImg.style.top = headY * gridSize + 25 + "px";
    headY++;
  }

  snake.unshift({ x: headX, y: headY });

  if (headX === food.x && headY === food.y) {
    // Snake ate the food
    score += 10; // Tăng điểm số khi ăn thức ăn
    updateScoreAndLevel(); // Cập nhật điểm số trên màn hình
    if (score % 50 === 0) {
      // Nếu điểm số chia hết cho 100, tăng cấp độ và tốc độ
      level++;
      updateScoreAndLevel();
      snakeSpeed -= 35;
      console.log(`tốc độ hiện tại: ${snakeSpeed}`);
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, snakeSpeed);
    }
    generateFood();
  } else {
    // Remove the tail segment
    snake.pop();
  }
  // Cập nhật vị trí và hiển thị hình ảnh đầu con rắn
  snakeHeadImg.style.display = "block";
}

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );

  food = newFood;
}

function checkCollision() {
  const head = snake[0];
  // Check if the snake hits the wall or itself
  if (
    head.x < 0 ||
    head.x >= canvas.width / gridSize ||
    head.y < 0 ||
    head.y >= canvas.height / gridSize
  ) {
    clearInterval(gameInterval);
    if (!gameOver) {
      alert("Game Over");
      gameOver = true; // Đặt trạng thái kết thúc trò chơi thành true
      gameRestarted = false; // Đặt trạng thái khởi động lại trò chơi thành false
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(gameInterval);
      if (!gameOver) {
        alert("Game Over");
        gameOver = true; // Đặt trạng thái kết thúc trò chơi thành true
        gameRestarted = false; // Đặt trạng thái khởi động lại trò chơi thành false
      }
      break;
    }
  }
}

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  checkCollision();
  drawFood();
  drawSnake();
  if (score === 250) {
    alert("bạn đã thắng !!!");
    restartGame();
  }
}

document.addEventListener("keydown", function (event) {
  if (gameOver) {
    if (event.ctrlKey && event.code === "Space") {
      restartGame();
      //   document.querySelector(".btnRestart").Click();
    }
    return;
  }
  if (!event.ctrlKey && event.code === "Space") {
    pauseGame();
  }
  // Xử lý phím tắt bình thường khi trò chơi đang diễn ra
  if (event.key === "ArrowRight" && direction !== "left") direction = "right";
  else if (event.key === "ArrowLeft" && direction !== "right")
    direction = "left";
  else if (event.key === "ArrowUp" && direction !== "down") direction = "up";
  else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
});

function restartGame() {
  // Đặt lại tất cả trạng thái cần thiết để khởi động lại trò chơi
  snake = [
    { x: 10, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 10 },
    { x: 10, y: 10 },
  ];
  direction = "right";
  gameOver = false;
  generateFood();
  gameRestarted = true; // Đánh dấu rằng đã khởi động lại trò chơi
  snakeSpeed = initialSnakeSpeed; // Đặt lại tốc độ ban đầu
  score = 0;
  level = 1; // Đặt lại điểm số thành 0
  updateScoreAndLevel(); // Cập nhật điểm số trên màn hình
  clearInterval(gameInterval); // Xóa interval cũ
  gameInterval = setInterval(gameLoop, snakeSpeed); // Khởi tạo interval mới
}

function pauseGame() {
  const btnPause = document.querySelector(".btnPause");
  if (!isPaused) {
    clearInterval(gameInterval); // Dừng interval nếu đang chạy
    isPaused = true;
    btnPause.innerHTML = "CONTINUE GAME";
  } else {
    gameInterval = setInterval(gameLoop, snakeSpeed); // Tiếp tục interval nếu đã tắt
    isPaused = false;
    btnPause.innerHTML = "PAUSE GAME";
  }
}

updateScoreAndLevel();

generateFood();

gameInterval = setInterval(gameLoop, snakeSpeed);
