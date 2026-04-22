import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Cart({ cart, setCart, onClose }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [tipoEntrega, setTipoEntrega] = useState('domicilio')
  const [direccion, setDireccion] = useState('')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [loading, setLoading] = useState(false)
  const [ubicacion, setUbicacion] = useState(null)

const obtenerUbicacion = () => {
  if (!navigator.geolocation) {
    toast.error('Tu navegador no soporta geolocalización')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUbicacion({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
      toast.success('Ubicacion obtenida!')
    },
    () => toast.error('No se pudo obtener la ubicacion')
  )
}

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setCart(prev => prev.map(i => i.id === id ? {...i, qty} : i))
  }

  const handleOrder = async () => {
    if (!name.trim()) return toast.error('Por favor escribe tu nombre')
    if (!phone.trim()) return toast.error('Por favor escribe tu telefono')
    if (cart.length === 0) return toast.error('Tu carrito esta vacio')
    if (tipoEntrega === 'domicilio' && !direccion.trim()) return toast.error('Por favor escribe tu direccion')

    setLoading(true)
    try {
      const items = cart.map(i => ({
        nombre: i.name,
        precio: i.price,
        cantidad: i.qty
      }))

const res = await axios.post('http://localhost:5000/api/pedidos', {
  telefono: phone,
  items,
  total,
  metodoPago,
  tipoEntrega,
  direccionEntrega: direccion,
  ubicacion
})

      const { pedido, codigoConfirmacion } = res.data

      // Si paga con tarjeta redirigir a Stripe
      if (metodoPago === 'tarjeta') {
        const stripeRes = await axios.post('http://localhost:5000/api/pagos/crear-sesion', {
          items: pedido.items,
          pedidoId: pedido._id,
          telefono: phone
        })
        window.location.href = stripeRes.data.url
        return
      }

      // Si paga en efectivo abrir WhatsApp
      const itemsList = cart.map(i => `• ${i.qty}x ${i.name} - $${i.price * i.qty}`).join('\n')
      const message = encodeURIComponent(
        `🥟 *Nuevo Pedido - Parce Empanadas*\n\n` +
        `👤 Cliente: ${name}\n` +
        `📞 Telefono: ${phone}\n\n` +
        `📋 Pedido:\n${itemsList}\n\n` +
        `💰 Total: $${total} MXN\n` +
        `💳 Pago: ${metodoPago}\n` +
        `🚚 Entrega: ${tipoEntrega}\n` +
        `📍 Direccion: ${direccion || 'Recoger en tienda'}\n\n` +
        `📝 Notas: ${notes || 'Ninguna'}\n\n` +
        `🔑 Codigo de confirmacion: ${codigoConfirmacion}`
      )

      window.open(`https://wa.me/526481690255?text=${message}`, '_blank')
      setCart([])
      onClose()
      toast.success('Pedido enviado exitosamente!')

    } catch (error) {
      console.error(error)
      toast.error('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-900 h-full overflow-y-auto border-l border-zinc-700 flex flex-col">

        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-2xl font-black text-white">Tu Pedido</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl font-bold">X</button>
        </div>

        <div className="flex-1 p-6">
          {cart.length === 0 ? (
            <p className="text-zinc-500 text-center mt-12">Tu carrito esta vacio</p>
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
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 bg-zinc-700 rounded-full text-white font-bold hover:bg-zinc-600">-</button>
                    <span className="text-white font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 bg-amber-400 rounded-full text-zinc-950 font-bold hover:bg-amber-300">+</button>
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
            <input
              type="text"
              placeholder="Tu telefono *"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setTipoEntrega('domicilio')}
                className={`flex-1 py-2 rounded-xl font-bold text-sm ${tipoEntrega === 'domicilio' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}
              >
                A domicilio
              </button>
              <button
                onClick={() => setTipoEntrega('recoger')}
                className={`flex-1 py-2 rounded-xl font-bold text-sm ${tipoEntrega === 'recoger' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}
              >
                Recoger
              </button>
            </div>
{tipoEntrega === 'domicilio' && (
  <div className="space-y-2">
    <input
      type="text"
      placeholder="Tu direccion *"
      value={direccion}
      onChange={e => setDireccion(e.target.value)}
      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
    />
    <button
      type="button"
      onClick={obtenerUbicacion}
      className={`w-full py-2 rounded-xl font-bold text-sm transition-colors ${ubicacion ? 'bg-green-500 text-white' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
    >
      {ubicacion ? '✅ Ubicacion obtenida!' : '📍 Compartir mi ubicacion GPS'}
    </button>
    {ubicacion && (
      <p className="text-green-400 text-xs text-center">
        Lat: {ubicacion.lat.toFixed(4)}, Lng: {ubicacion.lng.toFixed(4)}
      </p>
    )}
  </div>
)}

            <div className="flex gap-2">
              <button
                onClick={() => setMetodoPago('efectivo')}
                className={`flex-1 py-2 rounded-xl font-bold text-sm ${metodoPago === 'efectivo' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}
              >
                Efectivo
              </button>
              <button
                onClick={() => setMetodoPago('tarjeta')}
                className={`flex-1 py-2 rounded-xl font-bold text-sm ${metodoPago === 'tarjeta' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}
              >
                Tarjeta
              </button>
            </div>

            {metodoPago === 'tarjeta' && (
              <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-3">
                <p className="text-blue-400 text-sm font-bold">💳 Pago seguro con Stripe</p>
                <p className="text-zinc-400 text-xs mt-1">Seras redirigido a la pagina de pago seguro</p>
              </div>
            )}

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
            disabled={loading}
            className={`w-full py-4 rounded-full font-black text-lg transition-colors disabled:opacity-50 ${metodoPago === 'tarjeta' ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-green-500 text-white hover:bg-green-400'}`}
          >
            {loading ? 'Procesando...' : metodoPago === 'tarjeta' ? '💳 Pagar con Tarjeta' : '📲 Pedir por WhatsApp'}
          </button>
        </div>

      </div>
    </div>
  )
}