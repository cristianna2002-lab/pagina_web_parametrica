//---------------------------------------------
// Canvas
//---------------------------------------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const glow = document.getElementById("cursorGlow");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

//---------------------------------------------
// Configuración
//---------------------------------------------
const NUM_POINTS = 500;
const NUM_SEEDS  = 5;
const BRANCH_DURATION = 5000;

const ATTRACTOR_FORCE = 1.6;
const RANDOM_FORCE    = 0.08;
const DAMPING         = 0.92;

const MAX_SEGMENT_DIST        = 180;
const MAX_SEGMENTS_PER_BRANCH = 22;
const BRANCH_GROW_PROB        = 0.65;
const BRANCH_FORK_PROB        = 0.18;

//---------------------------------------------
// Puntos
//---------------------------------------------
const points = [];
for (let i = 0; i < NUM_POINTS; i++) {
    points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.5 + 0.8
    });
}

//---------------------------------------------
// Mouse atractor
//---------------------------------------------
const mouse = { x: w / 2, y: h / 2 };

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    glow.style.left = mouse.x + "px";
    glow.style.top = mouse.y + "px";
});

//---------------------------------------------
// Sistema emergente
//---------------------------------------------
let branches = [];

function generateNewSystem() {
    branches = [];

    const seeds = [];
    for (let i = 0; i < NUM_SEEDS; i++) {
        seeds.push(Math.floor(Math.random() * NUM_POINTS));
    }

    for (let seed of seeds) {
        branches.push({
            segments: [seed],
            age: 0
        });
    }
}

function growBranches(deltaTime) {
    for (let branch of branches) {
        branch.age += deltaTime;
        if (branch.age > BRANCH_DURATION) continue;

        const growthSteps = 3;
        for (let s = 0; s < growthSteps; s++) {
            if (Math.random() > BRANCH_GROW_PROB) continue;
            if (branch.segments.length >= MAX_SEGMENTS_PER_BRANCH) break;

            const lastIndex = branch.segments[branch.segments.length - 1];
            const lastPoint = points[lastIndex];

            const candidateIndex = Math.floor(Math.random() * NUM_POINTS);
            if (candidateIndex === lastIndex) continue;

            const candPoint = points[candidateIndex];
            const dx = candPoint.x - lastPoint.x;
            const dy = candPoint.y - lastPoint.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < MAX_SEGMENT_DIST) {
                branch.segments.push(candidateIndex);

                if (Math.random() < BRANCH_FORK_PROB && branch.segments.length > 3) {
                    const fork = {
                        segments: branch.segments.slice(0, branch.segments.length - 1),
                        age: branch.age
                    };
                    branches.push(fork);
                }
            }
        }
    }
}

//---------------------------------------------
// Dibujar ramas
//---------------------------------------------
function drawBranches() {
    for (let branch of branches) {
        const seg = branch.segments;
        if (seg.length < 2) continue;

        for (let i = 0; i < seg.length - 1; i++) {
            const p1 = points[seg[i]];
            const p2 = points[seg[i + 1]];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const alpha = Math.max(0, 1 - dist / 220);

            ctx.strokeStyle = `rgba(83,193,176,${alpha})`;
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    }
}

//---------------------------------------------
// Movimiento
//---------------------------------------------
function movePoints() {
    for (let p of points) {
        p.vx += (Math.random() - 0.5) * RANDOM_FORCE;
        p.vy += (Math.random() - 0.5) * RANDOM_FORCE;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy) + 0.1;
        const force = ATTRACTOR_FORCE / dist;

        p.vx += (dx / dist) * force * 1.5;
        p.vy += (dy / dist) * force * 1.5;

        p.vx *= DAMPING;
        p.vy *= DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
    }
}

//---------------------------------------------
// Dibujar puntos
//---------------------------------------------
function drawPoints() {
    ctx.fillStyle = "#4ED9D3";
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

//---------------------------------------------
// Loop principal
//---------------------------------------------
let lastTime = 0;

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, w, h);

    growBranches(deltaTime);
    drawBranches();
    movePoints();
    drawPoints();

    requestAnimationFrame(loop);
}

generateNewSystem();
setInterval(generateNewSystem, BRANCH_DURATION);

requestAnimationFrame(loop);
