
import {Container, Card} from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import Boton from '../components/atoms/Boton'

function CitaExitosa() {
  const navigate = useNavigate()
  const location = useLocation()
  const cita = location.state?.cita

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <Card
          className="mx-auto text-center shadow-sm"
          style={{ maxWidth: '600px' }}
        >
          <Card.Body>
            {cita ? (
              <>
                <h1 className="text-success mb-3">
                  ¡Cita agendada!
                </h1>

                <p>Tu cita fue registrada correctamente.</p>

                <p><strong>Servicio:</strong> {cita.servicio}</p>
                <p><strong>Nutricionista:</strong> {cita.nutricionista}</p>
                <p><strong>Fecha:</strong> {cita.fecha}</p>
                <p><strong>Hora:</strong> {cita.hora}</p>
                <p><strong>Estado:</strong> {cita.estado}</p>
              </>
            ) : (
              <>
                <h2>No hay una confirmación disponible</h2>
                <p>Realiza una reserva para obtener su confirmación.</p>
              </>
            )}

            <Boton
              variant="success"
              onClick={() => navigate('/inicio')}
            >
              Volver al inicio
            </Boton>
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default CitaExitosa
