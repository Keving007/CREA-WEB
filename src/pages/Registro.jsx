import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase' // 👈 Importamos nuestro conector

export default function Registro() {
  const navigate = useNavigate() // Para redireccionar al usuario después de registrarse
  const [cargando, setCargando] = useState(false)
  
  // Estados de la UI
  const [verPassword, setVerPassword] = useState(false)
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(null)
  const fileInputRef = useRef(null)

  // Estados para los datos del formulario 👈
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const togglePassword = () => setVerPassword(!verPassword)

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setFotoPerfilUrl(reader.result)
      reader.readAsDataURL(file)
    }
  }

  // 🚀 LA MAGIA SUCEDE AQUÍ: Función para registrar al usuario
    const handleRegistro = async (e) => {
    e.preventDefault()
    setCargando(true)

    try {
      // 1. Crear el usuario en el sistema de autenticación
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (authError) throw authError

      // 2. Si el usuario se creó bien, guardamos sus datos en nuestra tabla 'perfiles'
      if (authData?.user) {
        const { error: perfilError } = await supabase.from('perfiles').insert([
          {
            id: authData.user.id, // Conectamos el perfil con el ID único de autenticación
            nombre: nombre,
            apellido: apellido,
            username: username,
            foto_url: null // De momento lo dejamos en null hasta configurar el Storage
          }
        ])

        if (perfilError) throw perfilError
      }

      alert('¡Cuenta creada y guardada en la base de datos con éxito!')
      navigate('/')

    } catch (error) {
      alert('Error al registrar: ' + error.message)
    } finally {
      setCargando(false)
    }
  }


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">CREA</h1>
          <p className="text-slate-500 mt-2">Crea tu armario inteligente</p>
        </div>
        
        {/* 👈 Agregamos el evento onSubmit al formulario */}
        <form onSubmit={handleRegistro} className="space-y-4">
          
          <div className="flex flex-col items-center gap-2">
            <label className="block text-sm font-medium text-slate-700">Foto de perfil (Opcional)</label>
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-slate-300 transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                {fotoPerfilUrl ? (
                  <img src={fotoPerfilUrl} alt="Vista previa de perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-slate-400">👤</span>
                )}
              </div>
              <button 
                type="button" 
                className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-slate-200 shadow-md hover:bg-slate-100 transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                ✏️
              </button>
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFotoChange} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nombre <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={nombre} // 👈 Conectamos el input con la variable
                onChange={(e) => setNombre(e.target.value)} // 👈 Actualizamos la variable al escribir
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                placeholder="ej. Carlos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Apellido <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                placeholder="ej. Silva"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre de usuario <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              placeholder="ej. CarlosS88"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Correo electrónico <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Contraseña <span className="text-red-500">*</span></label>
            <div className="relative mt-1">
              <input 
                type={verPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                placeholder="••••••••"
              />
              <button type="button" onClick={togglePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl p-1 hover:scale-110 transition-transform">
                {verPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={cargando} // 👈 Desactivamos el botón mientras carga
            className={`w-full text-white rounded-lg py-3 font-semibold transition-colors ${
              cargando ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {cargando ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            ¿Ya tienes cuenta? <Link to="/" className="font-semibold text-slate-900 hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}