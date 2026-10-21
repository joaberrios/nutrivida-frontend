import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Card } from 'react-bootstrap'
import { ServiciosContext } from '../context/ServiciosContext'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import Precio from '../components/atoms/Precio'
import EtiquetaModalidad from '../components/atoms/EtiquetaModalidad'

function DetalleServicio() {
  const { codigo } = useParams()
  const { servicios } = useContext(ServiciosContext)

  const servicio = servicios.find(
    (servicio) => servicio.codigo === codigo
  )

  if (!servicio) {
    return (
      <PlantillaPublica>
        <Container className="py-5 text-center">
          <h2>Servicio no encontrado</h2>
        </Container>
      </PlantillaPublica>
    )
  }

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>{servicio.nombre}</Card.Title>

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
              <EtiquetaModalidad modalidad={servicio.modalidad} />
            </p>

            <p>
              <strong>Profesional:</strong> {servicio.profesional}
            </p>

            <Precio valor={servicio.precio} />
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default DetalleServicio