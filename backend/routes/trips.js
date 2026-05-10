const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-hackathon';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, startDate, endDate, destinations, stops, budget, currency, collaborators } = req.body;
    
    const ownerId = req.user.userId;

    // Basic validation
    if (!title) return res.status(400).json({ error: 'Title is required' });

    // A default cover image
    const defaultCover = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop";

    // Start a transaction to create everything
    const newTrip = await prisma.$transaction(async (tx) => {
      // 1. Create the Trip
      const trip = await tx.trip.create({
        data: {
          title,
          destination: (destinations && destinations[0]) || 'Unknown',
          duration: `${startDate || ''} to ${endDate || ''}`,
          budget: parseFloat(budget) || 0,
          status: 'Planned',
          category: category || 'Adventure',
          coverImage: defaultCover,
          ownerId: ownerId,
        }
      });

      // 2. Create Stops
      if (stops && stops.length > 0) {
        await tx.tripStop.createMany({
          data: stops.map((stop, index) => ({
            tripId: trip.id,
            city: stop.city || 'Unknown',
            arrival: new Date(stop.arrivalDate || new Date()),
            departure: new Date(stop.departureDate || new Date()),
            transport: stop.transport || 'Flight',
            order: index
          }))
        });
      }

      // 3. Create Collaborators
      if (collaborators && collaborators.length > 0) {
        await tx.tripCollaborator.createMany({
          data: collaborators.map(collabId => ({
            tripId: trip.id,
            userId: collabId,
            role: 'Editor'
          }))
        });
      }

      // 4. Initialize Budget Planner
      await tx.tripBudget.create({
        data: {
          tripId: trip.id,
          currency: currency || 'USD',
          totalBudget: parseFloat(budget) || 0,
        }
      });

      // 5. Initialize Checklist
      const checklist = await tx.tripChecklist.create({
        data: {
          tripId: trip.id
        }
      });

      // Initialize default checklist categories
      await tx.checklistCategory.createMany({
        data: [
          { name: 'Essentials', checklistId: checklist.id },
          { name: 'Documents', checklistId: checklist.id }
        ]
      });

      return trip;
    });

    // Notify connected clients via Socket.IO
    const io = req.app.get('io');
    if (io && collaborators && collaborators.length > 0) {
      collaborators.forEach(collabId => {
        io.emit(`new-trip-${collabId}`, newTrip);
      });
    }

    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Get trips for the user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId: userId } } }
        ]
      },
      include: {
        collaborators: {
          include: { user: { select: { id: true, name: true, avatar: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(trips);
  } catch (error) {
    console.error('Fetch trips error:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

module.exports = router;
