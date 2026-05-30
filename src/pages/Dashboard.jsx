import { Home, Shirt, User, Users, Sparkles, Plus, Bell, LayoutGrid } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Cabecera superior */}
      <header className="bg-white px-6 py-5 flex justify-between items-center rounded-b-3xl shadow-sm sticky top-0 z-10">
        <div>
          <p className="text-sm text-slate-500 font-medium">Bienvenido a CREA</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hola, Creador 👋</h1>
        </div>
        <button className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-slate-200 transition-colors relative">
          <Bell size={20} />
          {/* Puntito rojo de notificación */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-100"></span>
        </button>
      </header>

      <main className="p-6 space-y-8">
        
        {/* SECCIÓN 1: Estadísticas (Grid de 3 columnas) */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Tu Resumen</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Tarjeta: Armarios */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="bg-slate-100 p-2.5 rounded-full mb-3">
                <LayoutGrid className="text-slate-800" size={24}/>
              </div>
              <span className="text-2xl font-black text-slate-900">2</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Armarios</span>
            </div>

            {/* Tarjeta: Outfits */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="bg-slate-100 p-2.5 rounded-full mb-3">
                <Sparkles className="text-slate-800" size={24}/>
              </div>
              <span className="text-2xl font-black text-slate-900">12</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Outfits</span>
            </div>

            {/* Tarjeta: Amigos */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="bg-slate-100 p-2.5 rounded-full mb-3">
                <Users className="text-slate-800" size={24}/>
              </div>
              <span className="text-2xl font-black text-slate-900">5</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Amigos</span>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: Acciones Rápidas */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl"><Plus size={20} /></div>
                <span className="font-semibold text-left">Agregar nueva prenda</span>
              </div>
            </button>
            
            <button className="w-full bg-white text-slate-900 border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-xl"><Sparkles size={20} /></div>
                <span className="font-semibold text-left">Crear un Outfit</span>
              </div>
            </button>
          </div>
        </section>

      </main>

      {/* Barra de navegación inferior */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        <button className="flex flex-col items-center text-slate-900">
          <Home size={24} strokeWidth={2.5} />
          <span className="text-xs font-semibold mt-1">Inicio</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors">
          <Shirt size={24} />
          <span className="text-xs font-medium mt-1">Prendas</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors">
          <User size={24} />
          <span className="text-xs font-medium mt-1">Perfil</span>
        </button>
      </nav>

    </div>
  )
}