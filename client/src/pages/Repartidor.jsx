import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const socket = io('http://localhost:5000')

export default function Repartidor() {
  const [pedidos, setPedidos] = useState([])
  const [codigos, setCodigos] = useState({})

  useEffect(() => {
    cargarPedidos()

    socket.on('pedido_actualizado', (pedido) => {
      if (pedido.estado === 'en_camino') {
        setPedidos(prev => [pedido, ...prev.filter(p => p._id !== pedido._id)])
      } else {
        setPedidos(prev => prev.filter(p => p._id !== pedido._id))
      }
    })

    return () => socket.off('pedido_actualizado')
  }, [])

  const cargarPedidos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pedidos/estado/en_camino')
      setPedidos(res.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const confirmarEntrega = async (pedido) => {
    const codigoIngresado = codigos[pedido._id]
    if (!codigoIngresado) return toast.error('Ingresa el codigo del cliente')

    if (codigoIngresado.toUpperCase() !== pedido.codigoConfirmacion) {
      return toast.error('Codigo incorrecto. Verificalo con el cliente.')
    }

    try {
      await axios.put(`http://localhost:5000/api/pedidos/${pedido._id}/estado`, {
        estado: 'entregado'
      })
      toast.success('Pedido entregado exitosamente!')
      setPedidos(prev => prev.filter(p => p._id !== pedido._id))
    } catch (error) {
      toast.error('Error al confirmar entrega')
    }
  }

  const reenviarCodigo = async (pedido) => {
    toast.success(`Codigo reenviado: ${pedido.codigoConfirmacion}`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Toaster position="top-right" />
      <nav className="bg-zinc-900 border-b border-zinc-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚚</span>
          <span className="font-black text-amber-400 text-xl">PANEL DE REPARTIDOR</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-black text-sm">
            {pedidos.length} para entregar
          </span>
          <button onClick={cargarPedidos} className="bg-zinc-700 text-white px-4 py-2 rounded-full text-sm hover:bg-zinc-600">
            🔄 Actualizar
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {pedidos.length === 0 ? (
          <div className="text-center mt-20">
            <span className="text-8xl">🎉</span>
            <p className="text-zinc-400 text-xl mt-4">No hay pedidos para entregar</p>
            <p className="text-zinc-600 text-sm mt-2">Los pedidos listos apareceran aqui automaticamente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pedidos.map(pedido => (
              <div key={pedido._id} className="bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden">
                <div className="bg-blue-500 px-4 py-3 flex justify-between items-center">
                  <span className="font-black text-white text-lg">
                    Entrega #{pedido._id.slice(-4).toUpperCase()}
                  </span>
                  <span className="bg-white text-blue-500 px-2 py-1 rounded-full text-xs font-black">
                    LISTO
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-zinc-400 text-sm">Cliente</p>
                    <p className="text-white font-bold">{pedido.telefono}</p>
                  </div>

                  <div>
                    <p className="text-zinc-400 text-sm mb-1">Productos</p>
                    {pedido.items.map((item, i) => (
                      <div key={i} className="flex justify-between bg-zinc-800 rounded-lg px-3 py-1 mb-1">
                        <span className="text-white text-sm">{item.nombre}</span>
                        <span className="text-amber-400 font-bold text-sm">x{item.cantidad}</span>
                      </div>
                    ))}
                  </div>

                  {pedido.tipoEntrega === 'domicilio' && pedido.direccionEntrega && (
                    <div className="bg-zinc-800 rounded-xl p-3">
                      <p className="text-zinc-400 text-sm mb-1">📍 Direccion de entrega</p>
                      <p className="text-white font-bold">{pedido.direccionEntrega}</p>
                    </div>
                  )}

                  {pedido.tipoEntrega === 'recoger' && (
                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-3">
                      <p className="text-green-400 font-bold text-sm">🏪 El cliente pasa a recoger</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-zinc-400 text-xs">Pago</p>
                      <p className="text-white font-bold text-sm">{pedido.metodoPago}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-400 text-xs">Total</p>
                      <p className="text-amber-400 font-black text-xl">${pedido.total}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 text-sm mb-2">🔑 Codigo de confirmacion del cliente:</p>
                    <input
                      type="text"
                      placeholder="Ingresa el codigo del cliente"
                      value={codigos[pedido._id] || ''}
                      onChange={e => setCodigos(prev => ({...prev, [pedido._id]: e.target.value}))}
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 uppercase text-center font-black tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <button
                    onClick={() => reenviarCodigo(pedido)}
                    className="w-full bg-zinc-700 text-zinc-300 py-2 rounded-xl text-sm hover:bg-zinc-600 transition-colors"
                  >
                    📨 Reenviar codigo al cliente
                  </button>

                  <button
                    onClick={() => confirmarEntrega(pedido)}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-black text-lg hover:bg-green-400 transition-colors"
                  >
                    ✅ Confirmar Entrega
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}