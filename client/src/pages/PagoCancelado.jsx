export default function PagoCancelado() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 rounded-2xl p-10 border border-zinc-700 text-center max-w-md">
        <div className="text-8xl mb-4">❌</div>
        <h1 className="text-3xl font-black text-white mb-2">Pago Cancelado</h1>
        <p className="text-zinc-400 mb-6">
          Tu pago fue cancelado. Puedes intentarlo de nuevo o pagar en efectivo.
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