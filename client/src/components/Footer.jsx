export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-xl font-black text-amber-400 mb-4">BURGER SHOP</p>
            <p className="text-zinc-400 text-sm">Hamburguesas artesanales con los mejores ingredientes.</p>
          </div>
          <div>
            <h3 className="text-white font-black mb-4">Horarios</h3>
            <p className="text-zinc-400 text-sm">Lunes - Viernes: 12pm - 10pm</p>
            <p className="text-zinc-400 text-sm">Sabado - Domingo: 11am - 11pm</p>
          </div>
          <div>
            <h3 className="text-white font-black mb-4">Contacto</h3>
            <p className="text-zinc-400 text-sm">Ciudad Juarez, Chihuahua</p>
            <a href="https://wa.me/526564618423" target="_blank" rel="noreferrer" className="block text-green-400 mt-2 text-sm">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-6 text-center text-zinc-600 text-sm">
          2026 Burger Shop
        </div>
      </div>
    </footer>
  );
}
