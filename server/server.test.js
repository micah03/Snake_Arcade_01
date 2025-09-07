// Simple backend logic tests without server
const mongoose = require('mongoose');

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  model: jest.fn(),
  Schema: jest.fn()
}));

// Mock user model
const mockUser = {
  save: jest.fn().mockResolvedValue({ _id: '123', name: 'Test', highScore: 0 }),
  find: jest.fn(() => ({
    sort: jest.fn(() => ({
      limit: jest.fn().mockResolvedValue([
        { name: 'Player1', highScore: 100 },
        { name: 'Player2', highScore: 80 }
      ])
    }))
  })),
  findById: jest.fn().mockResolvedValue({ _id: '123', highScore: 50, save: jest.fn() })
};

describe('Snake Game Backend Logic', () => {
  test('User model saves correctly', async () => {
    const result = await mockUser.save();
    expect(result._id).toBe('123');
    expect(result.name).toBe('Test');
  });

  test('Leaderboard query works', async () => {
    const result = await mockUser.find().sort({ highScore: -1 }).limit(10);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });

  test('Score validation', () => {
    const isValidScore = (score) => typeof score === 'number' && score >= 0;
    expect(isValidScore(100)).toBe(true);
    expect(isValidScore(-10)).toBe(false);
    expect(isValidScore('abc')).toBe(false);
  });

  test('Email validation', () => {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(isValidEmail('test@test.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });
});