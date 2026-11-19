import {
  Container,
  Row,
  Col,
  Button,
  Badge
} from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'
import { useAutenticacion } from '../hooks/useAutenticacion'
import TarjetaMenu from '../components/molecules/TarjetaMenu'

function MenuPrincipal() {
  const { usuario, cerrarSesion } = useAutenticacion()
  const navegar = useNavigate()

  const esAdministrador =
    usuario?.rol === 'administrador'

  const esPaciente =
    usuario?.rol === 'paciente'

  function salir() {
    cerrarSesion()
    navegar('/login', { replace: true })
  }

  return (
    <Container className="py-5">

      <div className="text-center mb-5">

        <h1 className="text-success fw-bold">
          NutriVida
        </h1>

        <h2>
          Bienvenido, {usuario?.nombre}
        </h2>

        <Badge bg={esAdministrador ? 'dark' : 'success'}>
          {esAdministrador ? 'Administrador' : 'Paciente'}
        </Badge>

        <p className="text-muted mt-3">
          Tu bienestar comienza con una buena alimentación.
          Explora nuestros servicios y agenda tu atención.
        </p>

      </div>

      <Row className="g-4 justify-content-center">

        <Col md={6} lg={esPaciente ? 6 : 4}>
          <TarjetaMenu
            icono="🥗"
            titulo="Catálogo de servicios"
            descripcion="Conoce nuestras consultas y programas nutricionales."
            textoBoton="Ver servicios"
            ruta="/catalogo"
          />
        </Col>

        <Col md={6} lg={esPaciente ? 6 : 4}>
          <TarjetaMenu
            icono="📋"
            titulo="Categorías"
            descripcion="Encuentra los servicios según el tipo de atención."
            textoBoton="Ver categorías"
            ruta="/categorias"
          />
        </Col>

        {esPaciente && (
          <>
            <Col md={6}>
              <TarjetaMenu
                icono="📅"
                titulo="Agendar una cita"
                descripcion="Reserva una atención nutricional de forma sencilla."
                textoBoton="Agendar ahora"
                ruta="/nueva-cita"
              />
            </Col>

            <Col md={6}>
              <TarjetaMenu
                icono="🗓️"
                titulo="Mis citas"
                descripcion="Consulta el historial de tus reservas nutricionales."
                textoBoton="Ver mis citas"
                ruta="/mis-citas"
              />
            </Col>
          </>
        )}

        {esAdministrador && (
          <Col md={6} lg={4}>
            <TarjetaMenu
              icono="⚙️"
              titulo="Administrar servicios"
              descripcion="Agrega, edita o elimina servicios nutricionales."
              textoBoton="Administrar"
              ruta="/admin-servicios"
              variante="dark"
            />
          </Col>
        )}

      </Row>

      <div className="text-center mt-5">
        <Button
          onClick={salir}
          variant="outline-danger"
        >
          Cerrar sesión
        </Button>
      </div>

    </Container>
  )
}

export default MenuPrincipal


