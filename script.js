// Obtenemos los elementos HTML
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

// Configuración global
const boardSize = 10;
const gameSpeed = 125; // Aumenta el valor para disminuir la velocidad
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

// Variables del juego
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

// Funciones generales

// Función que permite pintar un cuadrado, recibe como parametro la posición del cuadrado y su tipo
function drawSquare(square, type) {
    const [row, column] = square.split("");
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute("class", `square ${type}`);

    if (type === "emptySquare") {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

// Función que se llama en cada intervalo
function moveSnake() {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]
    ).padStart(2, "0");
    const [row, column] = newSquare.split("");

    if (
        newSquare < 0 ||
        newSquare > boardSize * boardSize ||
        (direction === "ArrowRight" && column == 0) ||
        (direction === "ArrowLeft" && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare
    ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, "emptySquare");
        }
        drawSnake();
    }
}

// Función para añadir comida
function addFood() {
    score++;
    updateScore();
    createRandomFood();
}

// Función que se llama cuando el juego se termina
function gameOver() {
    gameOverSign.style.display = "flex";
    clearInterval(moveInterval);
    startButton.style.display = "inline-block";
}

// Función que cambia la dirección a la proporcionada
function setDirection(newDirection) {
    direction = newDirection;
}

// Función que se llamara con la tecla presionada y nos permitirá cambiar de dirección a la serpiente
function directionEvent(key) {
    switch (key.code) {
        case "ArrowUp":
            direction != "ArrowDown" && setDirection(key.code);
            break;
        case "ArrowDown":
            direction != "ArrowUp" && setDirection(key.code);
            break;
        case "ArrowLeft":
            direction != "ArrowRight" && setDirection(key.code);
            break;
        case "ArrowRight":
            direction != "ArrowLeft" && setDirection(key.code);
            break;
    }
}

// Función para dibujar la serpiente
function drawSnake() {
    snake.forEach((square) => drawSquare(square, "snakeSquare"));
}

// Función para crear comida aleatoria utilizando el método de Math
function createRandomFood() {
    const randomEmptySquare =
        emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, "foodSquare");
}

// Función para actualizar la puntuación dependiendo del tamaño de la serpiente
function updateScore() {
    scoreBoard.innerText = score;
}

// Función que recorre cada elemento de nuestro arreglo bidimensional y crea los elementos HTML con sus respectivas clases e id's
function createBoard() {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement("div");
            squareElement.setAttribute("class", "square emptySquare");
            squareElement.setAttribute("id", squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        });
    });
}

// Función para establecer los valores iniciales de cada variable
function setGame() {
    snake = ["00", "01", "02", "03"];
    score = snake.length;
    direction = "ArrowRight";
    boardSquares = Array.from(Array(boardSize), () =>
        new Array(boardSize).fill(squareTypes.emptySquare)
    );
    board.innerHTML = "";
    emptySquares = [];
    createBoard();
}

// Función para iniciar el juego
function startGame() {
    setGame();
    gameOverSign.style.display = "none";
    startButton.style.display = "none";
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener("keydown", directionEvent);
    // Intervalo que ejecuta la función moveSnake() cada cierto tiempo indicado en gameSpeed
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
}

// Evento que escucha el click para inicial el juego
startButton.addEventListener("click", startGame);
