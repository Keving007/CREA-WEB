import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Shirt, User, Users, Sparkles, LayoutGrid, Bell, ChevronRight } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [cantidadArmarios, setCantidadArmarios] = useState(0)
  const [nombreUsuario, setNombreUsuario] = useState('Creador')

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return navigate('/')

        const { data: perfil } = await supabase
          .from('perfiles')
          .select('nombre')
          .eq('id', user.id)
          .single()
          
        if (perfil) setNombreUsuario(perfil.nombre)

        const { count, error } = await supabase
          .from('armarios')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', user.id)

        if (!error) setCantidadArmarios(count || 0)
        
      } catch (error) {
        console.error('Error:', error)
      }
    }
    
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      
      <header className="bg-white px-6 py-5 flex justify-between items-center rounded-b-3xl shadow-sm sticky top-0 z-10">
        <div>
          <p className="text-sm text-slate-500 font-medium">Bienvenido a CREA</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hola, {nombreUsuario} 👋</h1>
        </div>
        <button className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-slate-200 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-100"></span>
        </button>
      </header>

      <main className="p-6 space-y-8">
        
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Tu Resumen</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="bg-slate-100 p-2.5 rounded-full mb-3">
                <LayoutGrid className="text-slate-800" size={24}/>
              </div>
              <span className="text-2xl font-black text-slate-900">{cantidadArmarios}</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Armarios</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center opacity-70">
              <div className="bg-slate-100 p-2.5 rounded-full mb-3">
                <Sparkles className="text-slate-800" size={24}/>
              </div>
              <span className="text-2xl font-black text-slate-900">0</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Outfits</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center opacity-70">
              <div className="bg-slate-100 p-2.5 rounded-full mb-3">
                <Users className="text-slate-800" size={24}/>
              </div>
              <span className="text-2xl font-black text-slate-900">0</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Amigos</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Menú Principal</h2>
          <div className="space-y-3">
            
            {/* 👈 Este botón ahora te lleva a Mis Armarios en vez de abrir un modal */}
            <button 
              onClick={() => navigate('/mis-armarios')}
              className="w-full bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl"><LayoutGrid size={20} /></div>
                <div className="text-left">
                  <span className="font-semibold block">Gestionar Armarios</span>
                  <span className="text-xs text-slate-300">Ver, crear y organizar</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
            
            <button className="w-full bg-white text-slate-900 border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-xl"><Sparkles size={20} /></div>
                <div className="text-left">
                  <span className="font-semibold block">Creador de Outfits</span>
                  <span className="text-xs text-slate-500">Probador virtual</span>
                </div>
              </div>
            </button>

            <button className="w-full bg-white text-slate-900 border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><Users size={20} /></div>
                <div className="text-left">
                  <span className="font-semibold block">Comunidad CREA</span>
                  <span className="text-xs text-slate-500">Amigos y solicitudes</span>
                </div>
              </div>
            </button>

          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40">
        <button className="flex flex-col items-center text-slate-900">
          <Home size={24} strokeWidth={2.5} />
          <span className="text-xs font-semibold mt-1">Inicio</span>
        </button>
        <button onClick={() => navigate('/mis-armarios')} className="flex flex-col items-center text-slate-400 hover:text-slate-600 transition-colors">
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