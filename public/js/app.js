const API_BASE = '';

let currentUser = null;
let editingPostId = null;

function getTheme() {
  return localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function toggleTheme() {
  const current = getTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
}

async function api(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function getAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=0866FF&color=fff&size=128`;
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} j`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

async function checkAuth() {
  try {
    const data = await api('/api/auth/me');
    currentUser = data.user;
    updateNavbar();
  } catch {
    currentUser = null;
  }
}

function updateNavbar() {
  const authSection = document.getElementById('authSection');
  const userSection = document.getElementById('userSection');
  if (!authSection || !userSection) return;

  if (currentUser) {
    authSection.classList.add('d-none');
    userSection.classList.remove('d-none');
    const avatar = document.getElementById('navAvatar');
    if (avatar) avatar.src = currentUser.avatar || getAvatarUrl(currentUser.name);
  } else {
    authSection.classList.remove('d-none');
    userSection.classList.add('d-none');
  }
}

async function loadPosts() {
  const container = document.getElementById('postsContainer');
  if (!container) return;
  container.innerHTML = '<div class="text-center" style="padding:40px;color:#65676b">Memuat postingan...</div>';
  try {
    const data = await api('/api/posts');
    renderPosts(data.posts);
  } catch (err) {
    container.innerHTML = `<div class="text-center" style="padding:40px;color:#f3425f">Gagal memuat postingan: ${err.message}</div>`;
  }
}

function renderPosts(posts) {
  const container = document.getElementById('postsContainer');
  if (!container) return;
  if (!posts.length) {
    container.innerHTML = '<div class="text-center" style="padding:40px;color:#65676b">Belum ada postingan. Jadilah yang pertama!</div>';
    return;
  }
  container.innerHTML = posts.map(post => `
    <div class="card post" data-post-id="${post.id}">
      <div class="post-header">
        <img src="${post.authorAvatar || getAvatarUrl(post.authorName)}" class="post-avatar" onclick="window.location.href='/u/${post.userId}'" alt="">
        <div>
          <div class="post-author" onclick="window.location.href='/u/${post.userId}'">${escapeHtml(post.authorName)}</div>
          <div class="post-time">${formatTime(post.createdAt)}${post.updatedAt !== post.createdAt ? ' (diedit)' : ''}</div>
        </div>
        ${post.userId === currentUser?.id ? `
          <div class="post-options-menu">
            <button class="post-options-btn" onclick="togglePostOptions('${post.id}')">⋯</button>
            <div class="post-options-dropdown" id="post-options-${post.id}">
              <div class="post-option-item" onclick="editPost('${post.id}')">✏️ Edit Postingan</div>
              <div class="post-option-item danger" onclick="deletePost('${post.id}')">🗑️ Hapus Postingan</div>
            </div>
          </div>
        ` : ''}
      </div>
      <div class="post-content">${escapeHtml(post.content)}</div>
      ${post.image ? `<img src="${post.image}" class="post-image" alt="">` : ''}
      <div class="post-stats">
        <div class="reactions-bar" onclick="toggleReactions('${post.id}')">
          <div class="reaction-icon" style="background: var(--reaction-like); z-index: 5;">👍</div>
          ${post.likesCount > 0 ? `<span class="reaction-count">${post.likesCount}</span>` : ''}
        </div>
        <div>
          <span style="cursor:pointer;" onclick="focusComment('${post.id}')">${post.commentsCount} komentar</span>
        </div>
      </div>
      <div class="post-actions">
        <button class="post-action ${post.liked ? 'active' : ''}" onclick="toggleLike('${post.id}', this)">
          <span>👍</span> Suka
        </button>
        <button class="post-action" onclick="focusComment('${post.id}')">
          <span>💬</span> Komentar
        </button>
        <button class="post-action" onclick="toggleShare('${post.id}')">
          <span>↗️</span> Bagikan
        </button>
      </div>
      <div class="comments-section">
        <div id="comments-${post.id}">
          ${post.comments.map(c => `
            <div class="comment">
              <img src="${getAvatarUrl(c.userName)}" class="comment-avatar" alt="">
              <div class="comment-body">
                <div class="comment-author">${escapeHtml(c.userName)}</div>
                <div class="comment-text">${escapeHtml(c.text)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="comment-input-area">
          <img src="${currentUser?.avatar || getAvatarUrl(currentUser?.name)}" class="comment-avatar" alt="">
          <input type="text" class="comment-input" id="comment-input-${post.id}" placeholder="Tulis komentar..." onkeydown="if(event.key==='Enter')submitComment('${post.id}')">
          <button class="comment-submit" onclick="submitComment('${post.id}')">Kirim</button>
        </div>
      </div>
      <div class="reactions-popup" id="reactions-${post.id}">
        <button class="reaction-btn" onclick="addReaction('${post.id}', 'like')">👍</button>
        <button class="reaction-btn" onclick="addReaction('${post.id}', 'love')">❤️</button>
        <button class="reaction-btn" onclick="addReaction('${post.id}', 'haha')">😆</button>
        <button class="reaction-btn" onclick="addReaction('${post.id}', 'wow')">😮</button>
        <button class="reaction-btn" onclick="addReaction('${post.id}', 'sad')">😢</button>
        <button class="reaction-btn" onclick="addReaction('${post.id}', 'angry')">😡</button>
      </div>
      <div class="share-popup" id="share-${post.id}">
        <div class="share-item" onclick="sharePost('${post.id}', 'copy')">
          <div class="share-icon" style="background:#e4e6eb;">📋</div>
          <span>Salin Tautan</span>
        </div>
        <div class="share-item" onclick="sharePost('${post.id}', 'friends')">
          <div class="share-icon" style="background:#e4e6eb;">👥</div>
          <span>Kirim ke Teman</span>
        </div>
        <div class="share-item" onclick="sharePost('${post.id}', 'timeline')">
          <div class="share-icon" style="background:#e4e6eb;">📄</div>
          <span>Bagikan ke Timeline</span>
        </div>
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function toggleReactions(postId) {
  const popup = document.getElementById(`reactions-${postId}`);
  if (popup) {
    popup.classList.toggle('show');
    document.querySelectorAll('.reactions-popup').forEach(el => {
      if (el !== popup) el.classList.remove('show');
    });
  }
}

function toggleShare(postId) {
  const popup = document.getElementById(`share-${postId}`);
  if (popup) {
    popup.classList.toggle('show');
    document.querySelectorAll('.share-popup').forEach(el => {
      if (el !== popup) el.classList.remove('show');
    });
  }
}

function togglePostOptions(postId) {
  const dropdown = document.getElementById(`post-options-${postId}`);
  if (dropdown) {
    dropdown.classList.toggle('show');
    document.querySelectorAll('.post-options-dropdown').forEach(el => {
      if (el !== dropdown) el.classList.remove('show');
    });
  }
}

async function addReaction(postId, type) {
  try {
    await api(`/api/posts/${postId}/like`, { method: 'POST' });
    const popup = document.getElementById(`reactions-${postId}`);
    if (popup) popup.classList.remove('show');
    loadPosts();
  } catch (err) {
    alert('Gagal: ' + err.message);
  }
}

async function sharePost(postId, type) {
  const popup = document.getElementById(`share-${postId}`);
  if (popup) popup.classList.remove('show');
  
  if (type === 'copy') {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/posts/' + postId);
      alert('Tautan disalin!');
    } catch {
      alert('Gagal menyalin tautan');
    }
  } else {
    alert('Fitur ' + type + ' segera hadir');
  }
}

async function toggleLike(postId, btn) {
  try {
    const data = await api(`/api/posts/${postId}/like`, { method: 'POST' });
    btn.classList.toggle('active', data.liked);
    loadPosts();
  } catch (err) {
    alert('Gagal: ' + err.message);
  }
}

function focusComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  if (input) input.focus();
}

async function submitComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  if (!input || !input.value.trim()) return;
  try {
    await api(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: { text: input.value.trim() }
    });
    input.value = '';
    loadPosts();
  } catch (err) {
    alert('Gagal: ' + err.message);
  }
}

async function deletePost(postId) {
  if (!confirm('Hapus postingan ini?')) return;
  try {
    await api(`/api/posts/${postId}`, { method: 'DELETE' });
    loadPosts();
  } catch (err) {
    alert('Gagal: ' + err.message);
  }
}

function editPost(postId) {
  const postEl = document.querySelector(`[data-post-id="${postId}"]`);
  if (!postEl) return;
  const contentEl = postEl.querySelector('.post-content');
  if (!contentEl) return;
  const currentContent = contentEl.textContent;
  const newContent = prompt('Edit postingan:', currentContent);
  if (newContent === null) return;
  api(`/api/posts/${postId}`, {
    method: 'PUT',
    body: { content: newContent }
  }).then(() => loadPosts()).catch(err => alert('Gagal: ' + err.message));
}

function openCreateModal() {
  editingPostId = null;
  document.getElementById('modalPostContent').value = '';
  document.getElementById('modalPostImage').value = '';
  document.getElementById('postModalTitle').textContent = 'Buat Postingan';
  document.getElementById('postModal').classList.add('active');
}

function closeCreateModal() {
  document.getElementById('postModal').classList.remove('active');
}

async function submitPost() {
  const content = document.getElementById('modalPostContent').value.trim();
  const image = document.getElementById('modalPostImage').value.trim();
  if (!content && !image) {
    alert('Isi konten atau tambahkan gambar');
    return;
  }
  try {
    if (editingPostId) {
      await api(`/api/posts/${editingPostId}`, {
        method: 'PUT',
        body: { content, image }
      });
    } else {
      await api('/api/posts', {
        method: 'POST',
        body: { content, image }
      });
    }
    closeCreateModal();
    loadPosts();
  } catch (err) {
    alert('Gagal: ' + err.message);
  }
}

function openProfile() {
  window.location.href = '/profile.html';
}

function logout() {
  fetch('/api/auth/logout', { method: 'POST' }).then(() => {
    currentUser = null;
    window.location.href = '/login';
  });
}

async function init() {
  await checkAuth();
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError('loginError');
      try {
        const data = await api('/api/auth/login', {
          method: 'POST',
          body: {
            username: document.getElementById('loginUsername').value,
            password: document.getElementById('loginPassword').value
          }
        });
        currentUser = data.user;
        window.location.href = '/';
      } catch (err) {
        showError('loginError', err.message);
      }
    });
  }
  if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError('registerError');
      try {
        const data = await api('/api/auth/register', {
          method: 'POST',
          body: {
            username: document.getElementById('regUsername').value,
            name: document.getElementById('regName').value,
            password: document.getElementById('regPassword').value
          }
        });
        currentUser = data.user;
        window.location.href = '/';
      } catch (err) {
        showError('registerError', err.message);
      }
    });
  }
  if (document.getElementById('postsContainer')) {
    loadPosts();
  }
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('click', function(e) {
  if (!e.target.closest('.reactions-bar')) {
    document.querySelectorAll('.reactions-popup').forEach(el => el.classList.remove('show'));
  }
  if (!e.target.closest('.post-options-menu')) {
    document.querySelectorAll('.post-options-dropdown').forEach(el => el.classList.remove('show'));
  }
  if (!e.target.closest('.post-action') && !e.target.closest('.share-popup')) {
    document.querySelectorAll('.share-popup').forEach(el => el.classList.remove('show'));
  }
});

