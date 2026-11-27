import { useState } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'

// Datos iniciales del formulario
const datosIniciales = {
  codigo: '',
  tipo: '',
  nombre: '',
  duracion: '',
  modalidad: 'Presencial',
  profesional: 'Nutricionista',
  precio: '',
  descripcion: ''
}

function FormularioServicio({
  alCerrar,
  alGuardar,
  cargando,
  mensajeError,
  servicioEditar
}) {
  const [datos, setDatos] = useState(() => (
    servicioEditar
      ? {
          ...servicioEditar,
          precio: String(servicioEditar.precio)
        }
      : datosIniciales
  ))

  const [mensajeValidacion, setMensajeValidacion] = useState('')

  // Actualizar los campos del formulario
  function actualizarCampo(evento) {
    const { name, value } = evento.target

    setDatos((actuales) => ({
      ...actuales,
      [name]: name === 'codigo'
        ? value.toUpperCase()
        : value
    }))
  }

  // Validar y enviar los datos
  function procesarFormulario(evento) {
    evento.preventDefault()
    setMensajeValidacion('')

    const precio = Number(datos.precio)

    if (!Number.isSafeInteger(precio) || precio <= 0) {
      setMensajeValidacion(
        'El precio debe ser un numero entero positivo'
      )
      return
    }

    alGuardar({
      codigo: datos.codigo.trim().toUpperCase(),
      tipo: datos.tipo.trim(),
      nombre: datos.nombre.trim(),
      duracion: datos.duracion.trim(),
      modalidad: datos.modalidad.trim(),
      profesional: datos.profesional.trim(),
      precio,
      descripcion: datos.descripcion.trim()
    })
  }

  return (
    <Modal
      show
      onHide={alCerrar}
      centered
      size="lg"
      backdrop={cargando ? 'static' : true}
      keyboard={!cargando}
    >
      <Form onSubmit={procesarFormulario}>
        <Modal.Header closeButton={!cargando}>
          <Modal.Title>
            {servicioEditar
              ? 'Editar servicio'
              : 'Registrar servicio'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {mensajeError && (
            <Alert variant="danger">
              {mensajeError}
            </Alert>
          )}

          {mensajeValidacion && (
            <Alert variant="warning">
              {mensajeValidacion}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Codigo del servicio</Form.Label>
            <Form.Control
              name="codigo"
              value={datos.codigo}
              onChange={actualizarCampo}
              maxLength={20}
              pattern="[A-Z0-9]+"
              required
              disabled={Boolean(servicioEditar) || cargando}
              placeholder="Ejemplo: CN006"
            />
            <Form.Text muted>
              El codigo no se puede modificar despues de crear el servicio.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              name="tipo"
              value={datos.tipo}
              onChange={actualizarCampo}
              required
              disabled={cargando}
            >
              <option value="">Seleccione una categoria</option>
              <option value="Consulta">Consulta</option>
              <option value="Plan especializado">
                Plan especializado
              </option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre del servicio</Form.Label>
            <Form.Control
              name="nombre"
              value={datos.nombre}
              onChange={actualizarCampo}
              maxLength={150}
              required
              disabled={cargando}
              placeholder="Ingrese el nombre"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duracion</Form.Label>
            <Form.Control
              name="duracion"
              value={datos.duracion}
              onChange={actualizarCampo}
              maxLength={50}
              required
              disabled={cargando}
              placeholder="Ejemplo: 50 min"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Modalidad</Form.Label>
            <Form.Select
              name="modalidad"
              value={datos.modalidad}
              onChange={actualizarCampo}
              required
              disabled={cargando}
            >
              <option value="Presencial">Presencial</option>
              <option value="Online (video)">
                Online (video)
              </option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profesional</Form.Label>
            <Form.Control
              name="profesional"
              value={datos.profesional}
              onChange={actualizarCampo}
              maxLength={100}
              required
              disabled={cargando}
              placeholder="Ejemplo: Nutricionista"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio en pesos chilenos</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={datos.precio}
              onChange={actualizarCampo}
              min="1"
              max="2147483647"
              step="1"
              required
              disabled={cargando}
              placeholder="Ejemplo: 35000"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripcion</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={datos.descripcion}
              onChange={actualizarCampo}
              rows={4}
              maxLength={2000}
              required
              disabled={cargando}
              placeholder="Describa el servicio"
            />
          </Form.Group>
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
              : servicioEditar
                ? 'Guardar cambios'
                : 'Crear servicio'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default FormularioServicio
