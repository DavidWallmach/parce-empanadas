import toast from 'react-hot-toast'

const items = [
  { id: 1, name: "Empanada de Carne", price: 20, desc: "Empanada rellena de carne molida con papa y especias colombianas", emoji: "🥟" },
  { id: 2, name: "Empanada de Pollo", price: 20, desc: "Empanada rellena de pollo desmenuzado con papa y aji", emoji: "🥟" },
  { id: 3, name: "Docena de Carne", price: 200, desc: "12 empanadas de carne, perfectas para eventos", emoji: "📦" },
  { id: 4, name: "Docena de Pollo", price: 200, desc: "12 empanadas de pollo, perfectas para eventos", emoji: "📦" },
  { id: 5, name: "Mixta x6", price: 110, desc: "6 empanadas mixtas, 3 de carne y 3 de pollo", emoji: "🥟" },
  { id: 6, name: "Combo Evento", price: 950, desc: "50 empanadas mixtas para tu evento, incluye salsas", emoji: "🎉" },
]

export default function Menu({ onAdd }) {
  const handleAdd = (item) => {
    onAdd(item)
    toast.success(`${item.name} agregado al carrito!`, {
      style: { background: '#18181b', color: '#fff', border: '1px solid #f59e0b' }
    })
  }

  return (
    <section id="menu" className="py-24 bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-amber-400 tracking-widest uppercase text-sm font-semibold mb-2">
            Lo que ofrecemos
          </p>
          <h2 className="text-5xl font-black text-white">NUESTRO MENU</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700 hover:border-amber-400 transition-all hover:-translate-y-1">
              <div className="text-6xl mb-4 text-center">{item.emoji}</div>
              <h3 className="text-xl font-black text-white mb-2">{item.name}</h3>
              <p className="text-zinc-400 text-sm mb-4">{item.desc}</p>
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-black text-2xl">${item.price}</span>
                <button
                  onClick={() => handleAdd(item)}
                  className="bg-amber-400 text-zinc-950 px-4 py-2 rounded-full font-bold hover:bg-amber-300 transition-colors"
                >
                  + Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}