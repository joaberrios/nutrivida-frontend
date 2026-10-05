import Card from 'react-bootstrap/Card'
import Precio from '../atoms/Precio'
import EtiquetaModalidad from '../atoms/EtiquetaModalidad'
import Boton from '../atoms/Boton'

function TarjetaServicio(props) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{props.nombre}</Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          {props.tipo}
        </Card.Subtitle>

        <Card.Text>
          {props.descripcion}
        </Card.Text>

        <p>
          <strong>Duración:</strong> {props.duracion}
        </p>

        <p>
          <strong>Modalidad: </strong>
          <EtiquetaModalidad modalidad={props.modalidad} />
        </p>

        <p>
          <strong>Profesional:</strong> {props.profesional}
        </p>

        <Precio valor={props.precio} />

        <Boton texto="Ver servicio" />
      </Card.Body>
    </Card>
  )
}

export default TarjetaServicio