const express = require('express');
const protect = require('../middleware/auth');
const Milestone = require('../models/Milestone');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const list = await Milestone.find({ user: req.user._id }).sort({ thresholdAmount: 1 });
    res.json(list);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user._id };
    const m = await Milestone.findOneAndUpdate({ user: req.user._id, key: data.key }, data, { upsert: true, new: true });
    res.status(201).json(m);
  } catch (err) { next(err); }
});

module.exports = router;
