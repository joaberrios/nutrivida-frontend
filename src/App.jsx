import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { CatalogoProvider } from './context/CatalogoProvider'
import RutaProtegida from './components/templates/RutaProtegida'

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
import AdminUsuarios from './pages/AdminUsuarios'
import MisCitas from './pages/MisCitas'

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/categorias" element={<Categorias />} />

      {/* Catálogo público */}
      <Route
        element={
          <CatalogoProvider>
            <Outlet />
          </CatalogoProvider>
        }
      >
        <Route path="/catalogo" element={<Servicios />} />

        <Route
          path="/catalogo/:codigo"
          element={<DetalleServicio />}
        />
      </Route>

      {/* Usuarios autenticados */}
      <Route element={<RutaProtegida />}>
        <Route path="/menu" element={<MenuPrincipal />} />
      </Route>

      {/* Rutas exclusivas para pacientes */}
      <Route element={<RutaProtegida roles={['paciente']} />}>

        <Route
          path="/nueva-cita"
          element={
            <CatalogoProvider>
              <AgendarCita />
            </CatalogoProvider>
          }
        />

        <Route
          path="/confirmar-cita"
          element={<ConfirmarCita />}
        />

        <Route
          path="/cita-exitosa"
          element={<CitaExitosa />}
        />

        <Route
          path="/cita-error"
          element={<CitaError />}
        />

        <Route
          path="/mis-citas"
          element={<MisCitas />}
        />
      </Route>

      {/* Rutas exclusivas para administradores */}
      <Route element={<RutaProtegida roles={['administrador']} />}>
        <Route
          path="/admin-servicios"
          element={
            <CatalogoProvider>
              <AdminServicios />
            </CatalogoProvider>
          }
        />
      </Route>

      <Route element={<RutaProtegida roles={['administrador']} />}>
        <Route path="/admin-usuarios" element={<AdminUsuarios />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App


