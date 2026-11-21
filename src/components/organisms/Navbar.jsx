import {
  Navbar as BootstrapNavbar,
  Nav,
  Container
} from 'react-bootstrap'

import { Link, useNavigate } from 'react-router-dom'
import { useAutenticacion } from '../../hooks/useAutenticacion'

function Navbar() {
  const {
    usuario,
    autenticado,
    cerrarSesion
  } = useAutenticacion()

  const navegar = useNavigate()

  const esPaciente =
    autenticado && usuario?.rol === 'paciente'

  const esAdministrador =
    autenticado && usuario?.rol === 'administrador'

  function salir() {
    cerrarSesion()
    navegar('/login', { replace: true })
  }

  return (
    <BootstrapNavbar
      bg="success"
      data-bs-theme="dark"
      expand="lg"
    >
      <Container>

        <BootstrapNavbar.Brand
          as={Link}
          to={autenticado ? '/menu' : '/inicio'}
        >
          NutriVida
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle />

        <BootstrapNavbar.Collapse>

          <Nav className="ms-auto">

            <Nav.Link
              as={Link}
              to={autenticado ? '/menu' : '/inicio'}
            >
              Inicio
            </Nav.Link>

            <Nav.Link as={Link} to="/catalogo">
              Servicios y planes
            </Nav.Link>

            <Nav.Link as={Link} to="/categorias">
              Categorías
            </Nav.Link>

            {esPaciente && (
              <>
                <Nav.Link as={Link} to="/nueva-cita">
                  Agendar cita
                </Nav.Link>

                <Nav.Link as={Link} to="/mis-citas">
                  Mis citas
                </Nav.Link>
              </>
            )}

            {esAdministrador && (
              <Nav.Link as={Link} to="/admin-servicios">
                Administrar servicios
              </Nav.Link>
            )}

            {autenticado ? (
              <Nav.Link
                as="button"
                onClick={salir}
              >
                Cerrar sesión
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                Iniciar sesión
              </Nav.Link>
            )}

          </Nav>

        </BootstrapNavbar.Collapse>

      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar


