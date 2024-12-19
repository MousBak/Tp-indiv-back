const Ad = require('../Models/ModelsAd');

const adController = {
  // Récupérer toutes les annonces
  getAll: async (req, res) => {
    try {
      const ads = await Ad.find().populate('author', 'username');
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des annonces', error: error.message });
    }
  },

  // Récupérer une annonce par ID
  getById: async (req, res) => {
    try {
      const ad = await Ad.findById(req.params.id).populate('author', 'username');
      if (!ad) {
        return res.status(404).json({ message: 'Annonce non trouvée' });
      }
      res.json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'annonce', error: error.message });
    }
  },

  // Créer une annonce
  create: async (req, res) => {
    try {
      const { title, description, price, category } = req.body;
      const ad = new Ad({
        title,
        description,
        price,
        category,
        author: req.userId // Récupéré du middleware auth
      });
      await ad.save();
      res.status(201).json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'annonce', error: error.message });
    }
  },

  // Mettre à jour une annonce
  update: async (req, res) => {
    try {
      const { title, description, price, category } = req.body;
      const ad = await Ad.findByIdAndUpdate(
        req.params.id,
        { title, description, price, category },
        { new: true }
      );
      if (!ad) {
        return res.status(404).json({ message: 'Annonce non trouvée' });
      }
      res.json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'annonce', error: error.message });
    }
  },

  // Supprimer une annonce
  delete: async (req, res) => {
    try {
      const ad = await Ad.findByIdAndDelete(req.params.id);
      if (!ad) {
        return res.status(404).json({ message: 'Annonce non trouvée' });
      }
      res.json({ message: 'Annonce supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce', error: error.message });
    }
  }
};

module.exports = adController;