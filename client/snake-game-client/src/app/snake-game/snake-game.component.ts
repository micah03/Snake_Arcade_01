import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService, User } from '../game.service';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private gridSize = 20;
  private tileCount = 20;
  
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  dx = 0;
  dy = 0;
  score = 0;
  gameRunning = false;
  gamePaused = false;
  
  playerName = '';
  currentUser: User | null = null;
  leaderboard: User[] = [];
  showLeaderboard = false;
  inviteEmail = '';
  welcomeMessage = '';
  showNameInput = true;
  showInviteInput = false;
  isValidEmail = false;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.setupControls();
    this.loadLeaderboard();
  }

  setupControls() {
    document.addEventListener('keydown', (e) => {
      if (!this.gameRunning) return;
      
      switch(e.key) {
        case 'ArrowLeft': case 'a': this.dx = -1; this.dy = 0; break;
        case 'ArrowUp': case 'w': this.dx = 0; this.dy = -1; break;
        case 'ArrowRight': case 'd': this.dx = 1; this.dy = 0; break;
        case 'ArrowDown': case 's': this.dx = 0; this.dy = 1; break;
      }
    });
  }

  startGame() {
    if (!this.playerName) {
      alert('Please enter your name first!');
      return;
    }
    
    if (!this.currentUser) {
      this.showNameInput = false;
      this.welcomeMessage = `Hello ${this.playerName}! Let's play Snake!`;
      
      this.gameService.createUser({ name: this.playerName, highScore: 0 })
        .subscribe(user => {
          this.currentUser = user;
          this.initGame();
        });
    } else {
      this.initGame();
    }
  }

  initGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.generateFood();
    this.dx = 0;
    this.dy = 0;
    this.score = 0;
    this.gameRunning = true;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.gameRunning || this.gamePaused) {
      if (this.gamePaused) {
        setTimeout(() => this.gameLoop(), 200);
      }
      return;
    }
    
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

  pauseGame() {
    this.gamePaused = !this.gamePaused;
    if (!this.gamePaused) {
      this.gameLoop();
    }
  }

  moveSnake() {
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
    this.snake.unshift(head);
    
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.food = this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  generateFood() {
    return {
      x: Math.floor(Math.random() * this.tileCount),
      y: Math.floor(Math.random() * this.tileCount)
    };
  }

  clearCanvas() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, 400, 400);
  }

  drawSnake() {
    this.ctx.fillStyle = '#4CAF50';
    this.snake.forEach(segment => {
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
    return head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount ||
           this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }

  endGame() {
    this.gameRunning = false;
    
    // Draw game over screen
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, 400, 400);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', 200, 180);
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 200, 220);
    
    if (this.currentUser) {
      this.gameService.submitScore({ userId: this.currentUser._id!, score: this.score })
        .subscribe(() => this.loadLeaderboard());
    }
  }

  loadLeaderboard() {
    this.gameService.getLeaderboard().subscribe(users => {
      this.leaderboard = users;
    });
  }

  sendInvite() {
    if (this.isValidEmail && this.playerName) {
      this.gameService.sendInvite(this.inviteEmail, this.playerName)
        .subscribe({
          next: () => {
            alert('Invitation sent successfully!');
            this.cancelInvite();
          },
          error: (error) => {
            console.error('Email error:', error);
            alert('Email service temporarily unavailable. Please try again later.');
          }
        });
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isValidEmail = emailRegex.test(this.inviteEmail);
  }

  cancelInvite() {
    this.showInviteInput = false;
    this.inviteEmail = '';
    this.isValidEmail = false;
  }

  onNameEnter() {
    if (this.playerName.trim()) {
      this.showNameInput = false;
      this.welcomeMessage = `Hello ${this.playerName}! Ready to play?`;
    }
  }
}