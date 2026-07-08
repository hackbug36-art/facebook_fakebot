const engine = require('./core/engine');

class EngineRenderer {
  constructor() {
    this.engine = engine;
  }

  renderFeed(user, posts, stories, onlineUsers) {
    return {
      user,
      posts: posts.map(post => this.enrichPost(post)),
      stories: stories || [],
      onlineUsers: onlineUsers || [],
      stats: this.engine.getStats(),
      timestamp: new Date().toISOString()
    };
  }

  enrichPost(post) {
    const author = this.engine.getUserById(post.userId);
    const comments = this.engine.getCommentsByPostId(post.id);
    const likes = this.engine.getLikesByPostId(post.id);
    
    return {
      ...post,
      authorName: author?.name || 'Unknown',
      authorAvatar: author?.avatar || '',
      authorUsername: author?.username || '',
      comments: comments.map(c => ({
        ...c,
        userAvatar: this.engine.getUserById(c.userId)?.avatar || ''
      })),
      likesCount: likes.length,
      liked: false
    };
  }

  renderProfile(user, userPosts, isOwnProfile) {
    return {
      user: { ...user, password: undefined },
      posts: userPosts.map(post => this.enrichPost(post)),
      isOwnProfile,
      stats: this.engine.getStats()
    };
  }

  renderNotifications(notifications) {
    return {
      notifications: notifications.map(n => ({
        ...n,
        timeAgo: this.formatTimeAgo(n.createdAt)
      }))
    };
  }

  formatTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} j`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getTrendingPosts() {
    return this.engine.getTrendingPosts(10).map(post => this.enrichPost(post));
  }

  getRecommendedUsers() {
    return this.engine.getRecommendedUsers(10).map(u => ({ ...u, password: undefined }));
  }

  search(query) {
    return this.engine.searchPosts(query).map(post => this.enrichPost(post));
  }
}

module.exports = new EngineRenderer();
