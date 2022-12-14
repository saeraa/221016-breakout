const blocksPositionArray = [
	[10, 270], // (padding) , (BOARD_HEIGHT - BLOCK_HEIGHT - padding)
	[120, 270], // (padding + BOARD_WIDTH + padding) , (BOARD_HEIGHT - BLOCK_HEIGHT)
	[230, 270], // (padding + BOARD_WIDTH + padding + BOARD_WIDTH + padding)
	[340, 270],
	[450, 270],
	[10, 240], // (padding) , (BOARD_HEIGHT - BLOCK_HEIGHT - padding - BLOCK_HEIGHT - padding)
	[120, 240], // (padding + BOARD_WIDTH + padding) , (BOARD_HEIGHT - BLOCK_HEIGHT - padding - BLOCK_HEIGHT - padding)
	[230, 240],
	[340, 240],
	[450, 240],
	[10, 210], // (padding) , (BOARD_HEIGHT - BLOCK_HEIGHT - padding - BLOCK_HEIGHT - padding - BLOCK_HEIGHT - padding)
	[120, 210], // (padding + BOARD_WIDTH + padding) , (BOARD_HEIGHT - BLOCK_HEIGHT - padding - BLOCK_HEIGHT - padding - BLOCK_HEIGHT - padding)
	[230, 210],
	[340, 210],
	[450, 210]
];
// const BLOCK_ROWS = 3;
// const BLOCK_COLUMNS = 5;
// const PADDING = 10; // TODO: if replacing above array with calculated values
const BLOCK_WIDTH = 100; // also used for PADDLE_WIDTH
const BLOCK_HEIGHT = 20; // also used for PADDLE_HEIGHT
const BOARD_WIDTH = 560; // PADDING * (BLOCK_COLUMNS + 1) + (BLOCK_COLUMNS * BLOCK_WIDTH)
const BOARD_HEIGHT = 300; // 210px + (BLOCK_ROWS*BLOCK_HEIGHT) + (BLOCK_ROWS*PADDING)
const BALL_SIZE = 20;
const LIVES = 3;
const BLOCKS_NUMBER = 15; // BLOCK_ROWS * BLOCK_COLUMNS
const BALL_START_POSITION = [270, 40]; // middle of the board, above the paddle
const USER_START_POSITION = [230, 10]; // (BOARD_WIDTH / 2) - (PADDLE_WIDTH / 2) , PADDING
const blocks = [];
const INITIAL_INTERVAL = 10;

const grid = document.querySelector(".grid");
const scoreEl = document.querySelector("#score");
const livesEl = document.querySelector("#lives");
const resetBtn = document.querySelector("#reset");
const startBtn = document.querySelector("#start");

resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", startGame);
window.addEventListener("load", function () {
	resetBtn.disabled = true;
	currentLives = LIVES;
	drawLives(false, true);
});

function mouseMoveHandler(e) {
	let relativeX = e.clientX;

	if (relativeX < BLOCK_WIDTH) {
		currentPosition = [0, 10];
	} else if (relativeX < BOARD_WIDTH) {
		currentPosition = [relativeX - BLOCK_WIDTH + 4, 10];
	}

	drawUser();
}

let ballPosition;
let currentPosition;
let timerId;
let xDirection; // -2 ??t v??nster, 2 ??t h??ger
let yDirection; // -2 ner??t, 2 upp??t
let score;
let currentLives;
let player;
let ball;
let interval;

class Block {
	constructor(xAxis, yAxis) {
		this.bottomLeft = [xAxis, yAxis];
		this.bottomRight = [xAxis + BLOCK_WIDTH, yAxis];
		this.topLeft = [xAxis, yAxis + BLOCK_HEIGHT];
		this.topRight = [xAxis + BLOCK_WIDTH, yAxis + BLOCK_HEIGHT];
	}
}

function startBallMoving() {
	xDirection = 2;
	yDirection = 2;
	const randomStartPosition =
		Math.floor(Math.random() * BOARD_WIDTH - BALL_SIZE) + 10;
	console.log(randomStartPosition);
	ballPosition = [randomStartPosition, 40];
	createBall();
	timerId = setInterval(moveBall, interval);
}

function clearGameBoard(ballEl = false) {
	if (ballEl) {
		ball.remove(".ball"); //! replace with deleting div, not class
		return;
	}
	ball.remove(".ball"); //! replace with deleting div, not class
	player.remove(".player"); //! replace with deleting div, not class
	const blocks = [...document.querySelectorAll(".block")];
	blocks.forEach((block) => {
		block.remove(".block");
	});
}

