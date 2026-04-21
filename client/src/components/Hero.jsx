import burgerImg from '../assets/Empanda.jpg'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-zinc-950 pt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <p className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-4">
            Las mejores empanadas colombianas
          </p>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">
            PARCE
            <span className="text-amber-400"> EMPANADAS</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-md">
            Autenticas empanadas colombianas en Ciudad Juarez. Sabor unico en cada mordida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#menu" className="bg-amber-400 text-zinc-950 px-8 py-4 rounded-full font-black text-lg hover:bg-amber-300 transition-colors text-center">
              Ver Menu
            </a>
            <a href="https://wa.me/526481690255" target="_blank" rel="noreferrer" className="border-2 border-amber-400 text-amber-400 px-8 py-4 rounded-full font-black text-lg hover:bg-amber-400 hover:text-zinc-950 transition-colors text-center">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div style={{
            filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.6)) drop-shadow(0 0 60px rgba(245, 158, 11, 0.3))',
            animation: 'zoom 2s ease-in-out infinite'
          }}>
            <img src={burgerImg} alt="Empanada" className="w-96 h-96 object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}