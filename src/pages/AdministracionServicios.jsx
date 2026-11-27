import { useContext, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Container,
  Card,
  Alert,
  Spinner,
  Badge,
  Button
} from 'react-bootstrap'

import PlantillaPublica from '../components/templates/PlantillaPublica'
import TablaServicios from '../components/organisms/TablaServicios'
import FormularioServicio from '../components/organisms/FormularioServicio'
import { ServiciosContext } from '../context/ServiciosContext'

// Leer los datos del usuario autenticado
function leerUsuarioSesion() {
  try {
    return JSON.parse(
      sessionStorage.getItem('nutrivida_usuario') || 'null'
    )
  } catch {
    return null
  }
}

function AdministracionServicios() {
  const navigate = useNavigate()

  const {
    servicios,
    cargando,
    errorServicios,
    agregarServicio,
    editarServicio,
    borrarServicio
  } = useContext(ServiciosContext)

  const [usuarioSesion] = useState(leerUsuarioSesion)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [servicioEditar, setServicioEditar] = useState(null)

  const [guardando, setGuardando] = useState(false)
  const [codigoProcesando, setCodigoProcesando] = useState(null)

  const [mensajeErrorFormulario, setMensajeErrorFormulario] = useState('')
  const [mensajeErrorAccion, setMensajeErrorAccion] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  // Abrir formulario para registrar
  function abrirFormularioCrear() {
    setServicioEditar(null)
    setMensajeErrorFormulario('')
    setMensajeErrorAccion('')
    setMostrarFormulario(true)
  }

  // Abrir formulario para editar
  function abrirFormularioEditar(servicio) {
    setServicioEditar(servicio)
    setMensajeErrorFormulario('')
    setMensajeErrorAccion('')
    setMostrarFormulario(true)
  }

  // Controlar errores de autenticacion
  function comprobarErrorAutenticacion(error) {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('nutrivida_token')
      sessionStorage.removeItem('nutrivida_usuario')

      navigate('/login', { replace: true })
      return true
    }

    return false
  }

  // Crear o actualizar un servicio
  async function guardarServicio(datos) {
    setGuardando(true)
    setMensajeErrorFormulario('')
    setMensajeExito('')

    try {
      if (servicioEditar) {
        await editarServicio(servicioEditar.codigo, datos)

        setMensajeExito(
          'Servicio actualizado correctamente'
        )
      } else {
        await agregarServicio(datos)

        setMensajeExito(
          'Servicio creado correctamente'
        )
      }

      setMostrarFormulario(false)
      setServicioEditar(null)

    } catch (error) {
      if (comprobarErrorAutenticacion(error)) {
        return
      }

      setMensajeErrorFormulario(
        error.response?.data?.mensaje ||
        'No se pudo guardar el servicio'
      )

    } finally {
      setGuardando(false)
    }
  }

  // Desactivar un servicio sin eliminarlo de PostgreSQL
  async function procesarDesactivacion(servicio) {
    const confirmado = window.confirm(
      `¿Estas seguro de desactivar el servicio ${servicio.nombre}?`
    )

    if (!confirmado) {
      return
    }

    setCodigoProcesando(servicio.codigo)
    setMensajeErrorAccion('')
    setMensajeExito('')

    try {
      await borrarServicio(servicio.codigo)

      setMensajeExito(
        'Servicio desactivado correctamente'
      )

    } catch (error) {
      if (comprobarErrorAutenticacion(error)) {
        return
      }

      setMensajeErrorAccion(
        error.response?.data?.mensaje ||
        'No se pudo desactivar el servicio'
      )

    } finally {
      setCodigoProcesando(null)
    }
  }

  // Restringir el acceso a administradores
  if (usuarioSesion?.rol !== 'administrador') {
    return <Navigate to="/login" replace />
  }

  return (
    <PlantillaPublica>
      <Container className="py-5">

        <div className="mb-4">
          <h1 className="text-success">
            Administración de servicios
          </h1>

          <p className="text-muted">
            Gestiona los servicios y planes nutricionales de NutriVida.
          </p>
        </div>

        {mensajeExito && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setMensajeExito('')}
          >
            {mensajeExito}
          </Alert>
        )}

        {mensajeErrorAccion && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setMensajeErrorAccion('')}
          >
            {mensajeErrorAccion}
          </Alert>
        )}

        <Card className="shadow-sm">
          <Card.Body>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

              <div>
                <h2 className="h5 mb-1">
                  Servicios registrados
                </h2>

                <Badge bg="success">
                  {servicios.length} servicios
                </Badge>
              </div>

              <Button
                variant="success"
                onClick={abrirFormularioCrear}
                disabled={cargando}
              >
                + Nuevo servicio
              </Button>

            </div>

            {cargando && (
              <div className="text-center py-4">
                <Spinner animation="border" variant="success" />
                <p className="mt-2">
                  Cargando servicios...
                </p>
              </div>
            )}

            {!cargando && errorServicios && (
              <Alert variant="danger">
                {errorServicios}
              </Alert>
            )}

            {!cargando && !errorServicios && servicios.length === 0 && (
              <Alert variant="info">
                No hay servicios registrados.
              </Alert>
            )}

            {!cargando && !errorServicios && servicios.length > 0 && (
              <TablaServicios
                servicios={servicios}
                alEditar={abrirFormularioEditar}
                alDesactivar={procesarDesactivacion}
                codigoProcesando={codigoProcesando}
              />
            )}

          </Card.Body>
        </Card>

        {mostrarFormulario && (
          <FormularioServicio
            alCerrar={() => {
              if (!guardando) {
                setMostrarFormulario(false)
                setServicioEditar(null)
              }
            }}
            alGuardar={guardarServicio}
            cargando={guardando}
            mensajeError={mensajeErrorFormulario}
            servicioEditar={servicioEditar}
          />
        )}

      </Container>
    </PlantillaPublica>
  )
}

export default AdministracionServicios
