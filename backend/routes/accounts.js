const express = require('express');
const protect = require('../middleware/auth');
const Account = require('../models/Account');

const router = express.Router();
router.use(protect);

// GET /api/accounts
router.get('/', async (req, res, next) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    res.json(accounts);
  } catch (err) { next(err); }
});

// POST /api/accounts
router.post('/', async (req, res, next) => {
  try {
    const acc = new Account({ ...req.body, user: req.user._id });
    await acc.save();
    res.status(201).json(acc);
  } catch (err) { next(err); }
});

// PUT /api/accounts/:id
router.put('/:id', async (req, res, next) => {
  try {
    const acc = await Account.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!acc) return res.status(404).json({ message: 'Account not found' });
    res.json(acc);
  } catch (err) { next(err); }
});

// DELETE /api/accounts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const acc = await Account.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!acc) return res.status(404).json({ message: 'Account not found' });
    res.json({ message: 'Account deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
