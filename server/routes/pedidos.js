const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Usuario = require('../models/Usuario');

// Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuario').sort({ fechaPedido: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener pedidos por estado
router.get('/estado/:estado', async (req, res) => {
  try {
    const pedidos = await Pedido.find({ estado: req.params.estado })
      .populate('usuario')
      .sort({ fechaPedido: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear pedido
router.post('/', async (req, res) => {
  try {
    const { telefono, items, total, metodoPago, tipoEntrega, direccionEntrega } = req.body;

    // Buscar o crear usuario
    let usuario = await Usuario.findOne({ telefono });
    if (!usuario) {
      usuario = new Usuario({ telefono });
      await usuario.save();
    }

    // Generar código de confirmación
    const codigoConfirmacion = Math.random().toString(36).substring(2, 8).toUpperCase();

    const pedido = new Pedido({
      usuario: usuario._id,
      telefono,
      items,
      total,
      metodoPago,
      tipoEntrega,
      direccionEntrega,
      codigoConfirmacion
    });

    await pedido.save();

    // Actualizar stats del usuario
    await Usuario.findByIdAndUpdate(usuario._id, {
      $inc: { totalPedidos: 1, totalGastado: total },
      esClienteRecurrente: usuario.totalPedidos >= 3
    });

    res.json({ pedido, codigoConfirmacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado del pedido
router.put('/:id/estado', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Estadísticas de ventas
router.get('/stats/ventas', async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ventasHoy = await Pedido.aggregate([
      { $match: { fechaPedido: { $gte: hoy }, estado: 'entregado' } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ventasMes = await Pedido.aggregate([
      { $match: { fechaPedido: { $gte: inicioMes }, estado: 'entregado' } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]);

    res.json({
      hoy: ventasHoy[0] || { total: 0, count: 0 },
      mes: ventasMes[0] || { total: 0, count: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;