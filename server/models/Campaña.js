const mongoose = require('mongoose');

const campanaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  filtro: {
    type: String,
    enum: ['todos', 'recurrentes', 'nuevos', 'top20'],
    default: 'todos'
  },
  destinatarios: [{
    type: String
  }],
  totalEnviados: {
    type: Number,
    default: 0
  },
  estado: {
    type: String,
    enum: ['borrador', 'enviada', 'programada'],
    default: 'borrador'
  },
  fechaProgramada: {
    type: Date,
    default: null
  },
  fechaEnvio: {
    type: Date,
    default: null
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campana', campanaSchema);