function startGame() {
	if (currentLives === 0) {
		alert("You can't play with no lives! Reset first");
		return;
	}

	if (ball && player) {
		clearGameBoard();
	}
	resetBtn.disabled = false;
	console.log("startGame");

	currentPosition = USER_START_POSITION;

	createUser();

	score = 0;
	interval = INITIAL_INTERVAL;
	document.addEventListener("mousemove", mouseMoveHandler, false);
	console.log("startGame, interval: ", interval);
	startBallMoving();
	createBlocks();
	drawLives();
}

function gameOver() {
	// document.removeEventListener("mousemove", mouseMoveHandler, false);
	clearInterval(timerId);
	interval = INITIAL_INTERVAL;
	console.log("gameOver, interval: ", interval);
	// timerId = setInterval(moveBall, interval);

	// document.removeEventListener("keydown", moveUser); //! REMOVE EVENT LIStener for keyboard

	// const children = Array.from(grid.children);  //! remove blocks, paddle and ball
	// children.forEach((child) => grid.removeChild(child));
}

function resetGame() {
	console.log("resetGame");

	clearGameBoard();
	clearInterval(timerId);
	timerId = null;
	xDirection = 2;
	yDirection = 2;
	score = 0;
	scoreEl.textContent = score;
	currentLives = LIVES;
	drawLives(false, true);
	currentPosition = USER_START_POSITION;
}

function drawLives(remove = false, reset = false) {
	console.log("currentLives", currentLives);
	const currentLivesEl = [...document.querySelectorAll(".life")];

	if (remove) {
		clearInterval(timerId);
		const amount = currentLivesEl.length;
		currentLivesEl[amount - 1].classList.remove("life");
		if (currentLives > 0) {
			setTimeout(() => {
				scoreEl.textContent = score;
				clearGameBoard(true);
				startBallMoving();
			}, 300);
		}
		return;
	} else if (currentLivesEl.length == 3) {
		return;
	} else if (reset) {
		currentLivesEl.forEach((life) => life.remove(".life"));

		for (let i = 0; i < currentLives; i++) {
			const life = document.createElement("div");
			life.classList.add("life");
			livesEl.appendChild(life);
		}
	}
}

function createBlocks() {
	blocks.length = 0;
	for (let i = 0; i < BLOCKS_NUMBER; i++) {
		let x = blocksPositionArray[i][0];
		let y = blocksPositionArray[i][1];
		blocks.push(new Block(x, y));
	}

	addBlocks();
}

function addBlocks() {
	for (let i = 0; i < BLOCKS_NUMBER; i++) {
		const block = document.createElement("div");
		block.classList.add("block");

		// l??gg till gul p?? f??rsta 1/3, orange p?? 2/3, r??d p?? sista
		// TODO: mer generiska klasser? "three", "two", "one"?
		if (i < BLOCKS_NUMBER / 3) {
			block.classList.add("yellow");
		} else if (i < (BLOCKS_NUMBER / 3) * 2) {
			block.classList.add("orange");
		}
		block.style.left = blocks[i].bottomLeft[0] + "px";
		block.style.bottom = blocks[i].bottomLeft[1] + "px";
		grid.appendChild(block);
	}
}

function createUser() {
	player = document.createElement("div");
	grid.appendChild(player);
	player.classList.add("user");
	drawUser();
}

function createBall() {
	ball = document.createElement("div");
	grid.appendChild(ball);
	ball.classList.add("ball");
	drawBall();
}

function drawUser() {
	player.style.left = currentPosition[0] + "px";
	player.style.bottom = currentPosition[1] + "px";
}

function drawBall() {
	ball.style.left = ballPosition[0] + "px";
	ball.style.bottom = ballPosition[1] + "px";
}

// function moveUser(e) { //* temporarily disabling keyboard movement
// 	switch (e.key) {
// 		case "ArrowLeft":
// 			if (currentPosition[0] > 0) {
// 				currentPosition[0] -= 10;
// 				drawUser();
// 			}
// 			break;
// 		case "ArrowRight":
// 			if (currentPosition[0] < BOARD_WIDTH - BLOCK_WIDTH) {
// 				currentPosition[0] += 10;
// 				drawUser();
// 			}
// 			break;
// 	}
// }

// document.addEventListener("keydown", moveUser); //* temporarily disabling keyboard movement

