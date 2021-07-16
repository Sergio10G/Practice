console.log("Bienvenido a Paint2. ¡Mejor que la tuberculosis!");

// DECLARACIÓN E INICIALIZACIÓN DE VARIABLES
let btnStop = document.getElementById("botonStop");
let btnStart = document.getElementById("btnStart");

let btnPincelLinea = document.getElementById("pincelLinea");
let btnPincelCuadro = document.getElementById("pincelCuadro");
let btnPincelLineaCuadros = document.getElementById("pincelLineaCuadros");
let selectorGrosor = document.getElementById("selector_grosor");
let valorGrosor = document.getElementById("valor_grosor");
let colorPicker = document.getElementById("colorPicker");
let btnLimpiarCanvas = document.getElementById("limpiarCanvas");
let btnGuardar = document.getElementById("guardar");

let listaPinceles = [btnPincelLinea, btnPincelCuadro, btnPincelLineaCuadros];

let canvas;
let dibujo;
let triggerPintar = false;

dimensionarCanvas();


//  DECLARACIÓN DE OBJETOS

let posicionRaton = {
    mouseActivo  : false,
    x : 0,
    y : 0
};

let pincel = {
    color  : "#000000", 
    grosor : 5,
    forma  : "lineaHibrida",
    ultimaPosicion : {x: 0, y: 0},
    incrementarGrosor : (incremento) => {
        if (this.grosor + incremento >= 1 && this.grosor + incremento <= dibujo.height){
            this.grosor += incremento;
            return true;
        }    
        return false;
    }
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
    canvas = document.getElementById("canvas");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    dibujo = {
        canvas: canvas,
        ctx   : canvas.getContext('2d'),
        width : canvas.clientWidth,
        height: canvas.clientHeight
    }
}

function pintarConPincel(formaPincel){
    switch(formaPincel) {
        case "cuadro":
            dibujo.ctx.fillRect(posicionRaton.x - (pincel.grosor / 2), posicionRaton.y - (pincel.grosor / 2), pincel.grosor, pincel.grosor);
            break;
        
        case "linea":
            dibujo.ctx.beginPath();
            dibujo.ctx.moveTo(pincel.ultimaPosicion.x, pincel.ultimaPosicion.y);
            dibujo.ctx.lineTo(posicionRaton.x, posicionRaton.y);
            dibujo.ctx.stroke();
            break;
        
        case "lineaCuadros":
            dibujo.ctx.fillRect(pincel.ultimaPosicion.x, pincel.ultimaPosicion.y, Math.abs(pincel.ultimaPosicion.x - posicionRaton.x), Math.abs(pincel.ultimaPosicion.y - posicionRaton.y));
            break;
        
        case "lineaHibrida":
            let distanciaEntrePts = Math.sqrt(Math.pow(pincel.ultimaPosicion.x - posicionRaton.x, 2) + Math.pow(pincel.ultimaPosicion.y - posicionRaton.y, 2));
            if(distanciaEntrePts <= pincel.grosor / 2){
                pintarConPincel("cuadro");
                break;
            }
            pintarConPincel("linea");
            break;
    }
}

function deseleccionarPinceles(){
    listaPinceles.forEach(pincel => {
        pincel.classList.remove('btn-seleccionado');
    });
}

// CONTROL DE EVENTOS

/*
 *  CANVAS PRINCIPAL
*/

canvas.addEventListener("mouseover", (e) => {
    posicionRaton.mouseActivo = true;
});

canvas.addEventListener("mousemove", (e) => {
    let pos = getMousePos(canvas, e);
    posicionRaton.x = pos.x;
    posicionRaton.y = pos.y;
});

canvas.addEventListener("mousedown", (e) => {
    triggerPintar = true;
});

canvas.addEventListener("mouseup", (e) => {
    triggerPintar = false;
});

canvas.addEventListener("mouseout", (e) => {
    posicionRaton.mouseActivo = false;
    triggerPintar = false;
});


/*
 *  HERRAMIENTAS
*/

colorPicker.addEventListener("change", () => {
    //console.log("Color cambiado: " + colorPicker.value);
    pincel.color = colorPicker.value;
});

btnPincelLinea.addEventListener("click", () =>{
    pincel.forma = "lineaHibrida";

    deseleccionarPinceles();
    btnPincelLinea.classList.add('btn-seleccionado');
});

btnPincelCuadro.addEventListener("click", () =>{
    pincel.forma = "cuadro";

    deseleccionarPinceles();
    btnPincelCuadro.classList.add('btn-seleccionado');
});

btnPincelLineaCuadros.addEventListener("click", () =>{
    pincel.forma = "lineaCuadros";

    deseleccionarPinceles();
    btnPincelLineaCuadros.classList.add('btn-seleccionado');
});

selectorGrosor.addEventListener("change", () => {
    pincel.grosor = selectorGrosor.value;
    valorGrosor.innerText = selectorGrosor.value + "px";
});

btnLimpiarCanvas.addEventListener("click", () => {
    limpiarCanvas();
});

btnGuardar.addEventListener("click", () => {
    let confirmacionGuardar = window.confirm("¿Estás seguro de que quieres guardar el dibujo? Esto podría hacer que el dibujo de la página se borrase.");
    if(confirmacionGuardar){
        let nombreDef = "dibujo" + (new Date()).getTime() + ".png"; 
        let nombre = window.prompt("Introduce un nombre para el dibujo. Si no introduces ningún nombre, se guardará como " + nombreDef);
    }
});

/*
 *  OTRAS COSAS 
*/

btnStop.addEventListener("click", () => {
    if(ejecutandose){
        ejecutandose = false;
    
        btnStop.style.backgroundColor = "red";
        btnStart.style.backgroundColor = "gray";

        msg = "La aplicación se ha pausado.";
        window.alert(msg);
    }
});

btnStart.addEventListener("click", () => {
    if(!ejecutandose){
        ejecutandose = true;
        
        btnStop.style.backgroundColor = "gray";
        btnStart.style.backgroundColor = "green";

        msg = "La aplicación ha reanudado su ejecución .";
        window.alert(msg);
        
        requestAnimationFrame(loop);
    }
});


// Loop principal

function draw(progress){
    if(triggerPintar){
        
        dibujo.ctx.fillStyle = pincel.color;
        dibujo.ctx.strokeStyle = pincel.color;
        dibujo.ctx.lineWidth = pincel.grosor;
        
        pintarConPincel(pincel.forma);
    }
    pincel.ultimaPosicion = {x: posicionRaton.x, y: posicionRaton.y};
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
        draw(progress);
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