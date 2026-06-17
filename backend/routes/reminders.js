const express = require('express');
const protect = require('../middleware/auth');
const Reminder = require('../models/Reminder');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const list = await Reminder.find({ user: req.user._id }).sort({ date: 1 });
    res.json(list);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const r = new Reminder({ ...req.body, user: req.user._id });
    await r.save();
    res.status(201).json(r);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const update = req.body;
    const r = await Reminder.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: update }, { new: true });
    if (!r) return res.status(404).json({ message: 'Reminder not found' });
    res.json(r);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const r = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!r) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
