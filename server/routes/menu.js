const express = require('express');
const router = express.Router();

const menu = [
  { id: 1, name: "Classic Burger", price: 89, desc: "Carne 200g, lechuga, tomate, queso cheddar", emoji: "🍔" },
  { id: 2, name: "BBQ Smash", price: 109, desc: "Doble smash, salsa BBQ, cebolla caramelizada", emoji: "🔥" },
  { id: 3, name: "Chicken Crispy", price: 95, desc: "Pechuga empanizada, coleslaw, jalapeños", emoji: "🍗" },
  { id: 4, name: "Mushroom Swiss", price: 99, desc: "Hongos salteados, queso swiss, mostaza Dijon", emoji: "🍄" },
  { id: 5, name: "Doble Smash", price: 119, desc: "Doble carne smash, doble queso, pepinillos", emoji: "💥" },
  { id: 6, name: "Veggie Burger", price: 85, desc: "Medallón de garbanzo, aguacate, pico de gallo", emoji: "🥑" },
];

router.get('/', (req, res) => res.json(menu));

module.exports = router;