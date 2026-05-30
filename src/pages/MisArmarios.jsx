import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, LayoutGrid, Trash2, Edit2, Loader2, Check, X, Plus } from 'lucide-react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export default function MisArmarios() {
  const navigate = useNavigate()
  const [armarios, setArmarios] = useState([])
  const [cargando, setCargando] = useState(true)

  // Estados de Edición
  const [editandoId, setEditandoId] = useState(null)
  const [nombreEditado, setNombreEditado] = useState('')
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)

  // 📝 NUEVOS ESTADOS: Creación de Armario
  const [mostrarNuevo, setMostrarNuevo] = useState(false)
  const [nombreNuevo, setNombreNuevo] = useState('')
  const [creando, setCreando] = useState(false)

  const cargarArmarios = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate('/')

      const { data, error } = await supabase
        .from('armarios')
        .select('*')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setArmarios(data || [])
    } catch (error) {
      toast.error('Error al cargar armarios: ' + error.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    const iniciar = async () => {
      await cargarArmarios()
    }
    iniciar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 🚀 LÓGICA MUDADA: Crear Armario
  const handleCrearArmario = async (e) => {
    e.preventDefault()
    if (!nombreNuevo.trim()) {
      toast.error('Ingresa un nombre para el armario')
      return
    }
    setCreando(true)
    const toastId = toast.loading('Creando...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('armarios')
        .insert([{ nombre: nombreNuevo, usuario_id: user.id }])
        .select() // Pedimos que nos devuelva el armario recién creado

      if (error) throw error

      // Agregamos el nuevo armario arriba de la lista sin recargar la página
      setArmarios([data[0], ...armarios])
      setNombreNuevo('')
      setMostrarNuevo(false)
      toast.success('Armario creado', { id: toastId })
    } catch (error) {
      toast.error('Error al crear: ' + error.message, { id: toastId })
    } finally {
      setCreando(false)
    }
  }

  const eliminarArmario = async (id, nombre) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)
    if (!confirmar) return

    const toastId = toast.loading('Eliminando armario...')
    try {
      const { error } = await supabase.from('armarios').delete().eq('id', id)
      if (error) throw error
      setArmarios(armarios.filter(armario => armario.id !== id))
      toast.success('Armario eliminado', { id: toastId })
    } catch (error) {
      toast.error('Error al eliminar: ' + error.message, { id: toastId })
    }
  }

  const iniciarEdicion = (armario) => {
    setEditandoId(armario.id)
    setNombreEditado(armario.nombre)
  }

  const guardarArmario = async (id) => {
    if (!nombreEditado.trim()) {
      toast.error('El nombre no puede estar vacío')
      return
    }
    setGuardandoEdicion(true)
    const toastId = toast.loading('Guardando cambios...')

    try {
      const { error } = await supabase.from('armarios').update({ nombre: nombreEditado }).eq('id', id)
      if (error) throw error

      setArmarios(armarios.map(a => a.id === id ? { ...a, nombre: nombreEditado } : a))
      setEditandoId(null)
      toast.success('¡Armario actualizado!', { id: toastId })
    } catch (error) {
      toast.error('Error al actualizar: ' + error.message, { id: toastId })
    } finally {
      setGuardandoEdicion(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      <header className="bg-white px-4 py-5 flex items-center gap-4 rounded-b-3xl shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Mis Armarios</h1>
      </header>

      <main className="p-6">

        {/* 👈 Nuevo bloque: Botón y formulario para agregar armario */}
        <div className="mb-6">
          {!mostrarNuevo ? (
            <button 
              onClick={() => setMostrarNuevo(true)}
              className="w-full bg-slate-900 text-white p-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-slate-800 transition-colors"
            >
              <Plus size={20} />
              <span className="font-semibold">Nuevo Armario</span>
            </button>
          ) : (
            <form onSubmit={handleCrearArmario} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex gap-2 animate-in slide-in-from-top-2">
              <input 
                type="text" 
                autoFocus
                placeholder="Nombre del armario..." 
                value={nombreNuevo}
                onChange={(e) => setNombreNuevo(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button type="submit" disabled={creando} className="bg-slate-900 text-white px-3 py-2 rounded-lg font-medium">
                {creando ? <Loader2 className="animate-spin" size={20}/> : 'Crear'}
              </button>
              <button type="button" onClick={() => setMostrarNuevo(false)} className="bg-red-50 text-red-600 px-3 py-2 rounded-lg">
                <X size={20} />
              </button>
            </form>
          )}
        </div>

        {cargando ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        ) : armarios.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <p>Aún no tienes armarios.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {armarios.map((armario) => (
              <div key={armario.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group transition-all">
                
                {editandoId === armario.id ? (
                  <div className="flex items-center gap-2 w-full animate-in fade-in duration-200">
                    <input 
                      type="text"
                      autoFocus
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <button onClick={() => guardarArmario(armario.id)} disabled={guardandoEdicion} className="p-2 bg-slate-900 text-white rounded-lg">
                      {guardandoEdicion ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    </button>
                    <button onClick={() => setEditandoId(null)} className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div onClick={() => navigate(`/armario/${armario.id}`)} className="flex items-center gap-4 flex-1 cursor-pointer">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <LayoutGrid className="text-slate-800" size={24}/>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{armario.nombre}</h3>
                        <p className="text-xs text-slate-500">Toca para ver prendas</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => iniciarEdicion(armario)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => eliminarArmario(armario.id, armario.nombre)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}