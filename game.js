class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.initializeControls();
        this.updateDisplay();
    }
    
    generateFood() {
        return {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }
    
    initializeControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            const key = e.key.toLowerCase();
            if ((key === 'arrowleft' || key === 'a') && this.dx !== 1) {
                this.dx = -1; this.dy = 0;
            } else if ((key === 'arrowup' || key === 'w') && this.dy !== 1) {
                this.dx = 0; this.dy = -1;
            } else if ((key === 'arrowright' || key === 'd') && this.dx !== -1) {
                this.dx = 1; this.dy = 0;
            } else if ((key === 'arrowdown' || key === 's') && this.dy !== -1) {
                this.dx = 0; this.dy = 1;
            }
        });
        
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    }
    
    startGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = true;
        this.gamePaused = false;
        this.updateDisplay();
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            if (!this.gamePaused) this.gameLoop();
        }
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        setTimeout(() => {
            this.clearCanvas();
            this.moveSnake();
            this.drawFood();
            this.drawSnake();
            
            if (this.checkGameOver()) {
                this.endGame();
                return;
            }
            
            this.gameLoop();
        }, 200);
    }
    
    clearCanvas() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    moveSnake() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.updateDisplay();
        } else {
            this.snake.pop();
        }
    }
    
    drawSnake() {
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach((segment, index) => {
            if (index === 0) this.ctx.fillStyle = '#8BC34A'; // Head
            else this.ctx.fillStyle = '#4CAF50'; // Body
            
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, 
                            this.gridSize - 2, this.gridSize - 2);
        });
    }
    
    drawFood() {
        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, 
                        this.gridSize - 2, this.gridSize - 2);
    }
    
    checkGameOver() {
        const head = this.snake[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // Self collision
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    endGame() {
        this.gameRunning = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        this.updateDisplay();
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new SnakeGame();
    
    // Add missing button functionality
    const shareBtn = document.getElementById('shareBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const gameUrl = 'https://mayukha-snake-game.surge.sh';
            const text = `Check out this Snake game! My high score is ${game.highScore}`;
            
            if (navigator.share) {
                navigator.share({ title: 'Snake Game', text, url: gameUrl });
            } else {
                const mailtoLink = `mailto:?subject=Play Snake Game&body=${text} - ${gameUrl}`;
                window.open(mailtoLink);
            }
        });
    }
    
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', () => {
            alert(`Your High Score: ${game.highScore}\n\nFor full leaderboard with friends, use the full-stack version!`);
        });
    }
});