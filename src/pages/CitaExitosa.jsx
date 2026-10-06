import { Container, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'

function CitaExitosa() {
  const navigate = useNavigate()

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <Card
          className="mx-auto text-center shadow-sm"
          style={{ maxWidth: '600px' }}
        >
          <Card.Body>
            <h1 className="text-success mb-3">
              ¡Cita agendada!
            </h1>

            <p>
              Tu cita fue registrada correctamente.
            </p>

            <p>
              Recibirás la atención en la fecha y hora seleccionadas.
            </p>

            <Button
              variant="success"
              onClick={() => navigate('/inicio')}
            >
              Volver al inicio
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default CitaExitosa