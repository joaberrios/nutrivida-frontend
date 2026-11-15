
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Alert,
  Spinner
} from 'react-bootstrap'

import { CatalogoContext } from '../context/CatalogoContext'
import { usarAutenticacion } from '../context/AutenticacionContext'

import {
  crearServicioApi,
  actualizarServicioApi,
  eliminarServicioApi
} from '../services/serviciosService'

const formularioInicial = {
  codigo: '',
  tipo: '',
  nombre: '',
  duracion: '',
  modalidad: 'Presencial',
  profesional: '',
  precio: '',
  descripcion: ''
}

function AdminServicios() {
  const {
    servicios,
    cargando,
    error: errorCatalogo,
    recargarCatalogo
  } = useContext(CatalogoContext)

  const { token, cerrarSesion } = usarAutenticacion()

  const [formulario, setFormulario] = useState(formularioInicial)
  const [codigoEditando, setCodigoEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario(anterior => ({
      ...anterior,
      [name]: value
    }))

    setError('')
    setMensaje('')
  }

  function manejarError(error) {
    if (error.estado === 401) {
      cerrarSesion()
    } else if (error.estado === 403) {
      setError('No tienes permisos de administrador.')
    } else {
      setError(
        error.message || 'No se pudo realizar la operación.'
      )
    }
  }

  async function guardarServicio(evento) {
    evento.preventDefault()

    if (procesando) return

    setError('')
    setMensaje('')

    if (
      Object.values(formulario).some(
        valor => String(valor).trim() === ''
      )
    ) {
      setError('Debes completar todos los campos.')
      return
    }

    const precio = Number(formulario.precio)

    if (!Number.isInteger(precio) || precio <= 0) {
      setError(
        'El precio debe ser un número entero mayor que cero.'
      )
      return
    }

    const datos = {
      codigo: formulario.codigo.trim().toUpperCase(),
      tipo: formulario.tipo.trim(),
      nombre: formulario.nombre.trim(),
      duracion: formulario.duracion.trim(),
      modalidad: formulario.modalidad.trim(),
      profesional: formulario.profesional.trim(),
      precio,
      descripcion: formulario.descripcion.trim()
    }

    if (!/^[A-Z0-9]+$/.test(datos.codigo)) {
      setError(
        'El código solo puede contener letras y números.'
      )
      return
    }

    setProcesando(true)

    try {
      if (codigoEditando) {
        await actualizarServicioApi(
          codigoEditando,
          datos,
          token
        )

        setMensaje('Servicio actualizado correctamente.')
      } else {
        await crearServicioApi(datos, token)

        setMensaje('Servicio agregado correctamente.')
      }

      setFormulario(formularioInicial)
      setCodigoEditando(null)
      recargarCatalogo()

    } catch (error) {
      manejarError(error)
    } finally {
      setProcesando(false)
    }
  }

  function seleccionarEditar(servicio) {
    setFormulario({
      codigo: servicio.codigo,
      tipo: servicio.tipo,
      nombre: servicio.nombre,
      duracion: servicio.duracion,
      modalidad: servicio.modalidad,
      profesional: servicio.profesional,
      precio: servicio.precio,
      descripcion: servicio.descripcion
    })

    setCodigoEditando(servicio.codigo)
    setMensaje('')
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  async function eliminar(codigo) {
    if (procesando) return

    if (
      !window.confirm(
        '¿Seguro que deseas eliminar este servicio?'
      )
    ) return

    setProcesando(true)
    setError('')
    setMensaje('')

    try {
      await eliminarServicioApi(codigo, token)

      if (codigoEditando === codigo) {
        setFormulario(formularioInicial)
        setCodigoEditando(null)
      }

      setMensaje('Servicio eliminado correctamente.')
      recargarCatalogo()

    } catch (error) {
      manejarError(error)
    } finally {
      setProcesando(false)
    }
  }

  function cancelar() {
    setFormulario(formularioInicial)
    setCodigoEditando(null)
    setError('')
    setMensaje('')
  }

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
        Administración de servicios
      </h1>

      <Card className="mb-4 shadow-sm">
        <Card.Body>

          <h4 className="mb-3">
            {codigoEditando
              ? 'Editar servicio'
              : 'Agregar servicio'}
          </h4>

          {mensaje && (
            <Alert variant="success">{mensaje}</Alert>
          )}

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          <Form onSubmit={guardarServicio} noValidate>

            <fieldset disabled={procesando || cargando}>

              {[
                ['codigo', 'Código'],
                ['nombre', 'Nombre'],
                ['duracion', 'Duración'],
                ['profesional', 'Profesional'],
                ['precio', 'Precio'],
                ['descripcion', 'Descripción']
              ].map(([campo, etiqueta]) => (
                <Form.Group
                  className="mb-3"
                  key={campo}
                  controlId={campo}
                >
                  <Form.Label>{etiqueta}</Form.Label>

                  <Form.Control
                    name={campo}
                    type={campo === 'precio' ? 'number' : 'text'}
                    value={formulario[campo]}
                    onChange={cambiarCampo}
                    disabled={
                      campo === 'codigo' &&
                      Boolean(codigoEditando)
                    }
                  />
                </Form.Group>
              ))}

              <Form.Group
                className="mb-3"
                controlId="tipo"
              >
                <Form.Label>
                  Tipo de servicio
                </Form.Label>

                <Form.Select
                  name="tipo"
                  value={formulario.tipo}
                  onChange={cambiarCampo}
                >
                  <option value="">
                    Selecciona una categoría
                  </option>

                  <option value="Consulta">
                    Consulta
                  </option>

                  <option value="Plan especializado">
                    Plan especializado
                  </option>

                </Form.Select>
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="modalidad"
              >
                <Form.Label>Modalidad</Form.Label>

                <Form.Select
                  name="modalidad"
                  value={formulario.modalidad}
                  onChange={cambiarCampo}
                >
                  <option value="Presencial">
                    Presencial
                  </option>

                  <option value="Online (video)">
                    Online (video)
                  </option>

                  <option value="Híbrida">
                    Híbrida
                  </option>

                </Form.Select>
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="me-2"
              >
                {procesando
                  ? 'Procesando...'
                  : codigoEditando
                    ? 'Guardar cambios'
                    : 'Agregar servicio'}
              </Button>

              {codigoEditando && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelar}
                >
                  Cancelar
                </Button>
              )}

            </fieldset>

          </Form>
        </Card.Body>
      </Card>

      <h3 className="mb-3">
        Servicios registrados
      </h3>

      {cargando ? (
        <div className="text-center py-4" role="status">

          <Spinner
            animation="border"
            variant="success"
          />

          <p className="mt-3">
            Cargando servicios...
          </p>

        </div>

      ) : errorCatalogo ? (
        <Alert variant="danger">

          <p>{errorCatalogo}</p>

          <Button
            variant="outline-danger"
            onClick={recargarCatalogo}
          >
            Reintentar
          </Button>

        </Alert>

      ) : servicios.length === 0 ? (
        <Alert variant="info">
          No hay servicios registrados.
        </Alert>

      ) : (
        <div
          className="w-100"
          role="region"
          aria-label="Tabla de servicios registrados"
          tabIndex={0}
          style={{
            overflowX: 'auto',
            borderRadius: '8px'
          }}
        >
          <Table
            striped
            bordered
            hover
            className="mb-0"
            style={{ minWidth: '750px' }}
          >
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Modalidad</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {servicios.map(servicio => (
                <tr key={servicio.codigo}>

                  <td>{servicio.codigo}</td>

                  <td>{servicio.nombre}</td>

                  <td>{servicio.modalidad}</td>

                  <td>
                    ${Number(servicio.precio).toLocaleString('es-CL')}
                  </td>

                  <td>
                    <div className="d-flex gap-2">

                      <Button
                        variant="warning"
                        size="sm"
                        disabled={procesando}
                        onClick={() => seleccionarEditar(servicio)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        disabled={procesando}
                        onClick={() => eliminar(servicio.codigo)}
                      >
                        Eliminar
                      </Button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </Table>
        </div>
      )}

    </Container>
  )
}

export default AdminServicios
