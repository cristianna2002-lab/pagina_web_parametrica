// ------------------ Canvas ------------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

// Color base
const baseColor = (a)=>`rgba(78,217,211,${a})`;

// ----------- FUNCIÓN HUELLA -----------
function drawPaw(x, y, size, alpha){
    ctx.fillStyle = baseColor(alpha);

    const bigR = size * 0.65;
    const toeR = bigR * 0.38;
    const separation = bigR * 0.42;      
    const arcRadius = bigR + separation;

    const start = -Math.PI * 0.78;
    const end   = -Math.PI * 0.22;
    const step  = (end - start) / 3;

    // Almohadilla
    ctx.beginPath();
    ctx.arc(x, y, bigR, 0, Math.PI*2);
    ctx.fill();

    // Dedos
    for(let i=0;i<4;i++){
        const ang = start + step*i;
        const dx = Math.cos(ang) * arcRadius;
        const dy = Math.sin(ang) * arcRadius;

        ctx.beginPath();
        ctx.arc(x+dx, y+dy, toeR, 0, Math.PI*2);
        ctx.fill();
    }
}

// ------------------ Clase Huella ------------------
class PawStep {
  constructor(){
    this.reset();
  }

  reset(){
    this.x = Math.random() * W;
    this.y = Math.random() * H;

    const ang = Math.random()*Math.PI*2;
    this.vx = Math.cos(ang) * (0.5 + Math.random()*1.3);
    this.vy = Math.sin(ang) * (0.5 + Math.random()*1.3);

    this.size = Math.random() < 0.5 ? 26 + Math.random()*7 : 38 + Math.random()*12;

    this.life = 0;
    this.maxLife = 160 + Math.random()*140;
    this.alpha = 0;
  }

  update(){
    this.life++;
    this.x += this.vx;
    this.y += this.vy;

    if(this.x < -50 || this.x > W+50 || this.y < -50 || this.y > H+50){
      this.reset();
      return;
    }

    if(this.life < 25){
      this.alpha = this.life / 25;
    } else if(this.life > this.maxLife - 40){
      this.alpha = (this.maxLife - this.life) / 40;
    } else {
      this.alpha = 1;
    }

    if(this.life >= this.maxLife){
      this.reset();
    }
  }

  draw(){
    if(this.alpha <= 0) return;
    drawPaw(this.x, this.y, this.size, this.alpha);
  }
}

// Crear huellas
const paws = [];
for(let i=0;i<20;i++){
  paws.push(new PawStep());
}

// ------------------ Loop ------------------
function loop(){
  requestAnimationFrame(loop);
  ctx.clearRect(0,0,W,H);

  paws.forEach(p=>{
    p.update();
    p.draw();
  });
}

loop();
