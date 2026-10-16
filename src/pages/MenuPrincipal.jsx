
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function MenuPrincipal() {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="text-success fw-bold">NutriVida</h1>
        <h2>Bienvenido a nuestro sistema</h2>
        <p className="text-muted">
          Tu bienestar comienza con una buena alimentación.
          Explora nuestros servicios y agenda tu atención.
        </p>
      </div>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="fs-1 mb-3">🥗</div>
              <Card.Title>Catálogo de servicios</Card.Title>
              <Card.Text>
                Conoce nuestras consultas y programas nutricionales.
              </Card.Text>
              <Button as={Link} to="/catalogo" variant="success">
                Ver servicios
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="fs-1 mb-3">📋</div>
              <Card.Title>Categorías</Card.Title>
              <Card.Text>
                Encuentra los servicios según el tipo de atención.
              </Card.Text>
              <Button as={Link} to="/categorias" variant="success">
                Ver categorías
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="fs-1 mb-3">📅</div>
              <Card.Title>Agendar una cita</Card.Title>
              <Card.Text>
                Reserva una atención nutricional de forma sencilla.
              </Card.Text>
              <Button as={Link} to="/nueva-cita" variant="success">
                Agendar ahora
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="fs-1 mb-3">⚙️</div>
              <Card.Title>Administrar servicios</Card.Title>
              <Card.Text>
                Agrega, edita o elimina servicios nutricionales.
              </Card.Text>
              <Button as={Link} to="/admin-servicios" variant="dark">
                Administrar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-5">
        <Button as={Link} to="/login" variant="outline-secondary">
          Volver al inicio de sesión
        </Button>
      </div>
    </Container>
  )
}

export default MenuPrincipal
