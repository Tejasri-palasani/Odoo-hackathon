const express = require('express');
const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-hackathon';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get journals for the current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const journals = await prisma.travelJournal.findMany({
      where: { userId: req.user.userId },
      include: { entries: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ journals });
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a journal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const journal = await prisma.travelJournal.create({
      data: {
        title,
        userId: req.user.userId
      },
      include: { entries: true }
    });
    res.status(201).json({ journal });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create an entry
router.post('/:journalId/entries', authMiddleware, async (req, res) => {
  try {
    const { title, content, mood, location } = req.body;
    const entry = await prisma.journalEntry.create({
      data: {
        title,
        content,
        mood,
        location,
        journalId: req.params.journalId
      }
    });
    res.status(201).json({ entry });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an entry
router.delete('/entries/:entryId', authMiddleware, async (req, res) => {
  try {
    await prisma.journalEntry.delete({ where: { id: req.params.entryId } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
