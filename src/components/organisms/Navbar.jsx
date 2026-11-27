import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Consultar el usuario autenticado
function obtenerUsuarioActual() {
  try {
    return JSON.parse(
      sessionStorage.getItem('nutrivida_usuario') || 'null'
    )
  } catch {
    return null
  }
}

function Navbar() {
  const usuario = obtenerUsuarioActual()

  return (
    <BootstrapNavbar bg="success" data-bs-theme="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/inicio">
          NutriVida
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle />

        <BootstrapNavbar.Collapse>
          <Nav className="ms-auto">

            <Nav.Link as={Link} to="/inicio">
              Inicio
            </Nav.Link>

            <Nav.Link as={Link} to="/catalogo">
              Servicios y planes
            </Nav.Link>

            {usuario?.rol === 'administrador' && (
              <>
                <Nav.Link as={Link} to="/administracion/usuarios">
                  Administrar usuarios
                </Nav.Link>

                <Nav.Link as={Link} to="/administracion/servicios">
                  Administrar servicios
                </Nav.Link>
              </>
            )}

            <Nav.Link as={Link} to="/login">
              Iniciar sesión
            </Nav.Link>

          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
