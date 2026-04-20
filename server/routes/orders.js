const express = require('express');
const router = express.Router();

router.post('/whatsapp', (req, res) => {
  const { items, name, notes } = req.body;
  const phone = process.env.WHATSAPP_NUMBER;

  const itemsList = items.map(i => `• ${i.qty}x ${i.name} - $${i.price * i.qty}`).join('\n');
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const message = encodeURIComponent(
    `🍔 *Nuevo Pedido - Burger Shop*\n\n` +
    `👤 Cliente: ${name}\n\n` +
    `📋 Pedido:\n${itemsList}\n\n` +
    `💰 Total: $${total} MXN\n\n` +
    `📝 Notas: ${notes || 'Ninguna'}`
  );

  const url = `https://wa.me/${phone}?text=${message}`;
  res.json({ url });
});

module.exports = router;