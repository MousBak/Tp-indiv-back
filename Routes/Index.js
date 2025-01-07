const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const adController = require('../Controllers/AdControllers');
const auth = require('../Middleware/MiddlewareAuth');

// Routes d'authentification
router.post('/auth/register', userController.registerUser);
router.post('/auth/login', userController.Login);

// Routes utilisateurs
router.get('/users', userController.getUsers);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id', userController.updateUser);

// Routes des annonces (protégées)
router.get('/ads', adController.getAll);
router.get('/ads/:id', adController.getById);
router.post('/ads', auth, adController.create);
router.put('/ads/:id', auth, adController.update);
router.delete('/ads/:id', auth, adController.delete);

module.exports = router;