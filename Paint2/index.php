<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paint 2</title>

    <link rel="stylesheet" href="./css/style.css">
</head>
<body onresize="dimensionarCanvas()">
    <div id="contenedor-principal">
        <header>
            <img src="./img/logo.png" alt="logo" id="logo">
        </header>
        <main>
            <section>
                <canvas id="canvasDibujo" class="canvas" oncontextmenu="return false"></canvas>
            </section>
            <aside>
                <div id="pinceles">
                    <button class="btn-pincel">■</button>
                </div>
                <div id="grosor">

                </div>
                <div id="color">
                <input type="color" id="colorPicker">
                </div>
                <div id="menu">
                    <button id="limpiarCanvas">Limpiar lienzo</button>
                    <button id="guardar">Guardar</button>
                    <button id="compartir">Compartir</button>
                </div>
            </aside>
        </main>
        <footer>
            <button id="botonStop" style="background-color: gray; color: white; font-weight: bold; width: 10%; height: 100%;">STAHP</button>
            <button id="btnStart" style="background-color: green; color: white; font-weight: bold; width: 10%; height: 100%;">RESTART</button>
        </footer>
    </div>

    <script src="./js/clases.js"></script>
    <script src="./js/main.js"></script>
</body>
</html>