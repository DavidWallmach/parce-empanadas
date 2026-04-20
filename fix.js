const fs = require('fs');

const footer = `export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-xl font-black text-amber-400 mb-4">BURGER RAVE</p>
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
`;

const hero = `export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-zinc-950 pt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <p className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-4">
            Las mejores hamburguesas
          </p>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
            BURGER
            <span className="text-amber-400"> SHOP</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-md">
            Hamburguesas artesanales hechas con ingredientes frescos. Sabor unico en cada mordida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#menu" className="bg-amber-400 text-zinc-950 px-8 py-4 rounded-full font-black text-lg hover:bg-amber-300 transition-colors text-center">
              Ver Menu
            </a>
            <a href="https://wa.me/526564618423" target="_blank" rel="noreferrer" className="border-2 border-amber-400 text-amber-400 px-8 py-4 rounded-full font-black text-lg hover:bg-amber-400 hover:text-zinc-950 transition-colors text-center">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="text-9xl animate-bounce">
            🍔
          </div>
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('client/src/components/Footer.jsx', footer);
fs.writeFileSync('client/src/components/Hero.jsx', hero);
console.log('Archivos creados correctamente!');