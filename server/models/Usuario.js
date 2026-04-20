const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  telefono: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    default: ''
  },
  direcciones: [{
    tipo: String,
    direccion: String,
    lat: Number,
    lng: Number
  }],
  totalPedidos: {
    type: Number,
    default: 0
  },
  totalGastado: {
    type: Number,
    default: 0
  },
  esClienteRecurrente: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaEliminacion: {
    type: Date,
    default: null
  },
  activo: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);