import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GameService, User, Score } from './game.service';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create user', () => {
    const mockUser: User = { _id: '123', name: 'Test', highScore: 0 };
    
    service.createUser({ name: 'Test' }).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should get leaderboard', () => {
    const mockLeaderboard: User[] = [
      { _id: '1', name: 'Player1', highScore: 100 },
      { _id: '2', name: 'Player2', highScore: 80 }
    ];

    service.getLeaderboard().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockLeaderboard);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/leaderboard');
    expect(req.request.method).toBe('GET');
    req.flush(mockLeaderboard);
  });

  it('should submit score', () => {
    const mockScore: Score = { userId: '123', score: 150 };

    service.submitScore(mockScore).subscribe(score => {
      expect(score).toEqual(mockScore);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/scores');
    expect(req.request.method).toBe('POST');
    req.flush(mockScore);
  });
});