const GRID = 10;
let score = 0;

const CONTAINER_WIDTH = 64 * GRID;
const CONTAINER_HEIGHT = 32 * GRID;
const OBSTACLE_WIDTH = 1 * GRID;
const BIRD_HEIGHT = 1 * GRID;
const GAP_HEIGHT = 8 * GRID;
const GAP_MIN_POS = 1;
const GAP_MAX_POS = (CONTAINER_HEIGHT - GAP_HEIGHT - GRID) / GRID;
const OBSTACLES_INTERVAL = 2000;
const COLLISION_POINT = 100;

const LOWER_LIMIT = 0;
const JUMP_STEPS = [-50, -60, -65];
const TIME_FRAME = 80;

let container, bird;
let isJumping = false;

window.onload = () => {
  container = document.getElementById('container');
  bird = document.getElementById('bird');
  fall();
  setInterval(createObstacle, OBSTACLES_INTERVAL);

  document.addEventListener('click', (event) => {
    jump();
  });
}

function fall() {
  const interval = setInterval(() => {
    if (!isJumping) {
      let top = pixelsToNumber(bird.style.top);
      let t = top + 10;
      if (t <= CONTAINER_HEIGHT - BIRD_HEIGHT) {
        bird.style.top = t + 'px';
      }
    }
  }, TIME_FRAME);
}

function jump() {
  isJumping = true;
  let n = pixelsToNumber(bird.style.top);
  let i = 1;
  for (const pos of JUMP_STEPS) {
    setTimeout(() => {
      let t = n + pos;
      t = t >= LOWER_LIMIT ? t : LOWER_LIMIT;
      bird.style.top = t + 'px';
      if (pos === JUMP_STEPS.at(-1)) {
        isJumping = false;
      }
    }, i * TIME_FRAME);
    i++;
  }
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = CONTAINER_WIDTH - OBSTACLE_WIDTH + 'px';
  obstacle.style.width = OBSTACLE_WIDTH + 'px';

  const gap = document.createElement('div');
  gap.classList.add('gap');
  gap.style.width = OBSTACLE_WIDTH + 'px';
  gap.style.height = GAP_HEIGHT + 'px';
  const marginTop = generateGapPosition(GAP_MIN_POS, GAP_MAX_POS);
  gap.style.marginTop = marginTop + 'px';

  obstacle.append(gap);
  container.append(obstacle);

  let left = pixelsToNumber(obstacle.style.left) - GRID;
  const interval = setInterval(() => {
    if (left >= 0) {
      detectCollision(left, obstacle, gap);
      obstacle.style.left = left + 'px';
      left -= GRID;
    } else {
      clearInterval(interval);
      obstacle.remove();
    }
  }, TIME_FRAME)
}

function detectCollision(pos, obstacle, gap) {
  if (pos === COLLISION_POINT) {
    let birdPosition = pixelsToNumber(bird.style.top);
    let gapUpperLimit = pixelsToNumber(gap.style.marginTop);
    let gapLowerLimit = gapUpperLimit + GAP_HEIGHT;
    if (!(birdPosition > gapUpperLimit && birdPosition < gapLowerLimit)) {
      score--;
    } else {
      score++;
    }
    document.getElementById('score').textContent = score + '';
    obstacle.style.backgroundColor = 'grey';
  }
}

function generateGapPosition(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min) * GRID;
}

function pixelsToNumber(px) {
  return +px.replace('px', '');
}
