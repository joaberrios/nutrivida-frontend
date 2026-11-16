import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Card,
  Alert,
  Button,
  Spinner
} from 'react-bootstrap'

import PlantillaPublica from '../components/templates/PlantillaPublica'
import FormularioAgendamiento from '../components/organisms/FormularioAgendamiento'
import { CatalogoContext } from '../context/CatalogoContext'
import { usarNutricionistas } from '../hooks/usarNutricionistas'

function AgendarCita() {
  const navegar = useNavigate()

  const {
    servicios,
    cargando: cargandoServicios,
    error: errorServicios,
    recargarCatalogo
  } = useContext(CatalogoContext)

  const {
    nutricionistas,
    cargando: cargandoNutricionistas,
    error: errorNutricionistas,
    recargarNutricionistas
  } = usarNutricionistas()

  const cargando = cargandoServicios || cargandoNutricionistas
  const error = errorServicios || errorNutricionistas

  function continuarConfirmacion(datos) {
    navegar('/confirmar-cita', {
      state: datos
    })
  }

  function reintentarCarga() {
    recargarCatalogo()
    recargarNutricionistas()
  }

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <div className="text-center mb-4">
          <h1 className="text-success">
            Agendar cita nutricional
          </h1>

          <p className="text-muted">
            Selecciona tu servicio y horario de atención.
          </p>
        </div>

        <Card
          className="mx-auto shadow-sm border-0"
          style={{ maxWidth: '700px' }}
        >
          <Card.Body className="p-4">
            <h4 className="mb-4">Datos de la reserva</h4>

            <Alert variant="info">
              <div>Horarios de atención:</div>
              <div>Lunes a jueves: 09:00 a 17:00</div>
              <div>Viernes: 09:00 a 13:00</div>
              <div>Sábados y domingos: cerrado</div>
            </Alert>

            {cargando ? (
              <div className="text-center py-4" role="status">
                <Spinner animation="border" variant="success" />
                <p>Cargando servicios y nutricionistas...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">
                <p>{error}</p>

                <Button
                  variant="outline-danger"
                  onClick={reintentarCarga}
                >
                  Reintentar
                </Button>
              </Alert>
            ) : servicios.length === 0 ||
                nutricionistas.length === 0 ? (
              <Alert variant="warning">
                No hay servicios o nutricionistas disponibles.
              </Alert>
            ) : (
              <FormularioAgendamiento
                servicios={servicios}
                nutricionistas={nutricionistas}
                alContinuar={continuarConfirmacion}
                alVolver={() => navegar('/menu')}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default AgendarCita
