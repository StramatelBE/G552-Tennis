const express = require('express');

const router = express.Router();

router.get('/date', (req, res) => {
    const serverDate = new Date();
    res.json({ date: serverDate });
  });

  
module.exports = router;



