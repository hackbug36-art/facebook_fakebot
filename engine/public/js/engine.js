(function() {
  'use strict';

  window.Engine = {
    version: '1.0.0',
    connected: false,
    eventSource: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 10,
    reconnectInterval: 3000,

    init() {
      this.connect();
      this.startAutoRefresh();
    },

    connect() {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource('/events');

      this.eventSource.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('Engine: Connected to live updates');
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleUpdate(data);
        } catch (e) {
          console.error('Engine: Failed to parse update', e);
        }
      };

      this.eventSource.onerror = () => {
        this.connected = false;
        console.log('Engine: Connection lost, attempting to reconnect...');
        this.eventSource.close();
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), this.reconnectInterval);
        }
      };
    },

    handleUpdate(data) {
      if (data.timestamp) {
        this.updateTimestamp(data.timestamp);
      }

      if (data.posts) {
        this.updateFeed(data.posts);
      }

      if (data.stories) {
        this.updateStories(data.stories);
      }

      if (data.file === 'posts.json') {
        this.refreshFeed();
      }

      if (data.file === 'comments.json') {
        this.refreshFeed();
      }

      if (data.file === 'likes.json') {
        this.refreshFeed();
      }
    },

    updateTimestamp(timestamp) {
      const el = document.getElementById('liveTimestamp');
      if (el) {
        el.textContent = 'Live: ' + new Date(timestamp).toLocaleTimeString('id-ID');
      }
    },

    updateFeed(posts) {
      if (typeof renderPosts === 'function') {
        renderPosts(posts);
      }
    },

    updateStories(stories) {
      if (typeof loadStories === 'function') {
        loadStories();
      }
    },

    refreshFeed() {
      if (typeof loadPosts === 'function') {
        loadPosts();
      }
    },

    startAutoRefresh() {
      setInterval(() => {
        if (this.connected && typeof loadPosts === 'function') {
          loadPosts();
        }
      }, 30000);
    },

    disconnect() {
      if (this.eventSource) {
        this.eventSource.close();
        this.connected = false;
      }
    },

    getStats() {
      return fetch('/api/engine/stats')
        .then(res => res.json())
        .catch(err => ({ error: err.message }));
    },

    getTrending() {
      return fetch('/api/engine/trending')
        .then(res => res.json())
        .catch(err => ({ error: err.message }));
    },

    search(query) {
      return fetch(`/api/engine/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .catch(err => ({ error: err.message }));
    }
  };

  window.EngineAPI = {
    post: (endpoint, data) => fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

    get: (endpoint) => fetch(endpoint)
      .then(res => res.json()),

    put: (endpoint, data) => fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

    delete: (endpoint) => fetch(endpoint, { method: 'DELETE' })
      .then(res => res.json())
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.Engine.init());
  } else {
    window.Engine.init();
  }
})();
