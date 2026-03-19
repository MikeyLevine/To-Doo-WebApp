// Event routes: GET, POST, DELETE
const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/events?year=YYYY&month=MM — get events for a month
router.get('/', requireAuth, (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: 'year and month query parameters are required' });
  }

  const events = db.getEvents(req.session.userId, year, month);
  res.json(events);
});

// POST /api/events — create a new event
router.post('/', requireAuth, (req, res) => {
  const { title, date, color, note } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'title and date are required' });
  }

  // Validate date format: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date must be in YYYY-MM-DD format' });
  }

  const event = db.createEvent({
    user_id: req.session.userId,
    title: title.trim(),
    date,
    color: color || '#e63030',
    note: note || ''
  });

  res.status(201).json(event);
});

// DELETE /api/events/:id — delete an event
router.delete('/:id', requireAuth, (req, res) => {
  const events = db.getEvents(req.session.userId);
  const event = events.find(e => e.id === parseInt(req.params.id));

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  db.deleteEvent(parseInt(req.params.id));
  res.json({ message: 'Event deleted' });
});

module.exports = router;
