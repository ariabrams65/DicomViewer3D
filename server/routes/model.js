const express = require('express');
const router = express.Router();
const { validateModelId } = require('../controllers/model');

router.get('/', validateModelId);

module.exports = router;
