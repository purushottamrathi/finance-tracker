const express = require('express');
const UserSettings = require('../models/UserSettings');
const protect = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET /api/settings
router.get('/', async (req, res, next) => {
  try {
    const settings = await UserSettings.findOneAndUpdate(
      { user: req.user._id },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(settings);
  } catch (err) { next(err); }
});

// PUT /api/settings
router.put('/', async (req, res, next) => {
  try {
    const { startingBalance, monthlyBudget } = req.body;
    const update = {};
    if (startingBalance !== undefined) update.startingBalance = Number(startingBalance);
    if (monthlyBudget !== undefined) update.monthlyBudget = Number(monthlyBudget);

    const settings = await UserSettings.findOneAndUpdate(
      { user: req.user._id },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(settings);
  } catch (err) { next(err); }
});

module.exports = router;
