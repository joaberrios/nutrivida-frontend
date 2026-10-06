import { Container, Card, Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'

function ConfirmarCita() {
  const location = useLocation()
  const navigate = useNavigate()

  const datos = location.state

  if (!datos) {
    return (
      <PlantillaPublica>
        <Container className="py-5 text-center">
          <h2>No hay datos de una cita</h2>

          <Button
            variant="success"
            onClick={() => navigate('/nueva-cita')}
          >
            Volver a agendar
          </Button>
        </Container>
      </PlantillaPublica>
    )
  }

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <h1 className="text-center mb-4">
          Confirmar cita
        </h1>

        <Card className="mx-auto shadow-sm" style={{ maxWidth: '600px' }}>
          <Card.Body>
            <Card.Title>Resumen de la cita</Card.Title>

            <p>
              <strong>Servicio:</strong> {datos.servicio}
            </p>

            <p>
              <strong>Nutricionista:</strong> {datos.nutricionista}
            </p>

            <p>
              <strong>Fecha:</strong> {datos.fecha}
            </p>

            <p>
              <strong>Hora:</strong> {datos.hora}
            </p>

            <Button
            variant="success"
             className="me-2"
             onClick={() => navigate('/cita-exitosa')}>
            Confirmar cita
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate('/nueva-cita')}
            >
              Volver
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default ConfirmarCita