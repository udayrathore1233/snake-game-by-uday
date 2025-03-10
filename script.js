const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const scoreBoard = document.getElementById("scoreBoard");
const scoreDisplay = document.getElementById("score");

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval;
let speed = 150;
const speedDecrease = 10;
const minSpeed = 50;
const boxSize = 20;
let gameRunning = false;

// Set canvas size dynamically
function setCanvasSize() {
    canvas.width = Math.min(window.innerWidth - 20, 400);
    canvas.height = Math.min(window.innerWidth - 20, 400);
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

// Generate food
function generateFood() {
    let maxSize = Math.floor(canvas.width / boxSize);
    food.x = Math.floor(Math.random() * maxSize) * boxSize;
    food.y = Math.floor(Math.random() * maxSize) * boxSize;
}
generateFood();

// Keyboard input
document.addEventListener("keydown", (event) => {
    if (!gameRunning) return;
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Swipe touch controls
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", (e) => {
    if (!gameRunning) return;

    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30 && direction !== "LEFT") direction = "RIGHT"; // Swipe right
        if (diffX < -30 && direction !== "RIGHT") direction = "LEFT"; // Swipe left
    } else {
        if (diffY > 30 && direction !== "UP") direction = "DOWN"; // Swipe down
        if (diffY < -30 && direction !== "DOWN") direction = "UP"; // Swipe up
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
});

// Start game
function startGame() {
    menu.style.display = "none";
    canvas.style.display = "block";
    scoreBoard.style.display = "block";

    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    speed = 150;
    scoreDisplay.innerText = score;
    gameRunning = true;

    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

// Update game
function updateGame() {
    let head = { ...snake[0] };
    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        endGame();
        return;
    }

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.innerText = score;
        generateFood();
        if (score % 5 === 0 && speed > minSpeed) {
            speed -= speedDecrease;
            restartGameLoop();
        }
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// Draw game
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + 10, food.y + 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "lime";
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    }
}

// Game loop
function gameLoop() {
    updateGame();
    drawGame();
}

// Restart game loop with new speed
function restartGameLoop() {
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

// End game
function endGame() {
    clearInterval(gameInterval);
    alert("Game Over! Your Score: " + score);
    gameRunning = false;
    menu.style.display = "block";
    canvas.style.display = "none";
    scoreBoard.style.display = "none";
}
document.getElementById("udayBtn").addEventListener("click", function() {
    document.getElementById("udayMessage").style.display = "block";
});
// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load 3D Snake Model
const loader = new THREE.GLTFLoader();
loader.load('snake_model.glb', function(gltf) {
    const snake = gltf.scene;
    snake.scale.set(1, 1, 1); // Adjust size
    snake.position.set(0, 0, 0); // Adjust position
    scene.add(snake);
});

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Camera position
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
