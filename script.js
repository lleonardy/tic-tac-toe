const gameBoard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => [...board];

    const placeMark = (index, symbol) => {
        if (board[index] != null) return false;
        board[index] = symbol;
        return true;
    };

    const resetBoard = () => {
        board = Array(9).fill(null);
    };

    const checkWin = (symbol) => {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winPatterns.some(pattern =>
            pattern.every(index => board[index] === symbol)
        );
    };

    const checkDraw = () => {
        return board.every(cell => cell !== null);
    };

    return {
        getBoard,
        placeMark,
        resetBoard,
        checkWin,
        checkDraw,
    };

})();

const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol,
    };
};

const gameController = (() => {
    const player1 = player("Player 1", "X");
    const player2 = player("Player 2", "O");

    let currentPlayer = player1;
    let gameOver = false;

    const switchTurn = () => {
        currentPlayer = 
            currentPlayer === player1 ? player2 : player1;
    };

    const playRound = (cellIndex) => {
        if (gameOver) return "Game is Over";

        const validMove = gameBoard.placeMark(
            cellIndex,
            currentPlayer.getSymbol()
        );

        if (!validMove) return "Invalid Move";

        if (gameBoard.checkWin(currentPlayer.getSymbol())) {
            gameOver = true;
            return `${currentPlayer.getName()} (${currentPlayer.getSymbol()}) wins`;
        }

        if (gameBoard.checkDraw()) {
            gameOver = true;
            return "Draw";
        }

        switchTurn();
        return `Next turn: ${currentPlayer.getName()} (${currentPlayer.getSymbol()})`;
    };

    const restartGame = () => {
        gameBoard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
    };

    const getCurrentPlayer = () => currentPlayer;

    return {
        playRound,
        restartGame,
        getCurrentPlayer,
    };

})();

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const buttonRestart = document.getElementById("btnRestart");
const cells = document.querySelectorAll(".cell");

const render = () => {
  const board = gameBoard.getBoard();

  board.forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value ?? "";

    // reset classes
    cell.classList.remove("x", "o");

    if (value === "X") {
      cell.classList.add("x");
    }

    if (value === "O") {
      cell.classList.add("o");
    }
  });
};

const updateStatus = (message) => {
  statusElement.textContent = message;

  statusElement.classList.remove("x", "o");

  if (message.includes("(X)")) {
    statusElement.classList.add("x");
  }

  if (message.includes("(O)")) {
    statusElement.classList.add("o");
  }
};

const handleCellClick = (event) => {
    const index = event.currentTarget.dataset.index;

    const result = gameController.playRound(Number(index));

    render();
    updateStatus(result);
};

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

buttonRestart.addEventListener("click", () => {
    gameController.restartGame();
    render();
    const current = gameController.getCurrentPlayer();
    updateStatus(`Next turn: ${current.getName()} (${current.getSymbol()})`);
});

render();
const current = gameController.getCurrentPlayer();
updateStatus(`Next turn: ${current.getName()} (${current.getSymbol()})`);
