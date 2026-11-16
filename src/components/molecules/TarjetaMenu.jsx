import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function TarjetaMenu({
  icono,
  titulo,
  descripcion,
  textoBoton,
  ruta,
  variante = 'success'
}) {
  return (
    <Card className="h-100 shadow-sm text-center">
      <Card.Body className="p-4 d-flex flex-column">

        <div className="fs-1 mb-3">
          {icono}
        </div>

        <Card.Title>{titulo}</Card.Title>

        <Card.Text>
          {descripcion}
        </Card.Text>

        <div className="mt-auto">
          <Button
            as={Link}
            to={ruta}
            variant={variante}
          >
            {textoBoton}
          </Button>
        </div>

      </Card.Body>
    </Card>
  )
}

export default TarjetaMenu
