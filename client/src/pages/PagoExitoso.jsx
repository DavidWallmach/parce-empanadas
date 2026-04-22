import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function PagoExitoso() {
  const [searchParams] = useSearchParams()
  const pedidoId = searchParams.get('pedido')

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-2xl p-10 border border-zinc-700 text-center max-w-md">
        <div className="text-8xl mb-4">✅</div>
        <h1 className="text-3xl font-black text-white mb-2">Pago Exitoso!</h1>
        <p className="text-zinc-400 mb-4">Tu pedido ha sido confirmado y pagado.</p>
        {pedidoId && (
          <p className="text-amber-400 font-bold text-sm mb-6">
            Pedido: #{pedidoId.slice(-6).toUpperCase()}
          </p>
        )}
        <p className="text-zinc-500 text-sm mb-6">
          En unos minutos recibirás un mensaje por WhatsApp con los detalles de tu pedido.
        </p>
        <a
          href="/"
          className="bg-amber-400 text-zinc-950 px-8 py-3 rounded-full font-black hover:bg-amber-300 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}