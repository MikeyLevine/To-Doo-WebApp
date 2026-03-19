// api.js — all fetch() calls to the backend
const API_BASE = 'http://localhost:3000/api';

function showSpinner() {
  const spinner = document.getElementById('spinner');
  if (spinner) spinner.style.display = 'flex';
}

function hideSpinner() {
  const spinner = document.getElementById('spinner');
  if (spinner) spinner.style.display = 'none';
}

function showError(message) {
  const el = document.getElementById('error-message');
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => {
      el.style.display = 'none';
    }, 5000);
  }
}

async function apiFetch(path, options = {}) {
  showSpinner();
  
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include', // send session cookie automatically
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } finally {
    hideSpinner();
  }
}

// Auth API
async function apiRegister(username, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

async function apiLogin(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

async function apiLogout() {
  return apiFetch('/auth/logout', { method: 'POST' });
}

async function apiGetMe() {
  return apiFetch('/auth/me');
}

// Lists API
async function apiGetLists() {
  return apiFetch('/lists');
}

async function apiCreateList(name, color) {
  return apiFetch('/lists', {
    method: 'POST',
    body: JSON.stringify({ name, color })
  });
}

async function apiDeleteList(id) {
  return apiFetch(`/lists/${id}`, { method: 'DELETE' });
}

// Tasks API
async function apiGetTasks(listId) {
  return apiFetch(`/tasks?list_id=${listId}`);
}

async function apiCreateTask(listId, text) {
  return apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify({ list_id: listId, text })
  });
}

async function apiUpdateTask(id, fields) {
  return apiFetch(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(fields)
  });
}

async function apiDeleteTask(id) {
  return apiFetch(`/tasks/${id}`, { method: 'DELETE' });
}

// Events API
async function apiGetEvents(year, month) {
  return apiFetch(`/events?year=${year}&month=${month}`);
}

async function apiCreateEvent(title, date, color, note) {
  return apiFetch('/events', {
    method: 'POST',
    body: JSON.stringify({ title, date, color, note })
  });
}

async function apiDeleteEvent(id) {
  return apiFetch(`/events/${id}`, { method: 'DELETE' });
}
