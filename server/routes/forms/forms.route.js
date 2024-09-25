const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const formsController = require('../../controllers/forms/forms.controller');

// Create a form
router.post('/create', auth, formsController.createForm);

// View a form by form ID
router.get('/view/:formId', auth, formsController.viewForm);

// Delete a form by form ID
router.delete('/delete/:formId', auth, formsController.deleteForm);

module.exports = router;
