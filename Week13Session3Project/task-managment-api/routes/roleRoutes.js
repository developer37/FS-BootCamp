// Role Routes
// This file exposes the role data so students can see what each role
// is allowed to do at a glance.

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// GET /roles - List every role and its permissions (public for tutorial clarity)
router.get('/roles', roleController.getAllRoles);

// Export the router
module.exports = router;
