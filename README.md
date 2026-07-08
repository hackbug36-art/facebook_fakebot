# Facebook FakeBot - Universal Package

Facebook clone untuk **bug bounty practice** - **Universal package** untuk semua platform: Web, Mobile (Android/iOS), Desktop (Windows/Mac/Linux), dan Docker.

## 🚀 Quick Install (All Platforms)

```bash
# Clone repository
git clone https://github.com/hackbug36-art/facebook_fakebot.git
cd facebook_fakebot

# Run universal installer
bash package/scripts/install.sh

# Start server
npm start
```

Buka browser: **http://localhost:8080** /  http://0.0.0.0:8080/

**Default admin:** `admin` / `admin`

---

## 🌐 Deploy for Free (Public Server)

Deploy this app for free using GitHub integration:

### Option 1: Vercel (Recommended)
1. Fork this repo to your GitHub account
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click "Import Project" and select your fork
4. Vercel will auto-detect Node.js settings
5. Click "Deploy"

Your app will be live at: `https://your-project.vercel.app`

### Option 2: Railway
1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub"
3. Select your forked repo
4. Railway will auto-deploy

Free tier includes: $5/month credit (enough for small apps)

### Option 3: Render
1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Build command: `npm install`
5. Start command: `node server.js`
6. Click "Create Web Service"

Free tier includes: 100GB bandwidth/month

### Option 4: Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. In project directory: `fly launch`
4. Follow prompts to deploy

Free tier includes: 3 shared VMs, 160GB outbound traffic

---

## ⚠️ Important Notes for Free Hosting

### File Storage
Free hosting platforms use **ephemeral filesystems**:
- `data/` and `uploads/` will be **reset on restart/deploy**
- For permanent storage, use external services:
  - **Database**: Supabase (free PostgreSQL), Neon
  - **File Storage**: Cloudinary (free tier), Supabase Storage

### Session Storage
Sessions are stored in memory. For production:
- Use Redis: Upstash (free tier), Redis Cloud
- Or database-backed sessions

### Environment Variables
Set these in your hosting platform dashboard:
```
NODE_ENV=production
PORT=8080
SESSION_SECRET=your-secret-key-here
```

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

---

## 📱 Supported Platforms

| Platform | Method | Status |
|----------|--------|--------|
| **Linux** | npm / Docker / Electron | ✅ Ready |
| **Windows** | npm / Docker / Electron | ✅ Ready |
| **macOS** | npm / Docker / Electron / iOS | ✅ Ready |
| **Android** | Termux / React Native APK | ✅ Ready |
| **iOS** | Safari / React Native IPA | ✅ Ready |
| **Docker** | Docker / Docker Compose | ✅ Ready |

---

## 🛠️ Installation Methods

### Method 1: Universal Script (Recommended)

```bash
bash package/scripts/install.sh
```

### Method 2: Web Only

```bash
npm install
npm start
```

### Method 3: Docker

```bash
docker build -t facebook-fakebot ./package/docker
docker run -p 8080:8080 facebook-fakebot
```

### Method 4: Desktop App

```bash
# Install dependencies
npm install
cd package/desktop && npm install

# Build for your platform
npm run build:linux    # Linux
npm run build:windows  # Windows
npm run build:mac      # macOS

# Or run in development
npm run dev
```

### Method 5: Mobile App

```bash
# Install dependencies
npm install
cd package/mobile && npm install

# Android
npm run android

# iOS (macOS only)
npm run ios
```

---

## 📦 Package Structure

```
facebook_fakebot/
├── server.js              # Express backend
├── engine/                # Core engine
│   ├── core/
│   │   ├── engine.js
│   │   ├── renderer.js
│   │   └── config.js
│   └── data/
│       ├── users.json
│       ├── posts.json
│       ├── media.json
│       └── ...
├── package/
│   ├── web/               # React frontend
│   │   ├── package.json
│   │   └── src/
│   ├── mobile/            # React Native app
│   │   ├── package.json
│   │   ├── index.js
│   │   └── src/
│   │       ├── App.js
│   │       ├── screens/
│   │       │   ├── LoginScreen.js
│   │       │   ├── FeedScreen.js
│   │       │   ├── ProfileScreen.js
│   │       │   ├── MediaScreen.js
│   │       │   └── BugBountyScreen.js
│   │       └── assets/
│   ├── desktop/           # Electron app
│   │   ├── package.json
│   │   └── electron/
│   │       └── main.js
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── scripts/
│       ├── install.sh
│       └── start.sh
└── docs/
    ├── linux.md
    ├── windows.md
    ├── macos.md
    ├── android.md
    └── ios.md
```

---

## 🎯 Features

### Core Features
- **Login/Register** - Username & password authentication
- **Feed** - Post, like, comment, share
- **Stories** - Dynamic stories system
- **Profiles** - User profiles with `/u/:username`
- **Video Player** - Watch videos with controls
- **Music Player** - Listen to music with playlist
- **Media Gallery** - Browse all media
- **Bug Bounty Guide** - Learn security testing
- **Live Updates** - Real-time via SSE
- **Dark Mode** - Theme toggle
- **Mobile Responsive** - Works on all screen sizes

### Bug Bounty Targets
- **IDOR** - Insecure Direct Object Reference
- **XSS** - Cross-Site Scripting
- **CSRF** - Cross-Site Request Forgery
- **Session Fixation** - Session management issues
- **Information Disclosure** - API meta exposure
- **Broken Access Control** - Missing authorization checks

---

## 🔧 Platform-Specific Instructions

### Linux
See [docs/linux.md](package/docs/linux.md)

### Windows
See [docs/windows.md](package/docs/windows.md)

### macOS
See [docs/macos.md](package/docs/macos.md)

### Android
See [docs/android.md](package/docs/android.md)

### iOS
See [docs/ios.md](package/docs/ios.md)

---

## 🐳 Docker Deployment

```bash
# Build image
npm run build:docker

# Run container
npm run docker:run

# Or use docker-compose
docker-compose -f package/docker/docker-compose.yml up
```

---

## 🔐 Default Admin Account

- **Username:** `admin`
- **Password:** `admin`
- **Login:** http://localhost:8080/login

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Posts
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike
- `POST /api/posts/:id/comments` - Add comment

### Media
- `GET /api/engine/media/videos` - List videos
- `GET /api/engine/media/music` - List music
- `POST /api/engine/media/videos` - Upload video
- `POST /api/engine/media/music` - Upload music
- `POST /api/engine/media/:id/play` - Record play

### Engine
- `GET /api/engine/stats` - Statistics
- `GET /api/engine/feed` - Engine feed
- `GET /api/engine/trending` - Trending posts
- `GET /api/engine/stories` - Stories
- `GET /events` - SSE live updates

---

## 🛡️ Security Notice

This is a **practice environment** for learning bug bounty hunting. All vulnerabilities are **intentionally included** for educational purposes.

- ⚠️ Do not use these techniques on systems you don't own
- ⚠️ Do not use for illegal activities
- ✅ Use only for learning and authorized testing

---

## 📝 License

MIT - For educational purposes only.

## 👤 Author

**hackbug36** - hackbug36@gmail.com

## 🔗 Repository

https://github.com/hackbug36-art/facebook_fakebot

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## ⭐ Star History

If you find this project useful for learning, please give it a star!

---

**Made with ❤️ for bug bounty hunters and security researchers**
