const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthControllers');
const adController = require('../Controllers/AdControllers');
const auth = require('../Middleware/MiddlewareAuth');
const{
    updateUser,
    deleteUser,
    getUsers,
    registerUser,

}= require("../Controllers/userController");

// Routes d'authentification
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/users', getUsers)
router.delete('/users/:id', deleteUser)
router.put('/users/:id', updateUser )

// Routes des annonces (protégées)
router.get('/ads', adController.getAll);
router.get('/ads/:id', adController.getById);
router.post('/ads', auth, adController.create);
router.put('/ads/:id', auth, adController.update);
router.delete('/ads/:id', auth, adController.delete);

module.exports = router;