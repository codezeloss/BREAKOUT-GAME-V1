'use strict';

const grid = document.querySelector('.grid');
const startBtn = document.querySelector('#startBtn');
const scoreDisplay = document.querySelector('#score');

const blockWidth = 104;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 564;
const boardHight = 300;
let timerId;
let xDirection = -2;
let yDirection = 2;
let score = 0;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

// CLICK TO START
startBtn.addEventListener('click', startGame);

// START THE GAME
// Create block
function startGame() {
  startBtn.classList.add('hidden');
  scoreDisplay.classList.remove('hidden');

  class Block {
    constructor(xAxis, yAxis) {
      this.bottomLeft = [xAxis, yAxis];
      this.bottomRight = [xAxis + blockWidth, yAxis];
      this.topLeft = [xAxis, yAxis + blockHeight];
      this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
  }

  // All my blocks
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

  // Draw all my block
  const addBlock = () => {
    for (let i = 0; i < blocks.length; i++) {
      const block = document.createElement('div');
      block.classList.add('block');
      block.style.left = blocks[i].bottomLeft[0] + 'px';
      block.style.bottom = blocks[i].bottomLeft[1] + 'px';
      grid.appendChild(block);
    }
  };
  addBlock();

  // Draw  the user
  const drawUser = () => {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
  };
  // Draw the Ball
  const drawBall = () => {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
  };

  // Add user
  const user = document.createElement('div');
  user.classList.add('user');
  drawUser();
  grid.appendChild(user);

  // Move User
  const moveUser = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (currentPosition[0] > 0) {
          currentPosition[0] -= 20;
          drawUser();
        }
        break;
      case 'ArrowRight':
        if (currentPosition[0] < boardWidth - blockWidth) {
          currentPosition[0] += 20;
          drawUser();
        }
        break;
    }
  };

  document.addEventListener('keydown', moveUser);

  // Add ball
  const ball = document.createElement('div');
  ball.classList.add('ball');
  drawBall();
  grid.appendChild(ball);

  // Move ball
  const moveBall = () => {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
  };

  timerId = setInterval(moveBall, 20);

  // Check for collisions
  const checkForCollisions = () => {
    // Check for block collisions
    for (let i = 0; i < blocks.length; i++) {
      if (
        ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
        ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
        ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
        ballCurrentPosition[1] < blocks[i].topLeft[1]
      ) {
        const allBlocks = Array.from(document.querySelectorAll('.block'));
        allBlocks[i].classList.remove('block');
        blocks.splice(i, 1);
        changeDirection();
        score++;
        scoreDisplay.innerHTML = score;

        // Check for win
        if (blocks.length === 0) {
          scoreDisplay.innerHTML = 'YOU WIN!';
          clearInterval(timerId);
          document.removeEventListener('keydown', moveUser);
        }
      }
    }

    // Check for wall collisions
    if (
      ballCurrentPosition[0] >= boardWidth - ballDiameter ||
      ballCurrentPosition[1] >= boardHight - ballDiameter ||
      ballCurrentPosition[0] <= 0
    ) {
      changeDirection();
    }

    // Check for user collisions
    if (
      ballCurrentPosition[0] > currentPosition[0] &&
      ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
      ballCurrentPosition[1] > currentPosition[1] &&
      ballCurrentPosition[1] < currentPosition[1] + blockHeight
    ) {
      changeDirection();
    }

    // Check for game over
    if (ballCurrentPosition[1] <= 0) {
      clearInterval(timerId);
      scoreDisplay.innerHTML = 'You lose';
      document.removeEventListener('keydown', moveUser);
    }
  };

  const changeDirection = () => {
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
  };
}
