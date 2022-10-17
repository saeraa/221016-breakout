const grid = document.querySelector(".grid");
const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 20;
const BOARD_WIDTH = 560;
const BOARD_HEIGHT = 300;
const BALL_SIZE = 20;
const LIVES = 3;
const BLOCKS_NUMBER = 15

const scoreEl = document.querySelector("#score")
const livesEl = document.querySelector("#lives")
document.addEventListener("mousemove", mouseMoveHandler, false);


function mouseMoveHandler(e) {
  let relativeX = e.clientX;

  if (relativeX < BLOCK_WIDTH) {
    currentPosition = [0, 10];
  } else if (relativeX < BOARD_WIDTH) {
    currentPosition = [relativeX - BLOCK_WIDTH, 10];
  }

  drawUser();
}

const ballStart = [270, 40];
let ballPosition = ballStart;

const userStart = [230, 10];
let currentPosition = userStart;

let timerId;
let xDirection = 2;
let yDirection = 2;
let score = 0;
let currentLives = LIVES;


function startGame() {


}


function resetGame() {
  timerId = null;
  xDirection = 2;
  yDirection = 2;
  score = 0;
  currentLives = LIVES;
  currentPosition = userStart;
  ballPosition = ballStart;
}

function drawLives() {
  if (currentLives < LIVES) {
    const amount = document.querySelectorAll(".life").length
    document.querySelectorAll(".life")[amount - 1].classList.remove("life")
  } else {
    for (let i = 0; i < currentLives; i++) {
      const life = document.createElement("div")
      life.classList.add("life")
      livesEl.appendChild(life)
    }
  }
}

drawLives()

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + BLOCK_WIDTH, yAxis];
    this.topLeft = [xAxis, yAxis + BLOCK_HEIGHT]
    this.topRight = [xAxis + BLOCK_WIDTH, yAxis + BLOCK_HEIGHT]
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

function addBlocks() {
  for (let i = 0; i < BLOCKS_NUMBER; i++) {
    const block = document.createElement('div');
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px"
    block.style.bottom = blocks[i].bottomLeft[1] + "px"
    grid.appendChild(block);
  }
}

addBlocks();

const player = document.createElement('div');
player.classList.add("user");
grid.appendChild(player);
drawUser();

const ball = document.createElement("div");
ball.classList.add("ball");
grid.appendChild(ball);
drawBall();

function drawUser() {
  player.style.left = currentPosition[0] + "px";
  player.style.bottom = currentPosition[1] + "px";
}

function drawBall() {
  ball.style.left = ballPosition[0] + "px";
  ball.style.bottom = ballPosition[1] + "px";
}


function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < (BOARD_WIDTH - BLOCK_WIDTH)) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser)

function moveBall() {
  ballPosition[0] += xDirection;
  ballPosition[1] += yDirection;
  drawBall();
  checkCollision();
}

timerId = setInterval(moveBall, 10)

function checkCollision() {

  //user
  if (
    (ballPosition[0] > currentPosition[0] && ballPosition[0] < currentPosition[0] + BLOCK_WIDTH) &&
    (ballPosition[1] > currentPosition[1] && ballPosition[1] < currentPosition[1] + BLOCK_HEIGHT)
  ) {
    changeDirection()
  }

  //blocks
  for (let i = 0; i < blocks.length; i++) {
    if (
      (ballPosition[0] > blocks[i].bottomLeft[0] && ballPosition[0] < blocks[i].bottomRight[0]) &&
      ((ballPosition[1] + BALL_SIZE) > blocks[i].bottomLeft[1] && ballPosition[1] < blocks[i].topLeft[1])
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"))
      allBlocks[i].classList.remove("block")
      blocks.splice(i, 1)
      changeDirection();
      score++;
      scoreEl.textContent = score;
      if (score === BLOCKS_NUMBER) {
        alert("You win!")
      }
    }
  }

  //gameboard
  if (
    ballPosition[0] >= (BOARD_WIDTH - BALL_SIZE) ||
    ballPosition[1] >= (BOARD_HEIGHT - BALL_SIZE) ||
    ballPosition[0] <= 0
  ) {
    changeDirection()
  }

  if (ballPosition[1] <= 0) {
    clearInterval(timerId);
    --currentLives;
    drawLives()
    scoreEl.innerText = "You lose"
    document.removeEventListener("keydown", moveUser)
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}