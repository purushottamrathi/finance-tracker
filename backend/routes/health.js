const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const origin = req.headers.origin || req.headers['referer'] || null;
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    origin,
    headers: {
      host: req.headers.host,
      'x-forwarded-for': req.headers['x-forwarded-for'] || null,
    },
    time: new Date().toISOString(),
  });
});

module.exports = router;
