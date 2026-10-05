import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Servicios from './pages/Servicios'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/catalogo" element={<Servicios />} />

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App