
import {Container, Card} from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import Boton from '../components/atoms/Boton'

function CitaError() {
  const navigate = useNavigate()
  const location = useLocation()

  const mensaje =
    location.state?.mensaje ||
    'Ocurrió un problema al registrar la cita.'

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

            <p>{mensaje}</p>

            <p>
              Puedes volver a intentarlo seleccionando
              nuevamente los datos.
            </p>

            <Boton
              variant="danger"
              onClick={() => navigate('/nueva-cita')}
            >
              Intentar nuevamente
            </Boton>
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default CitaError
