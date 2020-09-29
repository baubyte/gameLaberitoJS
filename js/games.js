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
/**Variable Global tileMap */
var tileMap;
/**Enemigos */
var enemigo = [];
/**Antorchas */
var imgAntorcha = [];
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
            var tile = escenario[y][x];
            /**Dibujamos el Contexto */
            ctx.drawImage(tileMap, tile * 32, 0, 32, 32, anchoF * x, altoF * y, anchoF, altoF);

        }

    }
}
/**Objeto Enemigo */
var bad = function(x, y) {
        this.x = x;
        this.y = y;
        /**Direccion */
        this.direccion = Math.floor(Math.random() * 4);
        /**Retraso de 50 fotograma 1 vez  por segundo */
        this.retraso = 50;
        this.fotograma = 0;
        /**Dibujamos el Enemigo */
        this.dibuja = function() {
                ctx.drawImage(tileMap, 0, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
            }
            /**Cumprueba crash */
        this.compruebaCrash = function(x, y) {
                var crash = false;
                if (escenario[y][x] == 0) {
                    crash = true;
                }
                return crash;
            }
            /**Mueve los Enemigos */
        this.mueve = function() {
            player.crashEnemigo(this.x, this.y);
            if (this.contador < this.retraso) {
                this.contador++;
            } else {
                this.contador = 0;
                /**Arriba */
                if (this.direccion == 0) {
                    if (this.compruebaCrash(this.x, this.y - 1) == false) {
                        this.y--;
                    } else {
                        this.direccion = Math.floor(Math.random() * 4);
                    }
                }
                /**Abajo */
                if (this.direccion == 1) {
                    if (this.compruebaCrash(this.x, this.y + 1) == false) {
                        this.y++;
                    } else {
                        this.direccion = Math.floor(Math.random() * 4);
                    }
                }
                /**Izquierda */
                if (this.direccion == 2) {
                    if (this.compruebaCrash(this.x - 1, this.y) == false) {
                        this.x--;
                    } else {
                        this.direccion = Math.floor(Math.random() * 4);
                    }
                }
                /**Derecha */
                if (this.direccion == 3) {
                    if (this.compruebaCrash(this.x + 1, this.y) == false) {
                        this.x++;
                    } else {
                        this.direccion = Math.floor(Math.random() * 4);
                    }
                }
            }
        }
    }
    /**Objeto Antorcha */
var antorcha = function(x, y) {
        this.x = x;
        this.y = y;

        this.retraso = 10;
        this.contador = 0;
        this.fotograma = 0; //0-3


        this.cambiaFotograma = function() {
            if (this.fotograma < 3) {
                this.fotograma++;
            } else {
                this.fotograma = 0;
            }

        }


        this.dibuja = function() {

            if (this.contador < this.retraso) {
                this.contador++;
            } else {
                this.contador = 0;
                this.cambiaFotograma();
            }

            ctx.drawImage(tileMap, this.fotograma * 32, 64, 32, 32, anchoF * x, altoF * y, anchoF, altoF);
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
            ctx.drawImage(tileMap, 32, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
        }
        /**Cumprueba crash con enemigo */
    this.crashEnemigo = function(x, y) {
            if (this.x == x && this.y == y) {
                player.dead();

            }
        }
        /**Control de Los Margenes */
    this.margenes = function(x, y) {
            crash = false;
            /**Si es verde es decir arbustos esta fuera del camino */
            if (escenario[y][x] == 0) {
                crash = true;
            }
            /**Devolvemos True o False */
            return crash;
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
        /**Metodo para Terminar la Partida al Morir */
    this.dead = function() {
            console.log('Moriste!');
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
    /**Creamos la Antorcha */
    imgAntorcha.push(new antorcha(0, 0));
    imgAntorcha.push(new antorcha(0, 9));
    imgAntorcha.push(new antorcha(14, 0));
    imgAntorcha.push(new antorcha(14, 9));
    /**Creamos el Jugador */
    player = new jugador();
    /**Creamos los Enemigo */
    enemigo.push(new bad(3, 3));
    enemigo.push(new bad(5, 7));
    enemigo.push(new bad(7, 7));
    /**Creamos el tileMap */
    tileMap = new Image();
    /**Ruta de la Imagen*/
    tileMap.src = 'img/tilemap.png';
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
    /**Dibujamos las Antorchas */
    for (index = 0; index < imgAntorcha.length; index++) {
        imgAntorcha[index].dibuja();

    }
    /**Dibujamos los Enemigos */
    for (index = 0; index < enemigo.length; index++) {
        enemigo[index].mueve();
        enemigo[index].dibuja();

    }
}