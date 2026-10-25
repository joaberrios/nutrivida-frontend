import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'

function Categorias() {
  const categorias = [
    {
      nombre: 'Consultas',
      icono: '🩺',
      descripcion:
        'Recibe atención nutricional personalizada para evaluar tu estado de salud y mejorar tus hábitos alimenticios.',
      detalles: [
        'Evaluaciones nutricionales',
        'Controles y seguimiento',
        'Orientación alimentaria'
      ]
    },
    {
      nombre: 'Planes especializados',
      icono: '🥗',
      descripcion:
        'Conoce programas nutricionales adaptados a tus objetivos y necesidades, con orientación profesional.',
      detalles: [
        'Planes de alimentación',
        'Programas personalizados',
        'Seguimiento nutricional'
      ]
    }
  ]

  return (
    <PlantillaPublica>
      <Container className="py-5">

        <div className="text-center mb-5">
          <Badge bg="success" className="mb-3 px-3 py-2">
            NUESTROS SERVICIOS
          </Badge>

          <h1 className="fw-bold text-success">
            Categorías nutricionales
          </h1>

          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            En NutriVida queremos ayudarte a alcanzar tus objetivos.
            Explora nuestras categorías y encuentra la atención
            nutricional que necesitas.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {categorias.map((categoria) => (
            <Col key={categoria.nombre} xs={12} md={6}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="p-4 d-flex flex-column">

                  <div className="fs-1 mb-3">
                    {categoria.icono}
                  </div>

                  <Card.Title className="fs-3 fw-bold text-success">
                    {categoria.nombre}
                  </Card.Title>

                  <Card.Text className="text-muted">
                    {categoria.descripcion}
                  </Card.Text>

                  <h6 className="fw-bold mt-3">
                    ¿Qué encontrarás?
                  </h6>

                  <ul className="mb-4">
                    {categoria.detalles.map((detalle) => (
                      <li key={detalle} className="mb-2">
                        {detalle}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Button
                      as={Link}
                      to={`/catalogo?categoria=${encodeURIComponent(categoria.nombre)}`}
                      variant="success"
                      className="w-100"
                    >
                      Explorar servicios
                    </Button>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="border-0 shadow-sm mt-5">
          <Card.Body className="p-4 text-center">
            <h3 className="fw-bold">
              ¿Necesitas orientación nutricional?
            </h3>

            <p className="text-muted">
              Agenda una atención con nuestros profesionales
              y comienza a cuidar tu alimentación.
            </p>

            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Button as={Link} to="/nueva-cita" variant="success">
                Agendar una cita
              </Button>

              <Button as={Link} to="/menu" variant="outline-success">
                Volver al menú
              </Button>
            </div>
          </Card.Body>
        </Card>

      </Container>
    </PlantillaPublica>
  )
}

export default Categorias