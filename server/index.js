const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const connectDB = require('./db/connection');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar MongoDB
connectDB();

// Rutas
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const usuarioRoutes = require('./routes/usuarios');
const pedidoRoutes = require('./routes/pedidos');

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Chatbot QR
let qrImageData = '';
if (process.env.NODE_ENV !== 'production') {
  const botClient = require('./chatbot');
  botClient.on('qr', async (qr) => {
    qrImageData = await QRCode.toDataURL(qr);
  });
}

app.get('/qr', (req, res) => {
  if (qrImageData) {
    res.send(`<img src="${qrImageData}" style="width:300px"/>`);
  } else {
    res.send('QR no disponible aun, espera unos segundos y recarga la pagina.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));