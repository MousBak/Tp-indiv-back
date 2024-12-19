const bcrypt = require("bcryptjs");
const User = require("../Models/ModelsUser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).send({ error: "Utilisateur introuvable" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const Login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send("Utilisateur introuvable");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).send("Mot de passe incorrect");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, // payload : chargement des données à transporter
      process.env.JWT_SECRET, // clé secrète pour protéger le token
      { expiresIn: process.env.JWT_EXPIRES_IN } // les options du token, en locurrence la durée de validité
    );

    res.status(200).send({ message: "Connecté", token });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log("deleteUsers", req.params.id)
    if (!user) {
      return res.status(404).send({ error: "Utilisateur introuvable" });
    }
    res.status(200).send({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).send({ message: error.message });
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


const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.password) {
      return res.status(400).send({ error: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { registerUser , Login , updateUser , deleteUser , getUsers};