import { useEffect, useState } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'

// Formulario para registrar y editar usuarios
function FormularioUsuario({
  alCerrar,
  alGuardar,
  cargando,
  mensajeError,
  usuarioEditar = null
}) {
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: ''
  })

  // Cargar los datos del usuario cuando se edita
  useEffect(() => {
    setDatos({
      nombre: usuarioEditar?.nombre || '',
      apellido: usuarioEditar?.apellido || '',
      correo: usuarioEditar?.correo || '',
      contrasena: ''
    })
  }, [usuarioEditar])

  // Actualizar los campos del formulario
  function actualizarCampo(evento) {
    const { name, value } = evento.target

    setDatos((actuales) => ({
      ...actuales,
      [name]: value
    }))
  }

  // Preparar los datos para guardar
  function procesarFormulario(evento) {
    evento.preventDefault()

    const datosEnviar = {
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      correo: datos.correo.trim().toLowerCase()
    }

    // La contraseña solamente se envía al crear
    if (!usuarioEditar) {
      datosEnviar.contrasena = datos.contrasena
    }

    alGuardar(datosEnviar)
  }

  return (
    <Modal
      show
      onHide={alCerrar}
      centered
      backdrop={cargando ? 'static' : true}
      keyboard={!cargando}
    >
      <Form onSubmit={procesarFormulario}>
        <Modal.Header closeButton={!cargando}>
          <Modal.Title>
            {usuarioEditar ? 'Editar usuario' : 'Registrar usuario'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {mensajeError && (
            <Alert variant="danger">
              {mensajeError}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre"
              value={datos.nombre}
              onChange={actualizarCampo}
              maxLength={100}
              required
              placeholder="Ingrese el nombre"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              name="apellido"
              value={datos.apellido}
              onChange={actualizarCampo}
              maxLength={100}
              required
              placeholder="Ingrese el apellido"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              value={datos.correo}
              onChange={actualizarCampo}
              maxLength={255}
              required
              placeholder="ejemplo@gmail.com"
            />
          </Form.Group>

          {!usuarioEditar && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={datos.contrasena}
                  onChange={actualizarCampo}
                  minLength={15}
                  maxLength={128}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 15 caracteres"
                />

                <Form.Text muted>
                  La contraseña debe tener entre 15 y 128 caracteres.
                </Form.Text>
              </Form.Group>

              <Alert variant="info" className="mb-0">
                El usuario será registrado con el rol paciente.
              </Alert>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={alCerrar}
            disabled={cargando}
          >
            Cancelar
          </Button>

          <Button
            variant="success"
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? 'Guardando...'
              : usuarioEditar
                ? 'Guardar cambios'
                : 'Crear usuario'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default FormularioUsuario
