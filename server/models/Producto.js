const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  precio: {
    type: Number,
    required: true
  },
  historialPrecios: [{
    precio: Number,
    fecha: {
      type: Date,
      default: Date.now
    }
  }],
  categoria: {
    type: String,
    default: 'hamburguesa'
  },
  disponible: {
    type: Boolean,
    default: true
  },
  imagen: {
    type: String,
    default: ''
  },
  totalVendido: {
    type: Number,
    default: 0
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Producto', productoSchema);