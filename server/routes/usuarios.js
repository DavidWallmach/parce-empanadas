const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find({ activo: true });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuario por teléfono
router.get('/:telefono', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ telefono: req.params.telefono });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear o actualizar usuario
router.post('/', async (req, res) => {
  try {
    const { telefono, nombre } = req.body;
    let usuario = await Usuario.findOne({ telefono });
    if (!usuario) {
      usuario = new Usuario({ telefono, nombre });
      await usuario.save();
      console.log(`✅ Nuevo usuario: ${telefono}`);
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top 20 mejores clientes
router.get('/stats/top20', async (req, res) => {
  try {
    const top20 = await Usuario.find({ activo: true })
      .sort({ totalGastado: -1 })
      .limit(20);
    res.json(top20);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;