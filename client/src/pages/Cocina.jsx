import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:5000')

export default function Cocina() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    cargarPedidos()

    socket.on('nuevo_pedido', (pedido) => {
      setPedidos(prev => [pedido, ...prev])
    })

    socket.on('pedido_actualizado', (pedidoActualizado) => {
      setPedidos(prev => prev.filter(p => p._id !== pedidoActualizado._id))
    })

    return () => {
      socket.off('nuevo_pedido')
      socket.off('pedido_actualizado')
    }
  }, [])

  const cargarPedidos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pedidos/estado/pendiente')
      setPedidos(res.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const actualizarEstado = async (id, estado) => {
    try {
      await axios.put(`http://localhost:5000/api/pedidos/${id}/estado`, { estado })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const tiempoTranscurrido = (fecha) => {
    const diff = Math.floor((new Date() - new Date(fecha)) / 60000)
    if (diff < 1) return 'Hace un momento'
    if (diff === 1) return 'Hace 1 minuto'
    return `Hace ${diff} minutos`
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="bg-zinc-900 border-b border-zinc-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👨‍🍳</span>
          <span className="font-black text-amber-400 text-xl">PANEL DE COCINA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full font-black text-sm">
            {pedidos.length} pendientes
          </span>
          <button onClick={cargarPedidos} className="bg-zinc-700 text-white px-4 py-2 rounded-full text-sm hover:bg-zinc-600">
            🔄 Actualizar
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {pedidos.length === 0 ? (
          <div className="text-center mt-20">
            <span className="text-8xl">✅</span>
            <p className="text-zinc-400 text-xl mt-4">No hay pedidos pendientes</p>
            <p className="text-zinc-600 text-sm mt-2">Los nuevos pedidos apareceran aqui automaticamente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pedidos.map(pedido => (
              <div key={pedido._id} className="bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden">
                <div className="bg-amber-400 px-4 py-3 flex justify-between items-center">
                  <span className="font-black text-zinc-950 text-lg">
                    Pedido #{pedido._id.slice(-4).toUpperCase()}
                  </span>
                  <span className="text-zinc-950 text-sm font-semibold">
                    {tiempoTranscurrido(pedido.fechaPedido)}
                  </span>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-zinc-400 text-sm mb-1">Cliente</p>
                    <p className="text-white font-bold">{pedido.telefono}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-zinc-400 text-sm mb-2">Productos</p>
                    <div className="space-y-2">
                      {pedido.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-zinc-800 rounded-lg px-3 py-2">
                          <span className="text-white font-bold">{item.nombre}</span>
                          <span className="bg-amber-400 text-zinc-950 px-2 py-1 rounded-full text-xs font-black">
                            x{item.cantidad}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${pedido.tipoEntrega === 'domicilio' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                      {pedido.tipoEntrega === 'domicilio' ? 'Domicilio' : 'Recoger'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${pedido.metodoPago === 'efectivo' ? 'bg-zinc-600 text-white' : 'bg-purple-500 text-white'}`}>
                      {pedido.metodoPago}
                    </span>
                  </div>

                  {pedido.direccionEntrega && (
                    <div className="mb-4">
                      <p className="text-zinc-400 text-sm mb-1">Direccion</p>
                      <p className="text-white text-sm">{pedido.direccionEntrega}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-400">Total</span>
                    <span className="text-amber-400 font-black text-xl">${pedido.total}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => actualizarEstado(pedido._id, 'en_camino')}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl font-black hover:bg-green-400 transition-colors"
                    >
                      ✅ Listo
                    </button>
                    <button
                      onClick={() => actualizarEstado(pedido._id, 'cancelado')}
                      className="bg-red-500 text-white px-4 py-3 rounded-xl font-black hover:bg-red-400 transition-colors"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}