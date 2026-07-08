const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const engine = require('./engine/core/engine');

const app = express();
const PORT = 8080;
const WEB_ROOT = '/home/tukuk/myweb';
const DATA_DIR = path.join(WEB_ROOT, 'data');
const ENGINE_DATA_DIR = path.join(WEB_ROOT, 'engine', 'data');

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/css', express.static(path.join(WEB_ROOT, 'public', 'css')));
app.use('/js', express.static(path.join(WEB_ROOT, 'public', 'js')));
app.use('/engine/public', express.static(path.join(WEB_ROOT, 'engine', 'public')));

app.use(session({
  secret: 'fb-local-clone-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

function readJson(file, defaultValue) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultValue;
  }
}

function writeJson(file, data) {
  const filePath = path.join(DATA_DIR, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getCurrentUser(req) {
  if (!req.session.userId) return null;
  const users = readJson('users.json', []);
  return users.find(u => u.id === req.session.userId) || null;
}

function requireAuth(req, res) {
  const user = getCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return user;
}

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(WEB_ROOT, 'views', 'feed.html'));
  } else {
    res.sendFile(path.join(WEB_ROOT, 'views', 'login.html'));
  }
});

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.sendFile(path.join(WEB_ROOT, 'views', 'login.html'));
});

app.get('/login.html', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.sendFile(path.join(WEB_ROOT, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.sendFile(path.join(WEB_ROOT, 'views', 'register.html'));
});

app.get('/register.html', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.sendFile(path.join(WEB_ROOT, 'views', 'register.html'));
});

app.get('/feed.html', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'feed.html'));
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'profile.html'));
});

app.get('/u/:username', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'user-profile.html'));
});

app.get('/users/:id', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'user-profile.html'));
});

app.get('/posts/:id', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'post-detail.html'));
});

app.get('/meta', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'index.html.meta'));
});

app.get('/bug-bounty', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'bug-bounty.html'));
});

app.get('/videos', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'media-gallery.html'));
});

app.get('/videos/:id', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'video-player.html'));
});

app.get('/music', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'media-gallery.html'));
});

app.get('/music/:id', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'music-player.html'));
});

app.get('/media', (req, res) => {
  res.sendFile(path.join(WEB_ROOT, 'views', 'media-gallery.html'));
});

app.get('/api/meta', (req, res) => {
  const meta = {
    server: 'Express.js + Facebook Engine',
    port: PORT,
    host: 'localhost',
    root: WEB_ROOT,
    data: DATA_DIR,
    engine: path.join(WEB_ROOT, 'engine'),
    views: path.join(WEB_ROOT, 'views'),
    public: path.join(WEB_ROOT, 'public'),
    node: process.version,
    os: process.platform,
    time: new Date().toISOString(),
    endpoints: [
      'GET /', 'GET /login', 'GET /register', 'GET /feed.html', 'GET /profile.html',
      'GET /u/:username', 'GET /users/:id', 'GET /posts/:id', 'GET /meta', 'GET /api/meta',
      'POST /api/auth/register', 'POST /api/auth/login', 'POST /api/auth/logout',
      'GET /api/auth/me', 'GET /api/posts', 'POST /api/posts',
      'PUT /api/posts/:id', 'DELETE /api/posts/:id',
      'POST /api/posts/:id/like', 'POST /api/posts/:id/comments',
      'GET /api/users', 'GET /api/users/:id', 'GET /api/users/username/:username',
      'GET /api/users/:id/posts', 'PUT /api/users/me',
      'GET /api/engine/stats', 'GET /api/engine/feed', 'GET /api/engine/trending',
      'GET /api/engine/stories', 'GET /api/engine/search',
      'GET /api/engine/media/videos', 'GET /api/engine/media/music',
      'GET /api/engine/media/playlists', 'POST /api/engine/media/videos',
      'POST /api/engine/media/music', 'POST /api/engine/media/:id/play',
      'DELETE /api/engine/media/:id/:type',
      'GET /videos', 'GET /videos/:id', 'GET /music', 'GET /music/:id', 'GET /media'
    ],
    files: ['users.json', 'posts.json', 'comments.json', 'likes.json', 'stories.json', 'settings.json'],
    session: 'express-session',
    auth: 'bcryptjs',
    engine: {
      version: '1.0.0',
      liveUpdates: true,
      sse: true,
      features: ['liveFeed', 'realTimeNotifications', 'dynamicStories', 'autoRefresh', 'darkMode']
    },
    bugBounty: {
      targets: [
        'IDOR (Insecure Direct Object Reference)',
        'Authentication Bypass',
        'Session Fixation',
        'CSRF (Cross-Site Request Forgery)',
        'XSS (Cross-Site Scripting)',
        'SSRF (Server-Side Request Forgery)',
        'Information Disclosure',
        'Broken Access Control',
        'Rate Limiting Bypass',
        'Insecure Deserialization'
      ],
      vulnerableEndpoints: [
        '/api/posts/:id (IDOR)',
        '/api/users/:id (IDOR)',
        '/api/users/me (Authorization)',
        '/api/auth/me (Session)',
        '/u/:username (Information Disclosure)',
        '/api/meta (Information Disclosure)',
        '/meta (Information Disclosure)'
      ],
      testPayloads: {
        idor: 'Change post/:id or users/:id to access other resources',
        xss: '<script>alert(1)</script> in name/content/comments',
        csrf: 'State-changing ops without tokens',
        auth: 'Try accessing /api/auth/me without session'
      }
    },
    note: 'Local clone for bug bounty practice. Not connected to Facebook.'
  };
  res.json(meta);
});

