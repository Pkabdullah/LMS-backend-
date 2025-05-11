
const express = require('express');
const router = express.Router();
const { restrictTo } = require("../middleware/auth");

// Dynamic route for Admin pages (e.g. /Admins/Home, /Admins/Dashboard)
router.get('/:route', restrictTo(['admin']), (req, res) => {
  const { route } = req.params;
   
  res.json({ message: `Welcome to the Admin ${route} page` });
});

module.exports = router;
