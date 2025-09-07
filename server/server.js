const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
// Railway deployment trigger

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snakegame';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  highScore: { type: Number, default: 0 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Score Schema
const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Routes
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ highScore: -1 }).limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scores', async (req, res) => {
  try {
    const { userId, score } = req.body;
    
    // Save score
    const newScore = new Score({ userId, score });
    await newScore.save();
    
    // Update high score if needed
    const user = await User.findById(userId);
    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
    }
    
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/invite', async (req, res) => {
  try {
    const { email, playerName } = req.body;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${playerName} invites you to play Snake Game!`,
      html: `
        <h2>🐍 You're invited to play Snake Game!</h2>
        <p>${playerName} wants to challenge you!</p>
        <a href="https://mayukha-snake-game.surge.sh" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Play Now</a>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('To:', email);
    console.log('From:', process.env.EMAIL_USER);
    res.json({ 
      message: 'Invitation sent successfully!',
      messageId: info.messageId,
      recipient: email
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});