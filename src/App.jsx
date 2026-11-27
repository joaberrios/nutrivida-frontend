import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Servicios from './pages/Servicios'
import AdministracionUsuarios from './pages/AdministracionUsuarios'
import AdministracionServicios from './pages/AdministracionServicios'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/catalogo" element={<Servicios />} />

      <Route
        path="/administracion/usuarios"
        element={<AdministracionUsuarios />}
      />

      <Route
        path="/administracion/servicios"
        element={<AdministracionServicios />}
      />

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App
