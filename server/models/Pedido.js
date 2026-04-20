const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  items: [{
    nombre: String,
    precio: Number,
    cantidad: Number
  }],
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_cocina', 'en_camino', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta'],
    default: 'efectivo'
  },
  tipoEntrega: {
    type: String,
    enum: ['domicilio', 'recoger'],
    default: 'domicilio'
  },
  direccionEntrega: {
    type: String,
    default: ''
  },
  codigoConfirmacion: {
    type: String,
    default: ''
  },
  calificacionEntrega: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  calificacionProducto: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  comentario: {
    type: String,
    default: ''
  },
  fechaPedido: {
    type: Date,
    default: Date.now
  },
  fechaEntrega: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Pedido', pedidoSchema);