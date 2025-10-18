const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset');

// Choose mode: true for single-player vs computer, false for two players
let singlePlayer = true;

let gameActive = true;
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();

    // Single-player: make computer move if it's O's turn
    if (singlePlayer && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 300); // slight delay for realism
    }
}

const handleCellClick = (clickedCellEvent) => {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    cells.forEach(cell => cell.innerHTML = "");

    // If single-player and computer starts first
    if (singlePlayer && currentPlayer === 'O') {
        setTimeout(computerMove, 300);
    }
}

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

// --- Computer AI logic (hard) ---
const computerMove = () => {
    const bestMoveIndex = findBestMove(gameState);
    if (bestMoveIndex !== -1) {
        const cell = cells[bestMoveIndex];
        handleCellPlayed(cell, bestMoveIndex);
        handleResultValidation();
    }
}

const findBestMove = (board) => {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = 'O';
            let moveVal = minimax(board, 0, false);
            board[i] = "";
            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

const minimax = (board, depth, isMax) => {
    let score = evaluate(board);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!board.includes("")) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

const evaluate = (b) => {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b1, c] = winningConditions[i];
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
            if (b[a] === 'O') return 10;
            if (b[a] === 'X') return -10;
        }
    }
    return 0;
}

// --- Initialize ---
statusDisplay.innerHTML = currentPlayerTurn();
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame);

// If single-player and computer starts first
if (singlePlayer && currentPlayer === 'O') {
    setTimeout(computerMove, 300);
}
