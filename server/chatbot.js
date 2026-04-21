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
    const audioStream = await elevenlabs.textToSpeech.convert(VOICE_ID, {
      text: texto,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    });

    const writeStream = fs.createWriteStream(tmpMp3);
    for await (const chunk of audioStream) {
      writeStream.write(chunk);
    }
    await new Promise((resolve) => writeStream.end(resolve));

    await new Promise((resolve, reject) => {
      exec(`ffmpeg -y -i "${tmpMp3}" -c:a libopus -b:a 64k "${tmpOgg}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

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

  if (body === 'hola' || body === 'hi' || body === 'buenas' || body === 'buenos dias' || body === 'buenas tardes') {
    await sendVoice(msg,
      'Quiubo parce! Bienvenido a Parce Empanadas. ' +
      'Las mejores empanadas colombianas en Ciudad Juarez. ' +
      'Escribe 1 para ver el menu, ' +
      '2 para hacer un pedido, ' +
      '3 para pedir para un evento, ' +
      '4 para horarios, ' +
      '5 para ubicacion.'
    );
  }
  else if (body === '1' || body === 'menu' || body === 'menú') {
    await sendVoice(msg,
      'Parce te cuento lo que tenemos. ' +
      'Empanada de carne a 20 pesitos. ' +
      'Empanada de pollo a 20 pesitos. ' +
      'Mixta de 6 unidades a 110 pesos. ' +
      'Docena de carne a 200 pesos. ' +
      'Docena de pollo a 200 pesos. ' +
      'Combo evento de 50 empanadas a 950 pesos. ' +
      'Escribe 2 para pedir o 3 si es para un evento.'
    );
  }
  else if (body === '2' || body === 'pedido' || body === 'pedir' || body === 'quiero pedir') {
    await sendVoice(msg,
      'Listo parce! Dime que vas a querer. ' +
      'Escribe A si quieres que te lo llevemos a tu casa. ' +
      'O escribe B si prefieres pasar a recogerlo.'
    );
  }
  else if (body === 'a') {
    await sendVoice(msg,
      'Chevere parce! Mandame tu ubicacion por favor. ' +
      'Puedes compartir tu ubicacion en tiempo real desde WhatsApp. ' +
      'O si prefieres escribe tu direccion completa.'
    );
  }
  else if (body === 'b') {
    await sendVoice(msg,
      'Perfecto parce! Nos encuentras en Ciudad Juarez, Chihuahua. ' +
      'Cuando llegues avisanos y te tenemos listas tus empanadas.'
    );
  }
  else if (body === '3' || body === 'evento' || body === 'eventos') {
    await sendVoice(msg,
      'Uy que chimba parce, vas a hacer un evento! ' +
      'Dime cuantas empanadas necesitas y para que fecha. ' +
      'Tenemos combos desde 50 empanadas en adelante. ' +
      'Un administrador te contactara para darte la cotizacion.'
    );
  }
  else if (body === '4' || body === 'horarios' || body === 'horario') {
    await sendVoice(msg,
      'Parce estamos abiertos de lunes a viernes de 12 del medio dia a 10 de la noche. ' +
      'Sabados y domingos de 11 de la manana a 11 de la noche. ' +
      'Te esperamos con las empanadas calienticas!'
    );
  }
  else if (body === '5' || body === 'ubicacion' || body === 'ubicación' || body === 'donde') {
    await sendVoice(msg,
      'Parce nos encontramos en Ciudad Juarez, Chihuahua. ' +
      'Escríbenos y con gusto te damos la direccion exacta.'
    );
  }
  else if (body.includes('precio') || body.includes('cuanto')) {
    await sendVoice(msg,
      'Parce nuestras empanadas estan a 20 pesitos cada una. ' +
      'La mixta de 6 a 110, la docena a 200 y el combo evento de 50 a 950 pesos. ' +
      'Todas recien hechas y calienticas!'
    );
  }
  else {
    await sendVoice(msg,
      'Ay parce no te entendi bien. ' +
      'Escribe hola para ver todas las opciones disponibles.'
    );
  }
});

client.initialize();

module.exports = client;