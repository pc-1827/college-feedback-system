const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/login/login.controller');

// Register route
router.post('/register', loginController.register);

// Login route
router.post('/login', loginController.login);

module.exports = router;
