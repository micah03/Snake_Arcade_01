import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { SnakeGameComponent } from './snake-game.component';
import { GameService } from '../game.service';
import { of } from 'rxjs';

describe('SnakeGameComponent', () => {
  let component: SnakeGameComponent;
  let fixture: ComponentFixture<SnakeGameComponent>;
  let gameService: jasmine.SpyObj<GameService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GameService', ['createUser', 'getLeaderboard', 'submitScore']);

    await TestBed.configureTestingModule({
      declarations: [SnakeGameComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [{ provide: GameService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SnakeGameComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize game correctly', () => {
    expect(component.snake).toEqual([{ x: 10, y: 10 }]);
    expect(component.score).toBe(0);
    expect(component.gameRunning).toBe(false);
  });

  it('should generate food within bounds', () => {
    const food = component.generateFood();
    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThan(20);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeLessThan(20);
  });

  it('should detect game over on wall collision', () => {
    component.snake = [{ x: -1, y: 10 }];
    expect(component.checkGameOver()).toBe(true);
  });

  it('should create user when starting game', () => {
    component.playerName = 'TestPlayer';
    gameService.createUser.and.returnValue(of({ _id: '123', name: 'TestPlayer', highScore: 0 }));
    
    component.startGame();
    
    expect(gameService.createUser).toHaveBeenCalledWith({ name: 'TestPlayer', highScore: 0 });
  });

  it('should load leaderboard', () => {
    const mockLeaderboard = [{ _id: '1', name: 'Player1', highScore: 100 }];
    gameService.getLeaderboard.and.returnValue(of(mockLeaderboard));
    
    component.loadLeaderboard();
    
    expect(gameService.getLeaderboard).toHaveBeenCalled();
  });
});