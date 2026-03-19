// Express app entry point
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json());

// Session configuration (using memory store for simplicity)
app.use(session({
  secret: 'todo-app-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Serve the frontend files from the todo-app/ root
app.use(express.static(path.join(__dirname, '..')));

// Mount API routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const listRoutes = require('./routes/lists');
app.use('/api/lists', listRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
