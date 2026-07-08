const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class FacebookEngine extends EventEmitter {
  constructor() {
    super();
    this.dataDir = path.join(__dirname, '..', 'data');
    this.viewsDir = path.join(__dirname, '..', 'views');
    this.publicDir = path.join(__dirname, '..', 'public');
    this.subscribers = new Map();
    this.updateInterval = null;
    this.initialize();
  }

  initialize() {
    if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
    this.ensureDataFiles();
    this.startLiveUpdates();
  }

  ensureDataFiles() {
    const defaults = {
      'users.json': [],
      'posts.json': [],
      'comments.json': [],
      'likes.json': [],
      'stories.json': [],
      'notifications.json': [],
      'messages.json': [],
      'settings.json': {
        siteName: 'Facebook Clone',
        maintenance: false,
        registration: true,
        maxPostsPerDay: 100,
        theme: 'light'
      },
      'media.json': {
        videos: [],
        music: [],
        playlists: []
      }
    };

    for (const [file, defaultData] of Object.entries(defaults)) {
      const filePath = path.join(this.dataDir, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      }
    }
  }

  readData(file) {
    const filePath = path.join(this.dataDir, file);
    if (!fs.existsSync(filePath)) return null;
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      return null;
    }
  }

  writeData(file, data) {
    const filePath = path.join(this.dataDir, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    this.emit('dataUpdate', { file, timestamp: new Date().toISOString() });
  }

  getUsers() { return this.readData('users.json') || []; }
  getPosts() { return this.readData('posts.json') || []; }
  getComments() { return this.readData('comments.json') || []; }
  getLikes() { return this.readData('likes.json') || []; }
  getStories() { return this.readData('stories.json') || []; }
  getNotifications() { return this.readData('notifications.json') || []; }
  getMessages() { return this.readData('messages.json') || []; }
  getSettings() { return this.readData('settings.json') || {}; }

  getUserById(id) { return this.getUsers().find(u => u.id === id); }
  getUserByUsername(username) { return this.getUsers().find(u => u.username === username); }
  getPostById(id) { return this.getPosts().find(p => p.id === id); }
  getCommentsByPostId(postId) { return this.getComments().filter(c => c.postId === postId); }
  getLikesByPostId(postId) { return this.getLikes.filter(l => l.postId === postId); }
  getPostsByUserId(userId) { return this.getPosts().filter(p => p.userId === userId); }

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.writeData('users.json', users);
    this.emit('userAdded', user);
    return user;
  }

  addPost(post) {
    const posts = this.getPosts();
    posts.push(post);
    this.writeData('posts.json', posts);
    this.emit('postAdded', post);
    return post;
  }

  updatePost(id, updates) {
    const posts = this.getPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    posts[idx] = { ...posts[idx], ...updates, updatedAt: new Date().toISOString() };
    this.writeData('posts.json', posts);
    this.emit('postUpdated', posts[idx]);
    return posts[idx];
  }

  deletePost(id) {
    let posts = this.getPosts();
    const post = posts.find(p => p.id === id);
    posts = posts.filter(p => p.id !== id);
    this.writeData('posts.json', posts);
    this.emit('postDeleted', post);
    return post;
  }

  addComment(comment) {
    const comments = this.getComments();
    comments.push(comment);
    this.writeData('comments.json', comments);
    this.emit('commentAdded', comment);
    return comment;
  }

  toggleLike(postId, userId) {
    const likes = this.getLikes();
    const existing = likes.find(l => l.postId === postId && l.userId === userId);
    let liked = false;

    if (existing) {
      const updated = likes.filter(l => !(l.postId === postId && l.userId === userId));
      this.writeData('likes.json', updated);
      liked = false;
    } else {
      likes.push({ id: Date.now().toString(), postId, userId, createdAt: new Date().toISOString() });
      this.writeData('likes.json', likes);
      liked = true;
    }

    this.emit('likeToggled', { postId, userId, liked });
    return liked;
  }

  addMedia(media) {
    const mediaData = this.readData('media.json') || { videos: [], music: [], playlists: [] };
    mediaData[media.type].push(media);
    this.writeData('media.json', mediaData);
    this.emit('mediaAdded', media);
    return media;
  }

  getMediaByType(type) {
    const mediaData = this.readData('media.json') || { videos: [], music: [], playlists: [] };
    return mediaData[type] || [];
  }

  getMediaByPostId(postId) {
    const mediaData = this.readData('media.json') || { videos: [], music: [], playlists: [] };
    return [
      ...mediaData.videos.filter(v => v.postId === postId),
      ...mediaData.music.filter(m => m.postId === postId)
    ];
  }

  deleteMedia(id, type) {
    const mediaData = this.readData('media.json') || { videos: [], music: [], playlists: [] };
    mediaData[type] = mediaData[type].filter(m => m.id !== id);
    this.writeData('media.json', mediaData);
    this.emit('mediaDeleted', { id, type });
  }

  searchMedia(query) {
    const q = query.toLowerCase();
    const mediaData = this.readData('media.json') || { videos: [], music: [], playlists: [] };
    return {
      videos: mediaData.videos.filter(v => v.title && v.title.toLowerCase().includes(q)),
      music: mediaData.music.filter(m => m.title && m.title.toLowerCase().includes(q))
    };
  }

  addStory(story) {
    const stories = this.getStories();
    stories.push(story);
    this.writeData('stories.json', stories);
    this.emit('storyAdded', story);
    return story;
  }

  addNotification(notification) {
    const notifications = this.getNotifications();
    notifications.push(notification);
    this.writeData('notifications.json', notifications);
    this.emit('notificationAdded', notification);
    return notification;
  }

  startLiveUpdates() {
    this.updateInterval = setInterval(() => {
      this.emit('tick', {
        timestamp: new Date().toISOString(),
        users: this.getUsers().length,
        posts: this.getPosts().length,
        comments: this.getComments().length,
        likes: this.getLikes().length
      });
    }, 5000);
  }

  stopLiveUpdates() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  subscribe(clientId, callback) {
    this.subscribers.set(clientId, callback);
    this.on('dataUpdate', callback);
    this.on('tick', callback);
  }

  unsubscribe(clientId) {
    this.subscribers.delete(clientId);
  }

  getStats() {
    return {
      users: this.getUsers().length,
      posts: this.getPosts().length,
      comments: this.getComments().length,
      likes: this.getLikes().length,
      stories: this.getStories().length,
      notifications: this.getNotifications().length,
      messages: this.getMessages().length
    };
  }

  getFeedPosts(limit = 50, offset = 0) {
    const posts = this.getPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return posts.slice(offset, offset + limit);
  }

  getTrendingPosts(limit = 10) {
    return this.getPosts()
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, limit);
  }

  searchPosts(query) {
    const q = query.toLowerCase();
    return this.getPosts().filter(p => 
      p.content && p.content.toLowerCase().includes(q)
    );
  }

  getRecommendedUsers(limit = 10) {
    return this.getUsers().slice(0, limit);
  }
}

module.exports = new FacebookEngine();
