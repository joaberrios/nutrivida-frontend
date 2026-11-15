
import { Navigate, Outlet, Link } from 'react-router-dom'
import { Container, Alert, Button } from 'react-bootstrap'
import { usarAutenticacion } from '../../context/AutenticacionContext'

function RutaProtegida({ roles = [] }) {
  const { autenticado, usuario } = usarAutenticacion()

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  if (
    roles.length > 0 &&
    !roles.includes(usuario?.rol)
  ) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h2>Acceso denegado</h2>

          <p>
            No tienes permisos para acceder a esta sección.
          </p>

          <Button as={Link} to="/menu" variant="success">
            Volver al menú
          </Button>
        </Alert>
      </Container>
    )
  }

  return <Outlet />
}

export default RutaProtegida
