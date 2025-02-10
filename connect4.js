class ConnectFour {
    constructor(rows = 6, cols = 7, playerName = 'Player', turnTimeLimit = 11) {
        this.rows = rows;
        this.cols = cols;
        this.board = Array.from({ length: rows }, () => Array(cols).fill(null));
        this.currentPlayer = 'red';
        this.isGameOver = false;
        this.scores = { red: 0, yellow: 0 };
        this.players = { red: playerName, yellow: 'AI' };
        this.level = 1;
        this.turnTimeLimit = turnTimeLimit;
        this.timeLeft = turnTimeLimit;
        this.timerInterval = null;
        this.createBoard();
        this.updateScoreboard();
    }
    createBoard() {
        const boardElement = document.getElementById('board');
        if (!boardElement) return;
        boardElement.innerHTML = '';
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', (event) => this.handleCellClick(event));
                boardElement.appendChild(cell);
            }
        }
    }
    startTurnTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timeLeft = Math.max(5, this.turnTimeLimit - this.level);
        document.getElementById('turn-timer-display').innerText = `Time Left: ${this.timeLeft}s`;
        document.getElementById('turn-timer-display').style.display = 'block';
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('turn-timer-display').innerText = `Time Left: ${this.timeLeft}s`;

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeOut();
            }
        }, 1000);
    }
    handleTimeOut() {
        this.switchTurn();
    }
    handleCellClick(event) {
        if (this.isGameOver) return;
        const col = event.target.dataset.col;
        if (col !== undefined) {
            this.dropDisc(parseInt(col));
        }
    }
    highlightWinningDiscs(row, col) {
        const directions = [
            [0, 1],  // Horizontal
            [1, 0],  // Vertical
            [1, 1],  // Diagonal
            [1, -1]  // Diagonal
        ];

        for (let [dr, dc] of directions) {
            let winningCells = [[row, col]];
            for (let i = 1; i < 4; i++) {
                let r = row + dr * i, c = col + dc * i;
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === this.currentPlayer) {
                    winningCells.push([r, c]);
                } else {
                    break;
                }
            }

            for (let i = 1; i < 4; i++) {
                let r = row - dr * i, c = col - dc * i;
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === this.currentPlayer) {
                    winningCells.push([r, c]);
                } else {
                    break;
                }
            }
            if (winningCells.length >= 4) { // Highlight only when there are 4 connected discs
                winningCells.forEach(([r, c]) => {
                    const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
                    if (cell) cell.classList.add('winning-cell'); // Add glow effect
                });
                return;
            }
        }
    }
    dropDisc(col) {
        if (this.isGameOver) return;

        for (let row = this.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) {
                this.board[row][col] = this.currentPlayer;
                this.animateDrop(row, col);

                if (this.checkWin(row, col)) {
                    this.isGameOver = true;
                    document.getElementById('status').innerText = `${this.players[this.currentPlayer]} wins!`;
                    this.scores[this.currentPlayer]++;
                    this.updateScoreboard();
                    this.highlightWinningDiscs(row, col);

                    if (this.currentPlayer === 'red') {
                        this.levelUp();
                    }
                    return;
                }

                this.switchTurn();
                return;
            }
        }
    }
    animateDrop(row, col) {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        if (!cell) return;
        const disc = document.createElement('div');
        disc.classList.add(this.currentPlayer);
        cell.appendChild(disc);
        setTimeout(() => {
            disc.style.top = '0px';
        }, 10);
    }
    switchTurn() {
        if (this.isGameOver) return;
        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        this.startTurnTimer();
        if (this.currentPlayer === 'yellow' && !this.isGameOver) {
            setTimeout(() => this.aiMove(), 500);
        }
    }
    aiMove() {
        setTimeout(() => {
            let bestMove = this.getBestMove();
            if (bestMove !== undefined) {
                this.dropDisc(bestMove);
            }
        }, 500);
    }
    getBestMove() {
        const availableCols = this.getAvailableColumns();
        if (availableCols.length === 0) return;
        for (let col of availableCols) {
            if (this.simulateMove(col, 'yellow')) return col;
        }
        for (let col of availableCols) {
            if (this.simulateMove(col, 'red')) return col;
        }
        const bestMove = this.evaluateMoves(availableCols);
        return bestMove;
    }
    evaluateMoves(availableCols) {
        let bestScore = -Infinity;
        let bestMove = availableCols[0];

        for (let col of availableCols) {
            const score = this.evaluateMove(col);
            if (score > bestScore) {
                bestScore = score;
                bestMove = col;
            }
        }

        return bestMove;
    }
    evaluateMove(col) {
        let score = 0;
        for (let row = this.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) {
                this.board[row][col] = 'yellow';
                score = this.scoreMove(row, col, 'yellow');
                this.board[row][col] = null;
                break;
            }
        }
        for (let row = this.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) {
                this.board[row][col] = 'red';
                score -= this.scoreMove(row, col, 'red');
                this.board[row][col] = null;
                break;
            }
        }

        return score;
    }
    scoreMove(row, col, player) {
        const directions = [
            [0, 1],  // Horizontal
            [1, 0],  // Vertical
            [1, 1],  // Diagonal
            [1, -1]  // Diagonal
        ];
        let score = 0;
        for (let [dr, dc] of directions) {
            let count = 1;
            let openEnds = 0;

            for (let i = 1; i < 4; i++) {
                let r = row + dr * i;
                let c = col + dc * i;
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === player) {
                    count++;
                } else if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && !this.board[r][c]) {
                    openEnds++;
                    break;
                } else {
                    break;
                }
            }
            for (let i = 1; i < 4; i++) {
                let r = row - dr * i;
                let c = col - dc * i;
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === player) {
                    count++;
                } else if (r >= 0 && r < this.rows && c >= 0 && c < this.cols && !this.board[r][c]) {
                    openEnds++;
                    break;
                } else {
                    break;
                }
            }
            if (count === 4) {
                score += 1000;
            } else if (count === 3) {
                score += 10;
            } else if (count === 2) {
                score += 5;
            }

            if (openEnds > 1) {
                score -= 5;
            }
        }

        return score;
    }
    simulateMove(col, player) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) {
                this.board[row][col] = player;
                let isWinningMove = this.checkWin(row, col);
                this.board[row][col] = null;
                if (isWinningMove) return true;
                break;
            }
        }
        return false;
    }
    getAvailableColumns() {
        return [...Array(this.cols).keys()].filter(col => !this.board[0][col]);
    }
    checkWin(row, col) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];
        for (let [dr, dc] of directions) {
            if (this.countConsecutive(row, col, dr, dc) + this.countConsecutive(row, col, -dr, -dc) >= 3) {
                return true;
            }
        }
        return false;
    }
    countConsecutive(row, col, dr, dc) {
        let count = 0;
        let r = row + dr, c = col + dc;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === this.currentPlayer) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }
    levelUp() {
        this.level++;
        console.log("New Level: ", this.level);
        document.getElementById('level-display').innerText = `Level: ${this.level}`;
    }
    updateScoreboard() {
        document.getElementById('scoreboard').innerText =
            `${this.players.red}: ${this.scores.red} - ${this.players.yellow}: ${this.scores.yellow}`;
    }
    resetGame() {
        this.isGameOver = false;
        this.currentPlayer = 'red';
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        document.querySelectorAll('.cell').forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('winning-cell');
        });
        document.getElementById('status').innerText = '';
        document.getElementById('level-display').innerText = `Level: ${this.level}`;
        clearInterval(this.timerInterval);
        this.startTurnTimer();
    }
}
let game = null;
document.addEventListener('DOMContentLoaded', () => {
    let playerName = '';
    let gameStarted = false;
    document.getElementById('player-name').addEventListener('input', (event) => {
        playerName = event.target.value || 'Player';
        if (gameStarted) {
            game.players.red = playerName;
            game.updateScoreboard();
        }
    });
    document.getElementById('start-game').addEventListener('click', () => {
        if (!gameStarted) {
            game = new ConnectFour(6, 7, playerName);
            gameStarted = true;
        }
        document.getElementById('game-container').style.display = 'flex';
        document.getElementById('game-info').style.display = 'block';
        document.getElementById('reset').style.display = 'block';
        document.getElementById('player-inputs').style.display = 'none';
        document.getElementById('game-title').style.display = 'none';

        game.startTurnTimer();
    });
    document.getElementById('reset').addEventListener('click', () => {
        if (game) {
            game.resetGame();
        }
    });
});