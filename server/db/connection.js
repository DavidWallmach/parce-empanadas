const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://jaackwallmach_db_user:Practica2026!@cluster0.0kmqcsb.mongodb.net/burgershop?appName=Cluster0';
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB conectado!');
  } catch (error) {
    console.error('❌ Error conectando MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;