import { Container, Card, Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

import PlantillaPublica from '../components/templates/PlantillaPublica'

function CitaExitosa() {
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const cita = ubicacion.state?.cita

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
                  Cita agendada correctamente
                </h1>

                <p>
                  Tu reserva fue registrada en el sistema.
                </p>

                <p>Número de reserva: {cita.id}</p>

                <p>Servicio: {cita.servicio}</p>

                <p>Nutricionista: {cita.nutricionista}</p>

                <p>
                  Fecha: {String(cita.fecha_reserva).slice(0, 10)}
                </p>

                <p>
                  Hora: {String(cita.hora_reserva).slice(0, 5)}
                </p>

                <p>
                  Duración: {cita.duracion_minutos} minutos
                </p>

                <p>
                  Precio: {
                    Number(cita.precio).toLocaleString('es-CL', {
                      style: 'currency',
                      currency: 'CLP'
                    })
                  }
                </p>

                <p className="text-success">
                  Estado: {cita.estado}
                </p>
              </>
            ) : (
              <>
                <h2>No hay una confirmación disponible</h2>
                <p>Realiza una reserva para continuar.</p>
              </>
            )}

            <Button
              variant="success"
              onClick={() => navegar('/menu')}
            >
              Volver al menú
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default CitaExitosa
