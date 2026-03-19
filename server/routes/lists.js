// List routes: GET, POST, DELETE
const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/lists — get all lists for current user
router.get('/', requireAuth, (req, res) => {
  const lists = db.getLists(req.session.userId);
  res.json(lists);
});

// POST /api/lists — create a new list
router.post('/', requireAuth, (req, res) => {
  const { name, color } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'List name is required' });
  }

  const list = db.createList({
    user_id: req.session.userId,
    name: name.trim(),
    color: color || '#e63030'
  });

  res.status(201).json(list);
});

// DELETE /api/lists/:id — delete a list (and its tasks via CASCADE)
router.delete('/:id', requireAuth, (req, res) => {
  const list = db.getListById(req.params.id);

  if (!list || list.user_id !== req.session.userId) {
    return res.status(404).json({ error: 'List not found' });
  }

  db.deleteList(parseInt(req.params.id));
  res.json({ message: 'List deleted' });
});

module.exports = router;
