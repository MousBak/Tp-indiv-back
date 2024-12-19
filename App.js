const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import de la route principale
const routes = require('./Routes/Index');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leboncoin_db')
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.log('Erreur de connexion à MongoDB:', err));

// Utilisation des routes
app.use('/api', routes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Une erreur est survenue sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


// Configuration du port
const PORT = process.env.PORT || 8080;

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;