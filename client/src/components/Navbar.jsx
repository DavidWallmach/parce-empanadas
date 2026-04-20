export default function Navbar({ cartCount, onCartClick }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍔</span>
          <span className="text-xl font-bold text-amber-400 tracking-wide">
            BURGER RAVE
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-zinc-300 font-medium">
          <a href="#menu" className="hover:text-amber-400 transition-colors">Menú</a>
          <a href="#nosotros" className="hover:text-amber-400 transition-colors">Nosotros</a>
          <a href="#contacto" className="hover:text-amber-400 transition-colors">Contacto</a>
        </div>

        <button
          onClick={onCartClick}
          className="relative bg-amber-400 text-zinc-950 px-4 py-2 rounded-full font-bold hover:bg-amber-300 transition-colors"
        >
          🛒 Carrito
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

      </div>
    </nav>
  )
}