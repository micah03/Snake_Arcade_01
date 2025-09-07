// Mock DOM elements for testing
global.document = {
    getElementById: jest.fn(() => ({
        getContext: () => ({
            fillStyle: '',
            fillRect: jest.fn(),
            fillText: jest.fn(),
            font: '',
            textAlign: ''
        }),
        width: 400,
        height: 400
    })),
    addEventListener: jest.fn()
};

global.localStorage = {
    getItem: jest.fn(() => '0'),
    setItem: jest.fn()
};

global.window = { addEventListener: jest.fn() };

// Import game after mocking
const SnakeGame = require('./game-testable.js');

describe('Snake Game Tests', () => {
    let game;

    beforeEach(() => {
        game = new SnakeGame();
    });

    test('game initializes correctly', () => {
        expect(game.snake).toEqual([{ x: 10, y: 10 }]);
        expect(game.score).toBe(0);
        expect(game.gameRunning).toBe(false);
    });

    test('generates food within bounds', () => {
        const food = game.generateFood();
        expect(food.x).toBeGreaterThanOrEqual(0);
        expect(food.x).toBeLessThan(game.tileCount);
        expect(food.y).toBeGreaterThanOrEqual(0);
        expect(food.y).toBeLessThan(game.tileCount);
    });

    test('detects wall collision', () => {
        game.snake = [{ x: -1, y: 10 }];
        expect(game.checkGameOver()).toBe(true);
        
        game.snake = [{ x: 20, y: 10 }];
        expect(game.checkGameOver()).toBe(true);
    });

    test('detects self collision', () => {
        game.snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 5, y: 5 }
        ];
        expect(game.checkGameOver()).toBe(true);
    });

    test('snake moves correctly', () => {
        game.dx = 1;
        game.dy = 0;
        game.food = { x: 99, y: 99 }; // Far away
        const initialLength = game.snake.length;
        
        game.moveSnake();
        
        expect(game.snake[0].x).toBe(11);
        expect(game.snake.length).toBe(initialLength);
    });

    test('snake grows when eating food', () => {
        game.dx = 1;
        game.dy = 0;
        game.food = { x: 11, y: 10 }; // Next position
        const initialLength = game.snake.length;
        
        game.moveSnake();
        
        expect(game.snake.length).toBe(initialLength + 1);
        expect(game.score).toBe(10);
    });
});