app.get('/api/engine/stats', (req, res) => {
  res.json(engine.getStats());
});

app.get('/api/engine/feed', (req, res) => {
  const posts = engine.getFeedPosts(20, 0);
  const stories = engine.getStories();
  const users = engine.getUsers();
  const comments = engine.getComments();
  const likes = engine.getLikes();
  const currentUser = getCurrentUser(req);

  const enriched = posts.map(post => {
    const author = users.find(u => u.id === post.userId) || { name: 'Unknown', avatar: '' };
    const postComments = comments.filter(c => c.postId === post.id);
    const postLikes = likes.filter(l => l.postId === post.id);
    const liked = currentUser ? likes.some(l => l.postId === post.id && l.userId === currentUser.id) : false;
    return {
      ...post,
      authorName: author.name,
      authorAvatar: author.avatar,
      authorUsername: author.username,
      comments: postComments,
      likes: postLikes,
      liked,
      commentsCount: postComments.length,
      likesCount: postLikes.length
    };
  });

  res.json({ posts: enriched, stories });
});

app.get('/api/engine/trending', (req, res) => {
  res.json({ posts: engine.getTrendingPosts(10) });
});

app.get('/api/engine/stories', (req, res) => {
  res.json({ stories: engine.getStories() });
});

app.get('/api/engine/search', (req, res) => {
  const query = req.query.q || '';
  if (!query) return res.json({ posts: [] });
  res.json({ posts: engine.searchPosts(query) });
});

app.get('/api/engine/media/videos', (req, res) => {
  res.json({ videos: engine.getMediaByType('videos') });
});

app.get('/api/engine/media/music', (req, res) => {
  res.json({ music: engine.getMediaByType('music') });
});

app.get('/api/engine/media/playlists', (req, res) => {
  res.json({ playlists: engine.getMediaByType('playlists') });
});

app.post('/api/engine/media/videos', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { title, url, thumbnail, duration } = req.body;
  const video = {
    id: 'video_' + Date.now(),
    postId: req.body.postId || null,
    userId: user.id,
    title: title || 'Untitled Video',
    url: url || '',
    thumbnail: thumbnail || '',
    duration: duration || '0:00',
    views: 0,
    createdAt: new Date().toISOString()
  };
  res.json({ success: true, video: engine.addMedia(video) });
});

app.post('/api/engine/media/music', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { title, artist, url, cover, duration } = req.body;
  const track = {
    id: 'music_' + Date.now(),
    postId: req.body.postId || null,
    userId: user.id,
    title: title || 'Untitled Track',
    artist: artist || 'Unknown Artist',
    url: url || '',
    cover: cover || '',
    duration: duration || '0:00',
    plays: 0,
    createdAt: new Date().toISOString()
  };
  res.json({ success: true, music: engine.addMedia(track) });
});

app.post('/api/engine/media/:id/play', (req, res) => {
  const media = engine.getMediaByType('videos').find(v => v.id === req.params.id) ||
                engine.getMediaByType('music').find(m => m.id === req.params.id);
  if (!media) return res.status(404).json({ error: 'Media not found' });
  
  if (media.views !== undefined) media.views = (media.views || 0) + 1;
  if (media.plays !== undefined) media.plays = (media.plays || 0) + 1;
  
  res.json({ success: true, views: media.views || media.plays });
});

app.delete('/api/engine/media/:id/:type', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { id, type } = req.params;
  const media = engine.getMediaByType(type).find(m => m.id === id);
  if (!media) return res.status(404).json({ error: 'Media not found' });
  if (media.userId !== user.id) return res.status(403).json({ error: 'Forbidden' });
  engine.deleteMedia(id, type);
  res.json({ success: true });
});

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientId = Date.now().toString();
  engine.subscribe(clientId, (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  req.on('close', () => {
    engine.unsubscribe(clientId);
  });
});

