// Task routes: GET, POST, PATCH, DELETE
const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/tasks?list_id=X — get all tasks for a list
router.get('/', requireAuth, (req, res) => {
  const { list_id } = req.query;

  if (!list_id) {
    return res.status(400).json({ error: 'list_id query parameter is required' });
  }

  // Verify the list belongs to the user
  const list = db.getListById(parseInt(list_id));

  if (!list || list.user_id !== req.session.userId) {
    return res.status(404).json({ error: 'List not found' });
  }

  const tasks = db.getTasks(parseInt(list_id));
  res.json(tasks);
});

// POST /api/tasks — create a new task
router.post('/', requireAuth, (req, res) => {
  const { list_id, text } = req.body;

  if (!list_id || !text || text.trim() === '') {
    return res.status(400).json({ error: 'list_id and text are required' });
  }

  // Verify the list belongs to the user
  const list = db.getListById(parseInt(list_id));

  if (!list || list.user_id !== req.session.userId) {
    return res.status(404).json({ error: 'List not found' });
  }

  const task = db.createTask({
    list_id: parseInt(list_id),
    user_id: req.session.userId,
    text: text.trim()
  });

  res.status(201).json(task);
});

// PATCH /api/tasks/:id — update task text or done status
router.patch('/:id', requireAuth, (req, res) => {
  const task = db.getTaskById(parseInt(req.params.id));

  if (!task || task.user_id !== req.session.userId) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const text = req.body.text !== undefined ? req.body.text.trim() : task.text;
  const done = req.body.done !== undefined ? (req.body.done ? 1 : 0) : task.done;

  const updated = db.updateTask(parseInt(req.params.id), { text, done });
  res.json(updated);
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', requireAuth, (req, res) => {
  const task = db.getTaskById(parseInt(req.params.id));

  if (!task || task.user_id !== req.session.userId) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.deleteTask(parseInt(req.params.id));
  res.json({ message: 'Task deleted' });
});

module.exports = router;
