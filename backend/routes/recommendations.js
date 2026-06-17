const express = require('express');
const protect = require('../middleware/auth');
const { getRecommendationsForUser } = require('../services/recommendation.service');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const recs = await getRecommendationsForUser(req.user._id);
    res.json(recs);
  } catch (err) { next(err); }
});

module.exports = router;
