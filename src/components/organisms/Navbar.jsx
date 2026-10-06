import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Navbar() {
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

            <Nav.Link as={Link} to="/categorias">
              Categorías
            </Nav.Link>

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