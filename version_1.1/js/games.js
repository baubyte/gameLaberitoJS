/**Para Obtener el Canvas */
var canvas;
/**Contexto del Canvas */
var ctx;
/**Frames */
var fps = 50;
/**Tamaño de Fichas */
var anchoF = 50;
var altoF = 50;

var cesped = '#03fc56';
var agua = '#03e8fc';
var tierra = '#914b04';
/**Escenario */
var escenario = [
    [0, 1, 0, 0, 2],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 2, 2, 2, 2],
    [2, 2, 2, 0, 0]
];

/**Dibujar Escenario */
function dibujaEscenario() {
    var color;
    for (y = 0; y < 5; y++) {
        for (x = 0; x < 5; x++) {
            if (escenario[y][x] == 0) {
                color = cesped;
            }
            if (escenario[y][x] == 1) {
                color = agua;
            }
            if (escenario[y][x] == 2) {
                color = tierra;
            }
            ctx.fillStyle = color;
            ctx.fillRect(x * anchoF, y * altoF, anchoF, altoF);
        }

    }
}
/**Función de Arranque */
function initializer() {
    /**Obtenemos el Canvas */
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    setInterval(function() {
        principal();

    }, 1000 / fps);
}

/**Para Limpiar el Canvas */
function borraCanvas() {
    canvas.width = 500;
    canvas.height = 500;
}
/**Función Principal */
function principal() {
    borraCanvas();
    dibujaEscenario();
}