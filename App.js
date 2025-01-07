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

// Configuration MongoDB avec retry
const connectWithRetry = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/leboncoin-clone';
    console.log('Tentative de connexion à MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connexion à MongoDB réussie');
    } catch (err) {
        console.error('Erreur de connexion à MongoDB:', err);
        console.log('Nouvelle tentative dans 5 secondes...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Première tentative de connexion
connectWithRetry();

// Gestion de la déconnexion MongoDB
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB déconnecté ! Tentative de reconnexion...');
    connectWithRetry();
});

// Route racine
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API du clone Leboncoin' });
});

// Monter les routes
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

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Configuration du port
const PORT = process.env.PORT || 8081;

// Démarrage du serveur une fois MongoDB connecté
mongoose.connection.once('open', () => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
});

module.exports = app;