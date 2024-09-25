const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const responsesController = require('../../controllers/responses/responses.controller');

// Create a new response
router.post('/create', auth, responsesController.createResponse);

// View a single response by response ID
router.get('/view/:responseId', auth, responsesController.viewResponse);

module.exports = router;
