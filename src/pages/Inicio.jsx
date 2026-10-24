
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'

function Inicio() {
  const beneficios = [
    {
      icono: '🥗',
      titulo: 'Alimentación saludable',
      descripcion:
        'Aprende a mejorar tus hábitos alimenticios con orientación nutricional personalizada.'
    },
    {
      icono: '🩺',
      titulo: 'Atención profesional',
      descripcion:
        'Accede a consultas y controles para acompañar tus objetivos nutricionales.'
    },
    {
      icono: '📅',
      titulo: 'Reservas sencillas',
      descripcion:
        'Agenda tus citas nutricionales en los días y horarios disponibles.'
    }
  ]

  return (
    <PlantillaPublica>
      <Container className="py-5">

        {/* Bienvenida */}
        <Row className="align-items-center g-4 mb-5">
          <Col lg={7}>
            <Badge bg="success" className="mb-3 px-3 py-2">
              BIENVENIDO A NUTRIVIDA
            </Badge>

            <h1 className="display-5 fw-bold text-success mb-3">
              Tu bienestar comienza con una buena alimentación
            </h1>

            <p className="lead text-muted">
              En NutriVida te ayudamos a mejorar tus hábitos
              alimenticios mediante consultas, evaluaciones
              y planes nutricionales adaptados a tus necesidades.
            </p>

            <p className="text-muted">
              Nuestro objetivo es acompañarte en el cuidado
              de tu salud y ayudarte a alcanzar tus metas
              de manera progresiva y sostenible.
            </p>

            <div className="d-flex gap-3 flex-wrap mt-4">
              <Button
                as={Link}
                to="/nueva-cita"
                variant="success"
                size="lg"
              >
                Agendar una cita
              </Button>

              <Button
                as={Link}
                to="/catalogo"
                variant="outline-success"
                size="lg"
              >
                Ver servicios
              </Button>
            </div>
          </Col>

          <Col lg={5}>
            <Card className="border-0 shadow-sm text-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=85"
                alt="Alimentos frescos y saludables"
                className="img-fluid"
                style={{
                  width: '100%',
                  height: '280px',
                  objectFit: 'cover'
                }}
              />

              <Card.Body className="p-4">
                <h3 className="fw-bold text-success">
                  Clínica NutriVida
                </h3>

                <p className="text-muted mb-0">
                  Nutrición, salud y bienestar para una vida mejor.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Beneficios */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">
            ¿Qué encontrarás en NutriVida?
          </h2>

          <p className="text-muted">
            Servicios pensados para acompañarte en tu bienestar.
          </p>
        </div>

        <Row className="g-4 mb-5">
          {beneficios.map((beneficio) => (
            <Col md={4} key={beneficio.titulo}>
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="fs-1 mb-3">
                    {beneficio.icono}
                  </div>

                  <Card.Title className="fw-bold">
                    {beneficio.titulo}
                  </Card.Title>

                  <Card.Text className="text-muted">
                    {beneficio.descripcion}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Categorías */}
        <Card className="border-0 shadow-sm mb-5">
          <Card.Body className="p-4">
            <Row className="align-items-center g-4">
              <Col md={8}>
                <h2 className="fw-bold text-success">
                  Explora nuestras categorías
                </h2>

                <p className="text-muted mb-0">
                  Conoce nuestras consultas nutricionales y
                  planes especializados para encontrar la
                  atención que mejor se adapte a tus objetivos.
                </p>
              </Col>

              <Col md={4} className="text-md-end">
                <Button
                  as={Link}
                  to="/categorias"
                  variant="success"
                >
                  Ver categorías
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Horarios */}
        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="fw-bold text-success mb-3">
                  🕘 Horarios de atención
                </h3>

                <p>
                  <strong>Lunes a jueves:</strong> 09:00 a 17:00
                </p>

                <p>
                  <strong>Viernes:</strong> 09:00 a 13:00
                </p>

                <p className="mb-0">
                  <strong>Sábados y domingos:</strong> Cerrado
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="fw-bold text-success mb-3">
                  📋 Nuestros servicios
                </h3>

                <p className="text-muted">
                  Revisa las consultas, evaluaciones y programas
                  nutricionales disponibles en nuestro catálogo.
                </p>

                <Button
                  as={Link}
                  to="/catalogo"
                  variant="outline-success"
                >
                  Explorar catálogo
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Acceso al menú */}
        <div className="text-center">
          <h3 className="fw-bold">
            Comienza hoy a cuidar tu alimentación
          </h3>

          <p className="text-muted">
            Encuentra nuestros servicios y reserva tu próxima atención.
          </p>

          <Button
            as={Link}
            to="/menu"
            variant="success"
            size="lg"
          >
            Ir al menú principal
          </Button>
        </div>

      </Container>
    </PlantillaPublica>
  )
}

export default Inicio