function removeBlock(i) {
	const allBlocks = Array.from(document.querySelectorAll(".block"));

	if (allBlocks[i].classList.contains("yellow")) {
		allBlocks[i].classList.remove("yellow");
		allBlocks[i].classList.add("orange");
	} else if (allBlocks[i].classList.contains("orange")) {
		allBlocks[i].classList.remove("orange");
	} else {
		allBlocks[i].classList.remove("block");
		blocks.splice(i, 1);
		score++;
		scoreEl.textContent = score;
		if (interval < 1) {
			return;
		}
		interval--;
		clearInterval(timerId);
		timerId = setInterval(moveBall, interval);
		console.log("score++, interval: ", interval);
	}
}

function moveBall() {
	ballPosition[0] += xDirection;
	ballPosition[1] += yDirection;
	drawBall();
	checkCollision();
}

function checkCollision() {
	//* user
	if (
		ballPosition[0] > currentPosition[0] &&
		ballPosition[0] < currentPosition[0] + BLOCK_WIDTH &&
		ballPosition[1] > currentPosition[1] &&
		ballPosition[1] < currentPosition[1] + BLOCK_HEIGHT
	) {
		changeDirection(false);
		return;
	}

	//* blocks
	for (let i = 0; i < blocks.length; i++) {
		if (yDirection == -2) {
			if (
				ballPosition[0] >= blocks[i].topLeft[0] &&
				ballPosition[0] <= blocks[i].topRight[0] &&
				ballPosition[1] >= blocks[i].topLeft[1] &&
				ballPosition[1] <= blocks[i].topRight[1]
			) {
				removeBlock(i);

				changeDirection(false);

				if (score === BLOCKS_NUMBER) {
					alert("You win! ????");
					resetGame();
				}
				return;
			}
		}
		if (yDirection == 2) {
			if (
				ballPosition[0] > blocks[i].bottomLeft[0] &&
				ballPosition[0] < blocks[i].bottomRight[0] &&
				ballPosition[1] + BALL_SIZE > blocks[i].bottomLeft[1] &&
				ballPosition[1] < blocks[i].topLeft[1]
			) {
				removeBlock(i);

				changeDirection(false);

				if (score === BLOCKS_NUMBER) {
					alert("You win! ????");
					resetGame();
				}
				return;
			}
		}
		if (
			ballPosition[0] > blocks[i].bottomLeft[0] &&
			ballPosition[0] < blocks[i].bottomRight[0] &&
			ballPosition[1] + BALL_SIZE > blocks[i].bottomLeft[1] &&
			ballPosition[1] < blocks[i].topLeft[1]
		) {
			removeBlock(i);

			changeDirection();

			if (score === BLOCKS_NUMBER) {
				alert("You win! ????");
				resetGame();
			}
			return;
		}
	}

	//* gameboard
	if (
		ballPosition[0] >= BOARD_WIDTH - BALL_SIZE + 1 ||
		//ballPosition[1] >= BOARD_HEIGHT - BALL_SIZE || //* when bollens position y ??r st??rre eller lika med board height minus bollens diameter
		ballPosition[0] <= 0
	) {
		changeDirection();
		return;
	}
	if (ballPosition[1] >= BOARD_HEIGHT - BALL_SIZE) {
		changeDirection(false);
		return;
	}

	if (ballPosition[1] <= 0) {
		if (currentLives != 0) {
			--currentLives;
			drawLives(true);
		}
		clearInterval(timerId);
		gameOver();
		scoreEl.innerText = "You lose ????";
	}
}

function changeDirection(defaultDirection = true) {
	// X: -2 ??t v??nster, 2 ??t h??ger
	// Y: -2 ner??t, 2 upp??t
	if (defaultDirection) {
		if (xDirection === 2 && yDirection === 2) {
			xDirection = -2;
			return;
		}
		if (xDirection === 2 && yDirection === -2) {
			xDirection = -2;
			return;
		}
		if (xDirection === -2 && yDirection === -2) {
			xDirection = 2;
			return;
		}
		if (xDirection === -2 && yDirection === 2) {
			xDirection = 2;
			return;
		}
	} else if (!defaultDirection) {
		if (xDirection === 2 && yDirection === 2) {
			yDirection = -2;
			return;
		}
		if (xDirection === 2 && yDirection === -2) {
			yDirection = 2;
			return;
		}
		if (xDirection === -2 && yDirection === -2) {
			yDirection = 2;
			return;
		}
		if (xDirection === -2 && yDirection === 2) {
			yDirection = -2;
			return;
		}
	}
}