app.get('/api/users/username/:username', (req, res) => {
  const users = readJson('users.json', []);
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.get('/api/users/:id/posts', (req, res) => {
  const posts = readJson('posts.json', []);
  const users = readJson('users.json', []);
  const comments = readJson('comments.json', []);
  const likes = readJson('likes.json', []);
  const currentUser = getCurrentUser(req);
  const userPosts = posts.filter(p => p.userId === req.params.id);
  const enriched = userPosts.map(post => {
    const author = users.find(u => u.id === post.userId) || { name: 'Unknown', avatar: '' };
    const postComments = comments.filter(c => c.postId === post.id);
    const postLikes = likes.filter(l => l.postId === post.id);
    const liked = currentUser ? likes.some(l => l.postId === post.id && l.userId === currentUser.id) : false;
    return {
      ...post,
      authorName: author.name,
      authorAvatar: author.avatar,
      comments: postComments,
      likes: postLikes,
      liked,
      commentsCount: postComments.length,
      likesCount: postLikes.length
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ posts: enriched });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Semua kolom wajib diisi' });
    }
    const users = readJson('users.json', []);
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username sudah wujud' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      username,
      name,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0866FF&color=fff`,
      bio: '',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeJson('users.json', users);
    req.session.userId = user.id;
    res.json({ success: true, user: { id: user.id, username: user.username, name: user.name, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ error: 'Ralat pelayan' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readJson('users.json', []);
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Username atau kata laluan salah' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Username atau kata laluan salah' });
    }
    req.session.userId = user.id;
    res.json({ success: true, user: { id: user.id, username: user.username, name: user.name, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ error: 'Ralat pelayan' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/auth/me', (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.get('/api/posts', (req, res) => {
  const posts = readJson('posts.json', []);
  const users = readJson('users.json', []);
  const comments = readJson('comments.json', []);
  const likes = readJson('likes.json', []);
  const currentUser = getCurrentUser(req);

  const enriched = posts.map(post => {
    const author = users.find(u => u.id === post.userId) || { name: 'Unknown', avatar: '' };
    const postComments = comments.filter(c => c.postId === post.id);
    const postLikes = likes.filter(l => l.postId === post.id);
    const liked = currentUser ? likes.some(l => l.postId === post.id && l.userId === currentUser.id) : false;
    return {
      ...post,
      authorName: author.name,
      authorAvatar: author.avatar,
      comments: postComments,
      likes: postLikes,
      liked,
      commentsCount: postComments.length,
      likesCount: postLikes.length
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ posts: enriched });
});

app.post('/api/posts', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { content, image } = req.body;
  if (!content && !image) {
    return res.status(400).json({ error: 'Content or image is required' });
  }
  const posts = readJson('posts.json', []);
  const post = {
    id: Date.now().toString(),
    userId: user.id,
    content: content || '',
    image: image || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  posts.push(post);
  writeJson('posts.json', posts);
  res.json({ success: true, post });
});

app.put('/api/posts/:id', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const posts = readJson('posts.json', []);
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.userId !== user.id) return res.status(403).json({ error: 'Forbidden' });
  const { content, image } = req.body;
  post.content = content ?? post.content;
  post.image = image ?? post.image;
  post.updatedAt = new Date().toISOString();
  writeJson('posts.json', posts);
  res.json({ success: true, post });
});

app.delete('/api/posts/:id', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  let posts = readJson('posts.json', []);
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.userId !== user.id) return res.status(403).json({ error: 'Forbidden' });
  posts = posts.filter(p => p.id !== req.params.id);
  writeJson('posts.json', posts);
  res.json({ success: true });
});

app.post('/api/posts/:id/like', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const likes = readJson('likes.json', []);
  const existing = likes.find(l => l.postId === req.params.id && l.userId === user.id);
  if (existing) {
    const updated = likes.filter(l => !(l.postId === req.params.id && l.userId === user.id));
    writeJson('likes.json', updated);
    return res.json({ success: true, liked: false });
  }
  likes.push({ id: Date.now().toString(), postId: req.params.id, userId: user.id, createdAt: new Date().toISOString() });
  writeJson('likes.json', likes);
  res.json({ success: true, liked: true });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Comment text is required' });
  const comments = readJson('comments.json', []);
  const comment = {
    id: Date.now().toString(),
    postId: req.params.id,
    userId: user.id,
    userName: user.name,
    text,
    createdAt: new Date().toISOString()
  };
  comments.push(comment);
  writeJson('comments.json', comments);
  res.json({ success: true, comment });
});

app.get('/api/users', (req, res) => {
  const users = readJson('users.json', []);
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json({ users: safeUsers });
});

app.get('/api/users/:id', (req, res) => {
  const users = readJson('users.json', []);
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.put('/api/users/me', (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const users = readJson('users.json', []);
  const idx = users.findIndex(u => u.id === user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const { name, bio, avatar } = req.body;
  if (name) users[idx].name = name;
  if (bio !== undefined) users[idx].bio = bio;
  if (avatar) users[idx].avatar = avatar;
  writeJson('users.json', users);
  const { password, ...safeUser } = users[idx];
  res.json({ success: true, user: safeUser });
});

app.get('/favicon.ico', (req, res) => res.status(204).send());
app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nDisallow: /'));

app.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Static root: ${WEB_ROOT}`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Engine directory: ${path.join(WEB_ROOT, 'engine')}`);
  console.log(`Live updates: SSE at /events`);
});
