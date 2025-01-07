const User = require('../Models/ModelsUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  // Inscription
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' });
      }

      // Créer le nouvel utilisateur
      const user = new User({ username, email, password });
      await user.save();

      // Générer le token
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '24h' });
      
      res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
    }
  },

  

  // Connexion
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer le token
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '24h' });
      
      res.json({ token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
  }
};


const getUsers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.username) {
      filter.username = { $regex: req.query.username, $options: "i" };
    }

    const users = await User.find(filter).select("-password");
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = authController;