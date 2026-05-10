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

// Get budget for a trip
router.get('/:tripId', authMiddleware, async (req, res) => {
  try {
    const budget = await prisma.tripBudget.findUnique({
      where: { tripId: req.params.tripId },
      include: {
        expenses: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!budget) {
      return res.json({ message: "No budget found", budget: null });
    }
    res.json({ budget });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a budget
router.post('/:tripId', authMiddleware, async (req, res) => {
  try {
    const { totalBudget, currency } = req.body;
    const tripId = req.params.tripId;
    const existing = await prisma.tripBudget.findUnique({ where: { tripId } });
    
    if (existing) {
      // Update existing
      const updated = await prisma.tripBudget.update({
        where: { tripId },
        data: { totalBudget, currency },
        include: { expenses: true }
      });
      return res.json({ budget: updated });
    }

    const budget = await prisma.tripBudget.create({
      data: {
        tripId,
        totalBudget: totalBudget || 0,
        currency: currency || 'USD'
      },
      include: { expenses: true }
    });
    res.status(201).json({ budget });
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add an expense
router.post('/:budgetId/expenses', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, date, priority, notes } = req.body;
    const expense = await prisma.budgetExpense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category: category || 'Miscellaneous',
        date: date ? new Date(date) : null,
        priority,
        notes,
        budgetId: req.params.budgetId
      }
    });
    res.status(201).json({ expense });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an expense
router.delete('/expenses/:expenseId', authMiddleware, async (req, res) => {
  try {
    await prisma.budgetExpense.delete({ where: { id: req.params.expenseId } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
