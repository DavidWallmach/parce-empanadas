import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Footer from './components/Footer'
import Cocina from './pages/Cocina'
import Repartidor from './pages/Repartidor'
import PagoExitoso from './pages/PagoExitoso'
import PagoCancelado from './pages/PagoCancelado'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Tienda() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) return prev.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i)
      return [...prev, {...item, qty: 1}]
    })
  }

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Toaster position="top-right" />
      <Navbar cartCount={totalItems} onCartClick={() => setShowCart(true)} />
      <Hero />
      <Menu onAdd={addToCart} />
      {showCart && <Cart cart={cart} setCart={setCart} onClose={() => setShowCart(false)} />}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/cocina" element={<Cocina />} />
        <Route path="/repartidor" element={<Repartidor />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/pago-cancelado" element={<PagoCancelado />} />
      </Routes>
    </BrowserRouter>
  )
}