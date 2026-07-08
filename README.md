# Facebook Fake Bot - Bug Bounty Practice

Clone Facebook untuk pembelajaran bug bounty. Berjalan di `localhost:8080`.

## Features

- **Login/Register** - Username & password bebas
- **Feed** - Postingan, like, comment, share
- **Stories** - Dynamic stories
- **Profiles** - `/u/:username` dan `/users/:id`
- **Video Player** - `/videos/:id`
- **Music Player** - `/music/:id` dengan playlist
- **Media Gallery** - `/media` untuk semua video & music
- **Bug Bounty Guide** - `/bug-bounty` dengan payloads & tools
- **Live Updates** - SSE real-time tanpa refresh
- **Dark Mode** - Auto theme toggle
- **Mobile Responsive** - Bottom nav untuk mobile

## Engine Structure

```
engine/
├── core/
│   ├── engine.js      # Core data management
│   ├── renderer.js    # Dynamic renderer
│   └── config.js      # Configuration
├── data/              # JSON data files
│   ├── users.json
│   ├── posts.json
│   ├── media.json     # videos, music, playlists
│   └── ...
└── public/js/engine.js # Client-side SSE
```

## Quick Start

```bash
# Install dependencies
npm install

# Run server
node server.js

# Open browser
http://localhost:8080/
```

## Default Admin Account

On first run, a default admin account is automatically created:

- **Username:** `admin`
- **Password:** `admin`
- **Login URL:** `http://localhost:8080/login`

You can login immediately with these credentials and start exploring all features.

## API Endpoints

### Auth
- `POST /api/auth/register` - Daftar
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Posts
- `GET /api/posts` - List posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Edit post
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

## Bug Bounty Targets

Aplikasi ini sengaja mempunyai vulnerabilities untuk latihan:

- **IDOR** - `/api/posts/:id`, `/api/users/:id`
- **XSS** - Input tanpa sanitization
- **CSRF** - Tiada token pada operasi
- **Session Fixation** - Session tidak diubah
- **Information Disclosure** - `/api/meta`, `/meta`
- **Broken Access Control** - Tiada verifikasi pemilik

## Pages

- `/` - Feed utama
- `/login` & `/register` - Auth
- `/profile.html` - Profil sendiri
- `/u/:username` - Profil pengguna
- `/videos` - Video gallery
- `/videos/:id` - Video player
- `/music` - Music gallery
- `/music/:id` - Music player
- `/media` - Semua media
- `/bug-bounty` - Panduan bug bounty
- `/meta` - Meta information

## Tech Stack

- **Backend**: Express.js + Node.js
- **Session**: express-session
- **Auth**: bcryptjs
- **Live Updates**: Server-Sent Events (SSE)
- **Frontend**: Vanilla JS + CSS
- **Data**: JSON files (engine/data/)

## License

MIT - Untuk tujuan pembelajaran sahaja.

## Author

hackbug36@gmail.com
