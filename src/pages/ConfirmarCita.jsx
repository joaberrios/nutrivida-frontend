import { useRef, useState } from 'react'
import { Container, Card, Button, Spinner } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

import PlantillaPublica from '../components/templates/PlantillaPublica'
import { usarAutenticacion } from '../context/AutenticacionContext'
import { crearReserva } from '../services/reservasService'

function ConfirmarCita() {
  const ubicacion = useLocation()
  const navegar = useNavigate()

  const { token, cerrarSesion } = usarAutenticacion()

  const [guardando, setGuardando] = useState(false)
  const solicitudEnCurso = useRef(false)

  const datos = ubicacion.state

  async function confirmarReserva() {
    if (solicitudEnCurso.current) return

    if (!token) {
      navegar('/login', { replace: true })
      return
    }

    solicitudEnCurso.current = true
    setGuardando(true)

    try {
      const reserva = await crearReserva(datos, token)

      navegar('/cita-exitosa', {
        replace: true,
        state: { cita: reserva }
      })

    } catch (error) {
      if (error.estado === 401) {
        cerrarSesion()

        navegar('/login', {
          replace: true
        })

        return
      }

      navegar('/cita-error', {
        replace: true,
        state: {
          mensaje: error.message,
          estado: error.estado
        }
      })

    } finally {
      solicitudEnCurso.current = false
      setGuardando(false)
    }
  }

  if (
    !datos?.codigoServicio ||
    !datos?.nutricionistaId ||
    !datos?.fecha ||
    !datos?.hora
  ) {
    return (
      <PlantillaPublica>
        <Container className="py-5 text-center">
          <h2>No hay datos de una cita</h2>

          <Button
            variant="success"
            onClick={() => navegar('/nueva-cita')}
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

        <Card
          className="mx-auto shadow-sm"
          style={{ maxWidth: '600px' }}
        >
          <Card.Body>
            <Card.Title>Resumen de la cita</Card.Title>

            <p>Servicio: {datos.servicio}</p>
            <p>Nutricionista: {datos.nutricionista}</p>
            <p>Fecha: {datos.fecha}</p>
            <p>Hora: {datos.hora}</p>

            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="success"
                onClick={confirmarReserva}
                disabled={guardando}
              >
                {guardando ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Guardando reserva...
                  </>
                ) : (
                  'Confirmar cita'
                )}
              </Button>

              <Button
                variant="secondary"
                disabled={guardando}
                onClick={() => navegar('/nueva-cita')}
              >
                Volver
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default ConfirmarCita
