/**Para Obtener el Canvas */
var canvas;
/**Contexto del Canvas */
var ctx;
/**Frames */
var fps = 50;
/**Tamaño de Fichas */
var anchoF = 50;
var altoF = 50;
/**Colores Elementos */
var muro = '#044f14'; //0
var puerta = '#3a1700'; //1
var llave = '#c6bc00'; //3
var tierra = '#914b04'; //2
/**Variable Global del Jugador */
var player;

/**Escenario */
var escenario = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0],
    [0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0],
    [0, 0, 2, 0, 0, 0, 2, 2, 0, 2, 2, 2, 2, 0, 0],
    [0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
    [0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0],
    [0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0],
    [0, 2, 2, 3, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

/**Dibujar Escenario */
function dibujaEscenario() {
    var color;
    for (y = 0; y < 10; y++) {
        for (x = 0; x < 15; x++) {
            if (escenario[y][x] == 0) { color = muro; }

            if (escenario[y][x] == 1) { color = puerta; }

            if (escenario[y][x] == 2) { color = tierra; }

            if (escenario[y][x] == 3) { color = llave; }
            /**Dibujamos el Contexto */
            ctx.fillStyle = color;
            ctx.fillRect(x * anchoF, y * altoF, anchoF, altoF);
        }

    }
}
/**Objeto Jugador */
var jugador = function() {
    /**Posición del Jugador */
    this.x = 1;
    this.y = 1;
    /**Color del Jugador */
    this.color = '#820c01';
    /**Variable para guardar la llave */
    this.llave = false;
    /**Dibujamos el Jugador */
    this.dibuja = function() {
            /**Dibujamos el Contexto en el Canvas */
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x * anchoF, this.y * altoF, anchoF, altoF);
        }
        /**Control de Los Margenes */
    this.margenes = function(x, y) {
            crash = false;
            /**Si es verde es decir arbustos esta fuera del camino */
            if (escenario[y][x] == 0) {
                crash = true;
            }
            /**Devolvemos True o False */
            return (crash);
        }
        /**Movimientos del Jugador */
    this.arriba = function() {
        /**Si es False se puede Mover */
        if (this.margenes(this.x, this.y - 1) == false) {
            this.y--;
            this.capturaObjeto();
        }
    }


    this.abajo = function() {
        /**Si es False se puede Mover */
        if (this.margenes(this.x, this.y + 1) == false) {
            this.y++;
            this.capturaObjeto();
        }
    }

    this.izquierda = function() {
        /**Si es False se puede Mover */
        if (this.margenes(this.x - 1, this.y) == false) {
            this.x--;
            this.capturaObjeto();
        }
    }

    this.derecha = function() {
            /**Si es False se puede Mover */
            if (this.margenes(this.x + 1, this.y) == false) {
                this.x++;
                this.capturaObjeto();
            }
        }
        /**Metodo para Terminar la Partida */
    this.wins = function() {
            console.log('Has ganado!');
            this.x = 1;
            this.y = 1;
            this.llave = false; //el jugador ya no tiene la llave
            escenario[8][3] = 3;
        }
        /**Metodo para Capturas los Objetos */
    this.capturaObjeto = function() {
        var objeto = escenario[this.y][this.x];
        /**Para ver si podemos salir la por la puerta si tiene llave */
        if (objeto == 1) {
            if (this.llave == true) {
                this.wins();
            } else {
                console.log('Te Falta la Llave No puedes Pasar');
            }
        }
        /**Para Capturar la LLave */
        if (objeto == 3) {
            this.llave = true;
            /**Volvemos a dejar el Laberinto es decir la tierra  */
            escenario[this.y][this.x] = 2;
        }
    }
}

/**Función de Arranque */
function initializer() {
    /**Obtenemos el Canvas */
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    /**Creamos el Jugador */
    player = new jugador();
    /**Capturamos la Tecla */
    document.addEventListener('keydown', function(tecla) {

        if (tecla.keyCode == 38) {
            player.arriba();
        }

        if (tecla.keyCode == 40) {
            player.abajo();
        }

        if (tecla.keyCode == 37) {
            player.izquierda();
        }

        if (tecla.keyCode == 39) {
            player.derecha();
        }

    });
    setInterval(function() {
        principal();
    }, 1000 / fps);
}

/**Para Limpiar el Canvas */
function borraCanvas() {
    canvas.width = 750;
    canvas.height = 500;
}
/**Función Principal */
function principal() {
    borraCanvas();
    dibujaEscenario();
    player.dibuja();
}