const express = require('express');
const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-hackathon';

// Middleware to protect routes
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

// Get checklists for a trip
router.get('/:tripId', authMiddleware, async (req, res) => {
  try {
    const checklist = await prisma.tripChecklist.findUnique({
      where: { tripId: req.params.tripId },
      include: {
        categories: {
          include: {
            items: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });
    
    if (!checklist) {
      return res.json({ message: "No checklist found", checklist: null });
    }
    res.json({ checklist });
  } catch (error) {
    console.error('Error fetching checklist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a checklist with default categories
router.post('/:tripId', authMiddleware, async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const existing = await prisma.tripChecklist.findUnique({ where: { tripId } });
    if (existing) return res.status(400).json({ error: 'Checklist already exists' });

    const checklist = await prisma.tripChecklist.create({
      data: {
        tripId,
        categories: {
          create: [
            { name: 'Clothes' },
            { name: 'Electronics' },
            { name: 'Documents' },
            { name: 'Toiletries' }
          ]
        }
      },
      include: {
        categories: { include: { items: true } }
      }
    });
    res.status(201).json({ checklist });
  } catch (error) {
    console.error('Error creating checklist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a category
router.post('/:checklistId/categories', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.checklistCategory.create({
      data: {
        name,
        checklistId: req.params.checklistId
      },
      include: { items: true }
    });
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create an item
router.post('/categories/:categoryId/items', authMiddleware, async (req, res) => {
  try {
    const { content, priority } = req.body;
    const item = await prisma.checklistItem.create({
      data: {
        content,
        priority: priority || 'Medium',
        categoryId: req.params.categoryId
      }
    });
    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an item (e.g. toggle completion)
router.put('/items/:itemId', authMiddleware, async (req, res) => {
  try {
    const { isCompleted, content, quantity, priority, notes } = req.body;
    const item = await prisma.checklistItem.update({
      where: { id: req.params.itemId },
      data: {
        ...(isCompleted !== undefined && { isCompleted }),
        ...(content && { content }),
        ...(quantity && { quantity }),
        ...(priority && { priority }),
        ...(notes !== undefined && { notes })
      }
    });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an item
router.delete('/items/:itemId', authMiddleware, async (req, res) => {
  try {
    await prisma.checklistItem.delete({ where: { id: req.params.itemId } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
