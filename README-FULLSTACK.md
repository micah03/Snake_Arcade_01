# 🐍 Full-Stack Snake Game

MongoDB + Express + Angular + Node.js (MEAN Stack)

## 🚀 Features
- **Leaderboard** with MongoDB storage
- **User registration** and score tracking
- **Email invitations** to friends
- **Real-time leaderboard** updates

## 🛠️ Setup

### Backend (Node.js + MongoDB)
```bash
cd server
npm install
# Start MongoDB locally
mongod
npm run dev
```

### Frontend (Angular)
```bash
cd client/snake-game-client
npm install
ng serve
```

### Environment Variables
Create `server/.env`:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

## 📦 Deployment

### Backend (Heroku + MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Deploy to Heroku with MongoDB connection string

### Frontend (Netlify/Vercel)
```bash
cd client/snake-game-client
ng build
# Deploy dist/ folder
```

## 🎮 API Endpoints
- `POST /api/users` - Create user
- `GET /api/leaderboard` - Get top scores
- `POST /api/scores` - Submit score
- `POST /api/invite` - Send email invitation

Your Snake game now has full social features! 🎉