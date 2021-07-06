console.log("JS funciona");

// DECLARACIÓN E INICIALIZACIÓN DE VARIABLES

let btnLimpiarCanvas = document.getElementById("limpiarCanvas");
let colorPicker = document.getElementById("colorPicker");

let canvasDibujo;
let dibujo;
let pintar = false;

dimensionarCanvas();

let posicionRaton = {
    mouseActivo  : false,
    x : 0,
    y : 0
};

let pincel = {
    color  : "#000000",
    grosor : 10,
    forma  : "linea",
    incrementarGrosor : (incremento) => {
        if (this.grosor + incremento >= 1 && this.grosor + incremento <= dibujo.height){
            this.grosor += incremento;
            return true;
        }    
        return false;
    },
    ultimaPosicion : {x: 0, y: 0}
}

// MÉTODOS

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function limpiarCanvas(){
    dibujo.ctx.fillStyle = "white";
    dibujo.ctx.fillRect(0, 0, dibujo.width, dibujo.height);
}

function dimensionarCanvas(){
    canvasDibujo = document.getElementById("canvasDibujo");

    canvasDibujo.width = canvasDibujo.clientWidth;
    canvasDibujo.height = canvasDibujo.clientHeight;

    dibujo = {
        canvas: canvasDibujo,
        ctx   : canvasDibujo.getContext('2d'),
        width : canvasDibujo.clientWidth,
        height: canvasDibujo.clientHeight
    }
}

// CONTROL DE EVENTOS

/*
 *  CANVAS PRINCIPAL
*/

canvasDibujo.addEventListener("mouseover", (e) => {
    posicionRaton.mouseActivo = true;
});

canvasDibujo.addEventListener("mousemove", (e) => {
    posicionRaton.dibujo = getMousePos(canvasDibujo, e);
});

canvasDibujo.addEventListener("mousedown", (e) => {
    pintar = true;
});

canvasDibujo.addEventListener("mouseup", (e) => {
    pintar = false;
});

canvasDibujo.addEventListener("mouseout", (e) => {
    posicionRaton.mouseActivo = false;
    pintar = false;
});


/*
 *  HERRAMIENTAS
*/

btnLimpiarCanvas.addEventListener("click", () => {
    limpiarCanvas();
});

colorPicker.addEventListener("change", () => {
    //console.log("Color cambiado: " + colorPicker.value);
    pincel.color = colorPicker.value;
});


/*
 *  OTRAS COSAS 
*/

document.getElementById("botonStop").addEventListener("click", () => {
    if(ejecutandose){
        ejecutandose = false;
    
        document.getElementById("botonStop").style.backgroundColor = "red";
        document.getElementById("btnStart").style.backgroundColor = "gray";

        msg = "La aplicación se ha pausado.";
        window.alert(msg);
    }
});

document.getElementById("btnStart").addEventListener("click", () => {
    if(!ejecutandose){
        ejecutandose = true;
        
        document.getElementById("botonStop").style.backgroundColor = "gray";
        document.getElementById("btnStart").style.backgroundColor = "green";

        msg = "La aplicación ha reanudado su ejecución .";
        window.alert(msg);
        
        requestAnimationFrame(loop);
    }
});


// Loop principal

/*
function update(progress){

}
*/  

function draw(progress){
    if(pintar){
        dibujo.ctx.fillStyle = pincel.color;
        
        switch(pincel.forma) {
            case "cuadro":
                dibujo.ctx.fillRect(posicionRaton.dibujo.x - (pincel.grosor / 2), posicionRaton.dibujo.y - (pincel.grosor / 2), pincel.grosor, pincel.grosor);
                break;
            
            case "linea":
                dibujo.ctx.fillRect(pincel.ultimaPosicion.x, pincel.ultimaPosicion.y, Math.abs(pincel.ultimaPosicion.x - posicionRaton.x), Math.abs(pincel.ultimaPosicion.y - posicionRaton.y));
                pincel.ultimaPosicion = {x: posicionRaton.x, y: posicionRaton.y};
                break;
        }
    }
    
}

function loop(timestamp){
    let progress = timestamp - lastRender;

    // pintar fps
    timerFps += progress;
    fps++;

    if(timerFps > 1000){
        console.log("FPS: " + Math.round((fps * (1000 / timerFps)) * 100) / 100);
        timerFps = 0;
        fps = 0;
    }

    if(posicionRaton.mouseActivo){
        //update(progress);
        draw();
    }

    lastRender = timestamp;
    if(ejecutandose){
        window.requestAnimationFrame(loop);
    }
}

let ejecutandose = true;
let lastRender = 0; 
let timerFps = 0;
let fps = 0;
limpiarCanvas();
window.requestAnimationFrame(loop);