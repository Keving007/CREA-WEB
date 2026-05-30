import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // 👈 1. Importamos el componente
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import MisArmarios from './pages/MisArmarios'

function App() {
  return (
    <BrowserRouter>
      {/* 👈 2. Lo colocamos arriba de las rutas. position="top-center" es ideal para móviles */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mis-armarios" element={<MisArmarios />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App