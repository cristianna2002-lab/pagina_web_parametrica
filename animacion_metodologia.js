document.addEventListener("DOMContentLoaded", function () {

    /* ------------------------------------------------
       RASGOS + PARÁMETRO ÚNICO POR CADA RASGO
    --------------------------------------------------- */
    const traits = [
        {
            name:"Cariño",
            meaning:"Vínculo afectivo cercano.",
            traitValue:0.66,
            paramName:"Color",
            paramValue:0.70
        },
        {
            name:"Empatía",
            meaning:"Sensibilidad ante el otro.",
            traitValue:0.74,
            paramName:"Ondulación",
            paramValue:0.55
        },
        {
            name:"Justicia",
            meaning:"Equilibrio ético y firmeza.",
            traitValue:0.65,
            paramName:"Nervaduras",
            paramValue:0.60
        },
        {
            name:"Creatividad",
            meaning:"Fluidez imaginativa.",
            traitValue:0.82,
            paramName:"Apertura / Perforación",
            paramValue:0.50
        },
        {
            name:"Resistencia",
            meaning:"Persistencia y fuerza colectiva.",
            traitValue:0.80,
            paramName:"Opacidad",
            paramValue:0.75
        }
    ];

    let index = 0;
    let barProgress = 0;

    /* PANEL UI (pueden no existir en metodología, por eso los verificamos) */
    const traitName    = document.getElementById("traitName");
    const traitMeaning = document.getElementById("traitMeaning");
    const traitValue   = document.getElementById("traitValue");

    const paramTitle   = document.getElementById("paramTitle");
    const paramValue   = document.getElementById("paramValue");
    const paramBar     = document.getElementById("paramBar");

    /* ------------------------------------------------
       CANVAS + MALLA  (ID ESPECÍFICO PARA METODOLOGÍA)
    --------------------------------------------------- */
    const canvas = document.getElementById("canvas_metodologia");
    if (!canvas) return;   // Si no hay canvas, no hace nada

    const ctx = canvas.getContext("2d");

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.onresize = ()=>{
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };

    const rows = 18;
    const cols = 28;

    /* ------------------------------------------------
       ACTUALIZAR RASGO CADA 5 SEGUNDOS
    --------------------------------------------------- */
    function updateTrait(){
        const t = traits[index];

        // Solo actualizamos texto si existen los elementos
        if (traitName)    traitName.textContent    = t.name;
        if (traitMeaning) traitMeaning.textContent = t.meaning;
        if (traitValue)   traitValue.textContent   = t.traitValue.toFixed(2);
        if (paramTitle)   paramTitle.textContent   = t.paramName;
        if (paramValue)   paramValue.textContent   = t.paramValue.toFixed(2);

        // Esto sí es clave para la animación
        barProgress = t.paramValue;

        index = (index+1) % traits.length;
        setTimeout(updateTrait, 5000);
    }
    updateTrait();

    /* ------------------------------------------------
       INTERPOLACIÓN
    --------------------------------------------------- */
    function lerp(a,b,t){ return a + (b-a)*t; }

    /* ------------------------------------------------
       DIBUJAR MALLA
    --------------------------------------------------- */
    function draw(time){
        requestAnimationFrame(draw);
        time *= 0.001;

        if (paramBar) {
            paramBar.style.width = (barProgress*100)+"%";
        }

        ctx.clearRect(0,0,W,H);

        const cx = W/2, cy = H/2;
        const baseX = W/(cols+2);
        const baseY = H/(rows+2);

        const param = barProgress;

        let points = [];

        const activeTrait = traits[(index+traits.length-1)%traits.length].paramName;

        for(let iy=0; iy<rows; iy++){
            for(let ix=0; ix<cols; ix++){

                let x = baseX*(ix+1);
                let y = baseY*(iy+1);

                /* ---- TRANSFORMACIONES ---- */

                if(activeTrait==="Color"){
                    // No modifica geometría, solo color abajo
                }

                if(activeTrait==="Ondulación"){
                    y += Math.sin(ix*0.5 + time*2) * param * 35;
                }

                if(activeTrait==="Nervaduras"){
                    y += Math.sin((ix+iy)*0.4 + time*2) * param * 20;
                }

                if(activeTrait==="Apertura / Perforación"){
                    if(Math.random() < param*0.06) continue;
                }

                if(activeTrait==="Opacidad"){
                    x = cx + (x-cx)*(1.2-param*0.4);
                    y = cy + (y-cy)*(1.2-param*0.4);
                }

                points.push({x,y});
            }
        }

        /* ---- PUNTOS (Color) ---- */
        let R=200,G=210,B=215;
        if(activeTrait==="Color"){
            R = lerp(200, 78, param);
            G = lerp(210,217, param);
            B = lerp(215,211, param);
        }

        for(const p of points){
            ctx.beginPath();
            ctx.fillStyle = `rgba(${R},${G},${B},0.75)`;
            ctx.arc(p.x,p.y,3,0,Math.PI*2);
            ctx.fill();
        }

        /* ---- NERVADURAS ---- */
        if(activeTrait==="Nervaduras"){
            ctx.lineWidth = 0.7;
            ctx.strokeStyle = `rgba(83,193,176,${0.1 + param*0.6})`;

            for(let i=0;i<points.length;i++){
                for(let j=i+1;j<points.length;j++){
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if(dist < 60 * param){
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    draw(0);
});

