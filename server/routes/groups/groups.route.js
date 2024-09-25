const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const groupsController = require('../../controllers/groups/groups.controller');

// Create a group
router.post('/create', auth, groupsController.createGroup);

// View all groups of a teacher
router.get('/view', auth, groupsController.viewGroups);

// Edit a group
router.put('/edit/:groupId', auth, groupsController.editGroup);

// Delete a group
router.delete('/delete/:groupId', auth, groupsController.deleteGroup);

module.exports = router;
