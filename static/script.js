const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

let running = false;
let manualMode = false;

/////////////////////////////////////////////////////
// 🌌 SPACE BACKGROUND
/////////////////////////////////////////////////////

const starCanvas = document.createElement("canvas");
const starCtx = starCanvas.getContext("2d");

document.body.appendChild(starCanvas);

starCanvas.style.position = "fixed";
starCanvas.style.top = "0";
starCanvas.style.left = "0";
starCanvas.style.zIndex = "-1";

function resizeStars() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeStars();
window.addEventListener("resize", resizeStars);

let stars = [];
for (let i = 0; i < 120; i++) {
    stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        r: Math.random() * 2
    });
}

function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    starCtx.fillStyle = "white";

    stars.forEach(s => {
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        starCtx.fill();

        s.y += 0.4;
        if (s.y > starCanvas.height) s.y = 0;
    });

    requestAnimationFrame(drawStars);
}
drawStars();

/////////////////////////////////////////////////////
// 🎮 DRAW
/////////////////////////////////////////////////////

function draw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let cartX = canvas.width / 2 + state[0] * 200;
    let angle = state[2];

    // Road
    let gradient = ctx.createLinearGradient(0, 300, 0, 340);
    gradient.addColorStop(0, "#4b5563");
    gradient.addColorStop(1, "#1f2937");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 300, canvas.width, 20);

    ctx.strokeStyle = "white";
    ctx.setLineDash([15, 10]);
    ctx.beginPath();
    ctx.moveTo(0, 310);
    ctx.lineTo(canvas.width, 310);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cart
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.roundRect(cartX - 40, 260, 80, 35, 8);
    ctx.fill();

    // Wheels
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(cartX - 25, 300, 10, 0, Math.PI * 2);
    ctx.arc(cartX + 25, 300, 10, 0, Math.PI * 2);
    ctx.fill();

    // Pole
    ctx.beginPath();
    ctx.moveTo(cartX, 260);
    ctx.lineTo(
        cartX + Math.sin(angle) * 160,
        260 - Math.cos(angle) * 160
    );
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(cartX, 260, 5, 0, Math.PI * 2);
    ctx.fill();
}

/////////////////////////////////////////////////////
// INIT
/////////////////////////////////////////////////////

async function init() {
    let res = await fetch("/reset");
    let data = await res.json();
    draw(data.state);
}
init();

/////////////////////////////////////////////////////
// 🤖 AI LOOP
/////////////////////////////////////////////////////

async function aiLoop() {
    if (!running) return;

    let res = await fetch("/step");
    let data = await res.json();

    draw(data.state);
    scoreText.innerText = "Score: " + data.score;

    updateGraph();

    if (!data.done) {
        requestAnimationFrame(aiLoop);
    } else {
        running = false;
        showGameOver(data.score);
    }
}

function startAI() {
    running = true;
    manualMode = false;
    aiLoop();
}

/////////////////////////////////////////////////////
// 🎮 MANUAL MODE
/////////////////////////////////////////////////////

function enableManual() {
    running = false;
    manualMode = true;
}

// Shared move
async function move(action) {
    let res = await fetch("/manual/" + action);
    let data = await res.json();

    draw(data.state);
    scoreText.innerText = "Score: " + data.score;

    if (data.done) showGameOver(data.score);
}

// Keyboard
document.addEventListener("keydown", (e) => {
    if (!manualMode) return;

    if (e.key === "ArrowLeft") move(0);
    if (e.key === "ArrowRight") move(1);
});

/////////////////////////////////////////////////////
// 📱 TOUCH BUTTONS
/////////////////////////////////////////////////////

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

if (leftBtn && rightBtn) {
    leftBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        manualMode = true;
        move(0);
    });

    rightBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        manualMode = true;
        move(1);
    });
}

/////////////////////////////////////////////////////
// 📱 SWIPE CONTROL
/////////////////////////////////////////////////////

let startX = 0;

canvas.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

canvas.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;

    if (Math.abs(endX - startX) > 30) {
        manualMode = true;

        if (endX < startX) move(0);
        else move(1);
    }
});

/////////////////////////////////////////////////////
// 🕹️ JOYSTICK CONTROL
/////////////////////////////////////////////////////

const joystick = document.getElementById("joystick");
const container = document.getElementById("joystickContainer");

if (joystick && container) {

    let dragging = false;

    joystick.addEventListener("touchstart", (e) => {
        dragging = true;
        manualMode = true;
        e.preventDefault();
    });

    document.addEventListener("touchmove", (e) => {
        if (!dragging) return;

        let rect = container.getBoundingClientRect();
        let x = e.touches[0].clientX - rect.left;

        let center = rect.width / 2;
        let offset = x - center;

        offset = Math.max(-30, Math.min(30, offset));

        joystick.style.left = (35 + offset) + "px";

        if (offset < -10) move(0);
        else if (offset > 10) move(1);
    });

    document.addEventListener("touchend", () => {
        dragging = false;
        joystick.style.left = "35px";
    });
}

/////////////////////////////////////////////////////
// RESET
/////////////////////////////////////////////////////

async function resetEnv() {
    let res = await fetch("/reset");
    let data = await res.json();

    draw(data.state);
    scoreText.innerText = "Score: 0";

    document.getElementById("gameOverScreen").style.display = "none";
}

/////////////////////////////////////////////////////
// 🎯 GAME OVER (FIXED CENTER)
/////////////////////////////////////////////////////

function showGameOver(score) {
    const screen = document.getElementById("gameOverScreen");

    screen.style.display = "flex"; // ✅ center fix
    document.getElementById("finalScore").innerText = "Score: " + score;
}

/////////////////////////////////////////////////////
// 📊 GRAPH
/////////////////////////////////////////////////////

let graphVisible = false;
let chart;

function toggleGraph() {
    const container = document.getElementById("graphContainer");
    graphVisible = !graphVisible;
    container.style.display = graphVisible ? "block" : "none";
}

window.onload = () => {
    const ctxChart = document.getElementById("chart").getContext("2d");

    chart = new Chart(ctxChart, {
        type: "line",
        data: {
            labels: [],
            datasets: []
        }
    });
};

async function updateGraph() {
    if (!chart) return;

    let res = await fetch("/stats");
    let data = await res.json();

    let scores = data.scores;

    let avg = [];
    for (let i = 0; i < scores.length; i++) {
        let slice = scores.slice(Math.max(0, i - 5), i + 1);
        avg.push(slice.reduce((a, b) => a + b) / slice.length);
    }

    chart.data.labels = scores.map((_, i) => i + 1);

    chart.data.datasets = [
        { label: "Score", data: scores, borderColor: "cyan" },
        { label: "Avg Score", data: avg, borderColor: "orange" }
    ];

    chart.update();
}