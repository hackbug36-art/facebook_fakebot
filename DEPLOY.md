# Free Hosting Deployment Guide

Facebook FakeBot can be deployed for free using these platforms:

## 🚀 Recommended: Vercel (Free)

### Steps:
1. Fork this repo to your GitHub account
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click "Import Project" and select your fork
4. Vercel will auto-detect Node.js settings
5. Click "Deploy"

### Configuration:
- `vercel.json` is already configured
- Server will be available at: `https://your-project.vercel.app`
- Free tier includes: 100GB bandwidth, unlimited requests

---

## 🚀 Alternative: Railway (Free)

### Steps:
1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway will auto-deploy

### Configuration:
- `railway.json` is already configured
- Server will be available at: `https://your-project.up.railway.app`
- Free tier includes: $5/month credit

---

## 🚀 Alternative: Render (Free)

### Steps:
1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Build command: `npm install`
5. Start command: `node server.js`
6. Click "Create Web Service"

### Notes:
- Free tier includes: 100GB bandwidth
- Server will sleep after 15 minutes of inactivity

---

## 🚀 Alternative: Fly.io (Free)

### Steps:
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. Deploy: `fly launch` (in project directory)
4. Follow the prompts

### Configuration:
- Free tier includes: 3 shared VMs, 160GB outbound traffic

---

## ⚠️ Important Notes

### File Storage
Free hosting platforms use **ephemeral filesystems**:
- `data/` and `uploads/` will be **reset on restart**
- Use external storage for production:
  - **PostgreSQL**: Neon, Supabase, Vercel Postgres
  - **File Storage**: Cloudinary, AWS S3, Supabase Storage

### Session Storage
Sessions are stored in memory by default. For production:
- Use Redis: Upstash, Redis Cloud
- Or database-backed sessions

### Environment Variables
Set these in your hosting platform:
```
NODE_ENV=production
PORT=8080
SESSION_SECRET=your-secret-key-here
```

---

## 🔧 Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or deploy with GitHub integration
# Just push to GitHub and Vercel will auto-deploy
```

---

## 📊 Platform Comparison

| Platform | Free Tier | GitHub Integration | Persistent Storage | Best For |
|----------|-----------|-------------------|-------------------|----------|
| **Vercel** | 100GB bandwidth | ✅ Yes | ❌ No | Frontend + Serverless |
| **Railway** | $5/month | ✅ Yes | ⚠️ Limited | Full-stack apps |
| **Render** | 100GB/month | ✅ Yes | ❌ No | Simple deployments |
| **Fly.io** | 3 VMs | ✅ Yes | ⚠️ Volumes | Container apps |
| **Replit** | Always free | ✅ Yes | ❌ No | Quick testing |

---

## 🎯 Recommended Setup

For a **permanent free deployment**:

1. **Frontend**: Deploy to Vercel (static files)
2. **Backend**: Deploy to Railway or Fly.io
3. **Database**: Use Supabase (free PostgreSQL)
4. **File Storage**: Use Cloudinary (free tier)

This gives you a **permanent, production-ready** setup for $0/month.

---

## 📝 Current Status

- ✅ GitHub repo: https://github.com/hackbug36-art/facebook_fakebot
- ✅ Local server: http://localhost:8080
- ✅ Deployment configs: Vercel, Railway, Render, Fly.io
- ⏳ External database: Not configured yet
- ⏳ External file storage: Not configured yet

---

Choose a platform above and follow the steps to deploy!
