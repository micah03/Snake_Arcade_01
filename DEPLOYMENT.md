# 🚀 Quick Deployment Guide

## Git Setup & Commit

```bash
# Initialize git
git init
git add .
git commit -m "Initial Snake game release"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/Arcade_Game_01.git
git branch -M main
git push -u origin main
```

## Deploy Options

### 1. GitHub Pages (Free)
1. Go to your repo → Settings → Pages
2. Source: "Deploy from a branch" → main
3. Live at: `https://yourusername.github.io/Arcade_Game_01/`

### 2. Netlify (Instant)
- Drag project folder to [netlify.com/drop](https://netlify.com/drop)
- Get instant URL

### 3. Surge (CLI)
```bash
npm install -g surge
surge
# Follow prompts, get custom domain
```

## Test Before Deploy
```bash
npm test          # Run unit tests
npm start         # Test locally
```

Your game is now live and shareable! 🎮