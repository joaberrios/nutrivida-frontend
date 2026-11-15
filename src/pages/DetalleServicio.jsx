
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Card,
  Spinner,
  Alert,
  Button
} from 'react-bootstrap'

import { CatalogoContext } from '../context/CatalogoContext'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import Precio from '../components/atoms/Precio'
import EtiquetaModalidad from '../components/atoms/EtiquetaModalidad'

function DetalleServicio() {
  const { codigo } = useParams()

  const {
    servicios,
    cargando,
    error,
    recargarCatalogo
  } = useContext(CatalogoContext)

  const servicio = servicios.find(
    (servicio) => servicio.codigo === codigo
  )

  return (
    <PlantillaPublica>
      <Container className="py-5">

        {cargando ? (
          <div className="text-center" role="status">
            <Spinner animation="border" variant="success" />

            <p className="mt-3">
              Cargando información del servicio...
            </p>
          </div>

        ) : error ? (
          <Alert variant="danger">
            <p>{error}</p>

            <Button
              variant="outline-danger"
              onClick={recargarCatalogo}
            >
              Reintentar
            </Button>
          </Alert>

        ) : !servicio ? (
          <div className="text-center">
            <h2>Servicio no encontrado</h2>
          </div>

        ) : (
          <Card className="shadow-sm">
            <Card.Body>

              <Card.Title>
                {servicio.nombre}
              </Card.Title>

              <Card.Subtitle className="mb-3 text-muted">
                {servicio.tipo}
              </Card.Subtitle>

              <Card.Text>
                {servicio.descripcion}
              </Card.Text>

              <p>
                <strong>Código:</strong> {servicio.codigo}
              </p>

              <p>
                <strong>Duración:</strong> {servicio.duracion}
              </p>

              <p>
                <strong>Modalidad: </strong>

                <EtiquetaModalidad
                  modalidad={servicio.modalidad}
                />
              </p>

              <p>
                <strong>Profesional:</strong> {servicio.profesional}
              </p>

              <Precio valor={servicio.precio} />

            </Card.Body>
          </Card>
        )}

      </Container>
    </PlantillaPublica>
  )
}

export default DetalleServicio
