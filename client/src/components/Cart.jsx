import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Cart({ cart, setCart, onClose }) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const removeItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setCart(prev => prev.map(i => i.id === id ? {...i, qty} : i))
  }

  const handleOrder = async () => {
    if (!name.trim()) {
      toast.error('Por favor escribe tu nombre')
      return
    }
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }
    try {
      const res = await axios.post('https://burger-shop-server.onrender.com/api/orders/whatsapp', {
        items: cart,
        name,
        notes
      })
      window.open(res.data.url, '_blank')
      setCart([])
      onClose()
      toast.success('¡Pedido enviado por WhatsApp! 🎉')
    } catch (error) {
      toast.error('Error al procesar el pedido')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-zinc-900 h-full overflow-y-auto border-l border-zinc-700 flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-2xl font-black text-white">🛒 Tu Pedido</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 p-6">
          {cart.length === 0 ? (
            <p className="text-zinc-500 text-center mt-12">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4">
                  <span className="text-3xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-amber-400 font-bold">${item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 bg-zinc-700 rounded-full text-white font-bold hover:bg-zinc-600"
                    >
                      -
                    </button>
                    <span className="text-white font-bold w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 bg-amber-400 rounded-full text-zinc-950 font-bold hover:bg-amber-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Tu nombre *"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <textarea
              placeholder="Notas del pedido (opcional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-zinc-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-400 font-semibold">Total:</span>
            <span className="text-amber-400 font-black text-2xl">${total} MXN</span>
          </div>
          <button
            onClick={handleOrder}
            className="w-full bg-green-500 text-white py-4 rounded-full font-black text-lg hover:bg-green-400 transition-colors"
          >
            📲 Pedir por WhatsApp
          </button>
        </div>

      </div>
    </div>
  )
}