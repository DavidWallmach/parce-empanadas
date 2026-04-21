const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const elevenlabs = new ElevenLabsClient({
  apiKey: 'sk_7719f7b36e91d502ee41c4b6f03328d2279390d860a3d510'
});

const VOICE_ID = 'VmejBeYhbrcTPwDniox7';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

client.on('qr', (qr) => {
  console.log('\n📱 Escanea el QR en http://localhost:5000/qr\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Chatbot de WhatsApp conectado!');
});

async function sendVoice(msg, texto) {
  const tmpMp3 = path.join(__dirname, 'tmp_voice.mp3');
  const tmpOgg = path.join(__dirname, 'tmp_voice.ogg');

  try {
    // Generar audio con ElevenLabs
    const audioStream = await elevenlabs.textToSpeech.convert(VOICE_ID, {
      text: texto,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    });

    // Guardar MP3
    const writeStream = fs.createWriteStream(tmpMp3);
    for await (const chunk of audioStream) {
      writeStream.write(chunk);
    }
    await new Promise((resolve) => writeStream.end(resolve));

    // Convertir MP3 a OGG para Android
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -y -i "${tmpMp3}" -c:a libopus -b:a 64k "${tmpOgg}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Enviar como nota de voz
    const media = MessageMedia.fromFilePath(tmpOgg);
    await msg.reply(media, null, { sendAudioAsVoice: true });

  } catch (error) {
    console.error('Error:', error.message);
    await msg.reply(texto);
  } finally {
    if (fs.existsSync(tmpMp3)) fs.unlinkSync(tmpMp3);
    if (fs.existsSync(tmpOgg)) fs.unlinkSync(tmpOgg);
  }
}

client.on('message', async (msg) => {
  const body = msg.body.toLowerCase();

  if (body === 'hola' || body === 'hi' || body === 'buenas') {
    await sendVoice(msg,
      'Hola! Bienvenido a Burger RAVE. ' +
      'Escribe 1 para ver el menú, ' +
      '2 para hacer un pedido, ' +
      '3 para horarios, ' +
      '4 para ubicación.'
    );
  }
  else if (body === '1' || body === 'menu' || body === 'menú') {
    await sendVoice(msg,
      'Nuestro menú es el siguiente. ' +
      'Classic Burger por 89 pesos. ' +
      'BBQ Smash por 109 pesos. ' +
      'Chicken Crispy por 95 pesos. ' +
      'Mushroom Swiss por 99 pesos. ' +
      'Doble Smash por 119 pesos. ' +
      'Veggie Burger por 85 pesos. ' +
      'Escribe 2 para hacer tu pedido.'
    );
  }
  else if (body === '2' || body === 'pedido' || body === 'pedir') {
    await sendVoice(msg,
      'Para hacer tu pedido visita nuestra página web y agrega lo que quieras al carrito. ' +
      'O dinos directamente aquí qué quieres ordenar.'
    );
  }
  else if (body === '3' || body === 'horarios' || body === 'horario') {
    await sendVoice(msg,
      'Nuestros horarios son los siguientes. ' +
      'De lunes a viernes de 12 del mediodía a 10 de la noche. ' +
      'Sábado y domingo de 11 de la mañana a 11 de la noche. ' +
      'Te esperamos!'
    );
  }
  else if (body === '4' || body === 'ubicacion' || body === 'ubicación') {
    await sendVoice(msg,
      'Estamos ubicados en Ciudad Juárez, Chihuahua. ' +
      'Escribe hola para ver el menú principal.'
    );
  }
  else {
    await sendVoice(msg,
      'No entendí tu mensaje. ' +
      'Escribe hola para ver las opciones disponibles.'
    );
  }
});

client.initialize();

module.exports = client;