import { Link } from 'react-router-dom'
import { Container, Button, Alert, Card } from 'react-bootstrap'

import FormularioUsuario from '../components/organisms/FormularioUsuario'
import TablaUsuarios from '../components/organisms/TablaUsuarios'
import { useAdministracionUsuarios } from '../hooks/useAdministracionUsuarios'

function AdminUsuarios() {
  const {
    usuarios,
    formulario,
    idEditando,
    detalle,
    cargando,
    procesando,
    error,
    mensaje,
    cargarUsuarios,
    cambiarCampo,
    seleccionarEditar,
    cancelar,
    guardarUsuario,
    consultar,
    desactivar
  } = useAdministracionUsuarios()

  return (
    <Container className="py-5">
      <Button
        as={Link}
        to="/menu"
        variant="outline-success"
        className="mb-3"
      >
        Volver al menú
      </Button>

      <h1 className="text-success mb-4">
        Administración de usuarios
      </h1>

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {mensaje && (
        <Alert variant="success">{mensaje}</Alert>
      )}

      <FormularioUsuario
        formulario={formulario}
        idEditando={idEditando}
        procesando={procesando}
        cambiarCampo={cambiarCampo}
        guardarUsuario={guardarUsuario}
        cancelar={cancelar}
      />

      {detalle && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h4 className="text-success">
              Detalle del usuario
            </h4>

            <p>ID: {detalle.id}</p>
            <p>Nombre: {detalle.nombre}</p>
            <p>Apellido: {detalle.apellido}</p>
            <p>Correo: {detalle.correo}</p>
            <p>Rol: {detalle.rol}</p>

            <Button
              variant="outline-secondary"
              onClick={() => consultar(detalle.id)}
            >
              Actualizar detalle
            </Button>
          </Card.Body>
        </Card>
      )}

      <TablaUsuarios
        usuarios={usuarios}
        cargando={cargando}
        procesando={procesando}
        consultar={consultar}
        seleccionarEditar={seleccionarEditar}
        desactivar={desactivar}
      />

      <Button
        variant="outline-success"
        className="mt-3"
        onClick={cargarUsuarios}
        disabled={cargando || procesando}
      >
        Actualizar lista
      </Button>
    </Container>
  )
}

export default AdminUsuarios
