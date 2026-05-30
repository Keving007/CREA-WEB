import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase' // Importamos Supabase

export default function Login() {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)
  
  // Estado para el emoji
  const [verPassword, setVerPassword] = useState(false)
  
  // Estados para los datos
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const togglePassword = () => {
    setVerPassword(!verPassword)
  }

  // 🚀 Función para iniciar sesión
  const handleLogin = async (e) => {
    e.preventDefault()
    setCargando(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error

      // Si las credenciales son correctas, lo enviamos a su armario
      navigate('/dashboard')

    } catch (error) {
      alert('Credenciales incorrectas. Verifica tu correo y contraseña.')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">CREA</h1>
          <p className="text-slate-500 mt-2">Tu armario inteligente</p>
        </div>
        
        {/* Conectamos el formulario con la función */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Correo electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Guardamos lo que escribe
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
            <div className="relative mt-1">
              <input 
                type={verPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Guardamos la contraseña
                className="block w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                placeholder="••••••••"
              />
              
              <button 
                type="button" 
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl p-1 hover:scale-110 transition-transform"
                title={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {verPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={cargando}
            className={`w-full text-white rounded-lg py-3 font-semibold transition-colors ${
              cargando ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {cargando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-slate-900 hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}