import toast from 'react-hot-toast'

const items = [
  { id: 1, name: "Classic Burger", price: 89, desc: "Carne 200g, lechuga, tomate, queso cheddar", emoji: "🍔" },
  { id: 2, name: "BBQ Smash", price: 109, desc: "Doble smash, salsa BBQ, cebolla caramelizada", emoji: "🔥" },
  { id: 3, name: "Chicken Crispy", price: 95, desc: "Pechuga empanizada, coleslaw, jalapeños", emoji: "🍗" },
  { id: 4, name: "Mushroom Swiss", price: 99, desc: "Hongos salteados, queso swiss, mostaza Dijon", emoji: "🍄" },
  { id: 5, name: "Doble Smash", price: 119, desc: "Doble carne smash, doble queso, pepinillos", emoji: "💥" },
  { id: 6, name: "Veggie Burger", price: 85, desc: "Medallón de garbanzo, aguacate, pico de gallo", emoji: "🥑" },
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
          <h2 className="text-5xl font-black text-white">NUESTRO MENÚ</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700 hover:border-amber-400 transition-all hover:-translate-y-1"
            >
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