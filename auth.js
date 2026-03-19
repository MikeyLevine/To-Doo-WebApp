// auth.js — login/register UI logic
let currentUser = null;

function showAuthScreen() {
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('main-screen').style.display = 'none';
}

function showMainScreen(user) {
  currentUser = user;
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('main-screen').style.display = 'block';
  document.getElementById('username-display').textContent = user.username;
}

function showAuthError(message) {
  const el = document.getElementById('auth-error');
  el.textContent = message;
  el.style.display = 'block';
}

function clearAuthError() {
  const el = document.getElementById('auth-error');
  el.textContent = '';
  el.style.display = 'none';
}

function getCurrentUser() {
  return currentUser;
}

async function handleRegister() {
  clearAuthError();
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value;

  if (!username || !password) {
    showAuthError('Please fill in both fields.');
    return;
  }

  try {
    const user = await apiRegister(username, password);
    showMainScreen(user);
    loadLists();
  } catch (err) {
    showAuthError(err.message);
  }
}

async function handleLogin() {
  clearAuthError();
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value;

  if (!username || !password) {
    showAuthError('Please fill in both fields.');
    return;
  }

  try {
    const user = await apiLogin(username, password);
    showMainScreen(user);
    loadLists();
  } catch (err) {
    showAuthError(err.message);
  }
}

// Switch between login and register tabs
function showLoginTab() {
  document.getElementById('auth-login-tab').classList.add('active-filter');
  document.getElementById('auth-register-tab').classList.remove('active-filter');
  document.getElementById('auth-submit-btn').textContent = 'Log In';
  document.getElementById('auth-submit-btn').onclick = handleLogin;
  clearAuthError();
}

function showRegisterTab() {
  document.getElementById('auth-register-tab').classList.add('active-filter');
  document.getElementById('auth-login-tab').classList.remove('active-filter');
  document.getElementById('auth-submit-btn').textContent = 'Create Account';
  document.getElementById('auth-submit-btn').onclick = handleRegister;
  clearAuthError();
}

async function handleLogout() {
  try {
    await apiLogout();
  } catch (err) {
    // Ignore errors — always show auth screen
  }
  currentUser = null;
  showAuthScreen();
}
