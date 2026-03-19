// Database connection and schema (using JSON file storage for simplicity)
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

// In-memory database
let db = {
  users: [],
  lists: [],
  tasks: [],
  events: []
};

// Load existing data or create new database
function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      db = JSON.parse(data);
    }
  } catch (err) {
    console.log('Creating new database...');
  }
}

// Save database to file
function saveDb() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Initialize
loadDb();

// Helper functions
function getUsers() { return db.users; }
function getUserByUsername(username) { return db.users.find(u => u.username === username); }
function getUserById(id) { return db.users.find(u => u.id === id); }
function createUser(user) {
  const maxId = db.users.reduce((max, u) => Math.max(max, u.id), 0);
  user.id = maxId + 1;
  user.created_at = new Date().toISOString();
  db.users.push(user);
  saveDb();
  return user;
}

function getLists(userId) { return db.lists.filter(l => l.user_id === userId); }
function getListById(id) { return db.lists.find(l => l.id === id); }
function createList(list) {
  const maxId = db.lists.reduce((max, l) => Math.max(max, l.id), 0);
  list.id = maxId + 1;
  list.created_at = new Date().toISOString();
  db.lists.push(list);
  saveDb();
  return list;
}
function deleteList(id) {
  db.lists = db.lists.filter(l => l.id !== id);
  db.tasks = db.tasks.filter(t => t.list_id !== id);
  saveDb();
}

function getTasks(listId) { return db.tasks.filter(t => t.list_id === listId); }
function getTaskById(id) { return db.tasks.find(t => t.id === id); }
function createTask(task) {
  const maxId = db.tasks.reduce((max, t) => Math.max(max, t.id), 0);
  task.id = maxId + 1;
  task.done = task.done || 0;
  task.created_at = new Date().toISOString();
  db.tasks.push(task);
  saveDb();
  return task;
}
function updateTask(id, updates) {
  const task = db.tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, updates);
    saveDb();
  }
  return task;
}
function deleteTask(id) {
  db.tasks = db.tasks.filter(t => t.id !== id);
  saveDb();
}

function getEvents(userId, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return db.events.filter(e => e.user_id === userId && e.date.startsWith(prefix));
}
function createEvent(event) {
  const maxId = db.events.reduce((max, e) => Math.max(max, e.id), 0);
  event.id = maxId + 1;
  event.created_at = new Date().toISOString();
  db.events.push(event);
  saveDb();
  return event;
}
function deleteEvent(id) {
  db.events = db.events.filter(e => e.id !== id);
  saveDb();
}

module.exports = {
  db,
  getUsers,
  getUserByUsername,
  getUserById,
  createUser,
  getLists,
  getListById,
  createList,
  deleteList,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getEvents,
  createEvent,
  deleteEvent
};
