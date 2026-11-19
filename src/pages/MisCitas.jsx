import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap'

import PlantillaPublica from '../components/templates/PlantillaPublica'
import HistorialReservas from '../components/organisms/HistorialReservas'
import { useAutenticacion } from '../hooks/useAutenticacion'
import { useReservas } from '../hooks/useReservas'

function MisCitas() {
  const navegar = useNavigate()

  const {
    token,
    cerrarSesion
  } = useAutenticacion()

  const {
    reservas,
    cargando,
    error,
    recargarReservas
  } = useReservas(token)

  useEffect(() => {
    if (error?.estado === 401) {
      cerrarSesion()
      navegar('/login', { replace: true })
    }
  }, [error, cerrarSesion, navegar])

  return (
    <PlantillaPublica>
      <Container className="py-5">

        <h1 className="text-center text-success mb-3">
          Mis citas
        </h1>

        <p className="text-center text-muted mb-4">
          Consulta tus reservas nutricionales.
        </p>

        <Card className="shadow-sm">
          <Card.Body>

            {cargando ? (
              <div className="text-center py-4" role="status">
                <Spinner
                  animation="border"
                  variant="success"
                />

                <p>Cargando tus reservas...</p>
              </div>

            ) : error ? (
              <Alert variant="danger">
                <p>{error.message}</p>

                <Button
                  variant="outline-danger"
                  onClick={recargarReservas}
                >
                  Reintentar
                </Button>
              </Alert>

            ) : reservas.length === 0 ? (
              <Alert variant="info">
                Todavía no tienes citas registradas.
              </Alert>

            ) : (
              <HistorialReservas reservas={reservas} />
            )}

            <div className="d-flex gap-2 flex-wrap mt-3">
              <Button
                variant="success"
                onClick={() => navegar('/nueva-cita')}
              >
                Agendar nueva cita
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => navegar('/menu')}
              >
                Volver al menú
              </Button>
            </div>

          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default MisCitas


