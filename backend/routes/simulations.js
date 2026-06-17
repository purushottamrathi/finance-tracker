const express = require('express');
const protect = require('../middleware/auth');
const { simulateSIP } = require('../services/simulation.service');
const Simulation = require('../models/Simulation');

const router = express.Router();
router.use(protect);

// POST /api/simulations/run  - run simulation (not persisted)
router.post('/run', async (req, res, next) => {
  try {
    const params = req.body;
    const result = simulateSIP(params);
    res.json({ params, result });
  } catch (err) { next(err); }
});

// POST /api/simulations - save a simulation
router.post('/', async (req, res, next) => {
  try {
    const sim = new Simulation({ user: req.user._id, ...req.body });
    await sim.save();
    res.status(201).json(sim);
  } catch (err) { next(err); }
});

// GET /api/simulations
router.get('/', async (req, res, next) => {
  try {
    const list = await Simulation.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(list);
  } catch (err) { next(err); }
});

module.exports = router;
