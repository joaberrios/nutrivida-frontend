import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import MenuPrincipal from './pages/MenuPrincipal'
import Servicios from './pages/Servicios'
import Categorias from './pages/Categorias'
import DetalleServicio from './pages/DetalleServicio'
import AgendarCita from './pages/AgendarCita'
import ConfirmarCita from './pages/ConfirmarCita'
import CitaExitosa from './pages/CitaExitosa'
import CitaError from './pages/CitaError'
import AdminServicios from './pages/AdminServicios'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route path="/inicio" element={<Inicio />} />
      <Route path="/menu" element={<MenuPrincipal />} />

      <Route path="/catalogo" element={<Servicios />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/catalogo/:codigo" element={<DetalleServicio />} />

      <Route path="/nueva-cita" element={<AgendarCita />} />
      <Route path="/confirmar-cita" element={<ConfirmarCita />} />
      <Route path="/cita-exitosa" element={<CitaExitosa />} />
      <Route path="/cita-error" element={<CitaError />} />

      <Route
        path="/admin-servicios"
        element={<AdminServicios />}
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App