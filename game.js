const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 15;
const paddleHeight = 100;
const ballRadius = 10;

// Score variables
let leftScore = 0;
let rightScore = 0;

const leftPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#4CAF50"
};

const rightPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#F44336"
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 6,
    dx: 6 * (Math.random() > 0.5 ? 1 : -1),
    dy: 4 * (Math.random() > 0.5 ? 1 : -1),
    color: "#FFD600"
};

let animationId;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    
    // Draw left score (top left)
    ctx.fillText(leftScore.toString(), canvas.width / 4, 50);
    
    // Draw right score (top right)
    ctx.fillText(rightScore.toString(), 3 * canvas.width / 4, 50);
}

function drawCenterLine() {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#222");
    // Draw center line
    drawCenterLine();
    // Draw paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.color);
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.color);
    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    // Draw scores
    drawScore();
}

// Mouse control for left paddle
canvas.addEventListener("mousemove", function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp within canvas
    leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - leftPaddle.height), 0);
});

// AI for right paddle
function moveAIPaddle() {
    let center = rightPaddle.y + rightPaddle.height / 2;
    if (ball.y < center - 10) {
        rightPaddle.y -= 5;
    } else if (ball.y > center + 10) {
        rightPaddle.y += 5;
    }
    // Clamp within canvas
    rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - rightPaddle.height), 0);
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Launch in random direction
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Collision detection
function collide(paddle) {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height
    );
}

// Update game objects
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }

    // Left paddle collision
    if (collide(leftPaddle) && ball.dx < 0) {
        ball.dx *= -1;
        // Add some "spin" based on where it hit the paddle
        let collidePoint = (ball.y - (leftPaddle.y + leftPaddle.height/2)) / (leftPaddle.height/2);
        ball.dy = ball.speed * collidePoint;
    }

    // Right paddle collision
    if (collide(rightPaddle) && ball.dx > 0) {
        ball.dx *= -1;
        let collidePoint = (ball.y - (rightPaddle.y + rightPaddle.height/2)) / (rightPaddle.height/2);
        ball.dy = ball.speed * collidePoint;
    }

    // Score
    if (ball.x - ball.radius < 0) {
        rightScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        leftScore++;
        resetBall();
    }

    // Move AI paddle
    moveAIPaddle();
}

// Main game loop
function gameLoop() {
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();