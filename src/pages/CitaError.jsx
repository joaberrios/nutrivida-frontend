import { Container, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'

function CitaError() {
  const navigate = useNavigate()

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <Card
          className="mx-auto text-center shadow-sm"
          style={{ maxWidth: '600px' }}
        >
          <Card.Body>
            <h1 className="text-danger mb-3">
              No se pudo agendar la cita
            </h1>

            <p>
              Ocurrió un problema al registrar la cita.
            </p>

            <p>
              Puedes volver a intentarlo seleccionando nuevamente los datos.
            </p>

            <Button
              variant="danger"
              onClick={() => navigate('/nueva-cita')}
            >
              Intentar nuevamente
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default CitaError