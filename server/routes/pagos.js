const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51TP6sbBHRqR6pOTIkJH4i9mbpbEqj2VJw3J5qnMbaaKOqFKil9EhkzbpiyWZMGpdW5xPVdLRJk2SCaN29dOhU8lf00Pf9wEqgt');

// Crear sesión de pago
router.post('/crear-sesion', async (req, res) => {
  const { items, pedidoId, telefono } = req.body;

  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.nombre,
          description: `Parce Empanadas - ${item.nombre}`
        },
        unit_amount: item.precio * 100
      },
      quantity: item.cantidad
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:5173/pago-exitoso?pedido=${pedidoId}`,
      cancel_url: `http://localhost:5173/pago-cancelado`,
      metadata: { pedidoId, telefono }
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error Stripe:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar pago
router.get('/verificar/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      pagado: session.payment_status === 'paid',
      status: session.payment_status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;