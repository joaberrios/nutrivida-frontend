import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Container,
  Card,
  Alert,
  Spinner,
  Badge,
  Button
} from 'react-bootstrap'

import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario
} from '../services/usuariosService'

import TablaUsuarios from '../components/organisms/TablaUsuarios'
import FormularioUsuario from '../components/organisms/FormularioUsuario'

// Leer los datos de la sesion
function leerUsuarioSesion() {
  try {
    return JSON.parse(
      sessionStorage.getItem('nutrivida_usuario') || 'null'
    )
  } catch {
    return null
  }
}

function AdministracionUsuarios() {
  const navigate = useNavigate()

  const [usuarioSesion] = useState(leerUsuarioSesion)
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [usuarioProcesandoId, setUsuarioProcesandoId] = useState(null)

  const [mensajeError, setMensajeError] = useState('')
  const [mensajeErrorFormulario, setMensajeErrorFormulario] = useState('')
  const [mensajeErrorAccion, setMensajeErrorAccion] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState(null)

  // Cargar usuarios desde el backend
  useEffect(() => {
    if (usuarioSesion?.rol !== 'administrador') {
      return
    }

    let componenteActivo = true

    async function cargarUsuarios() {
      try {
        const resultado = await listarUsuarios()

        if (componenteActivo) {
          setUsuarios(resultado.usuarios || [])
        }

      } catch (error) {
        if (error.response?.status === 401) {
          sessionStorage.removeItem('nutrivida_token')
          sessionStorage.removeItem('nutrivida_usuario')

          navigate('/login', { replace: true })
          return
        }

        if (componenteActivo) {
          setMensajeError(
            error.response?.data?.mensaje ||
            'No se pudieron cargar los usuarios'
          )
        }

      } finally {
        if (componenteActivo) {
          setCargando(false)
        }
      }
    }

    cargarUsuarios()

    return () => {
      componenteActivo = false
    }

  }, [navigate, usuarioSesion])

  // Abrir formulario para crear
  function abrirFormularioCrear() {
    setUsuarioEditar(null)
    setMensajeErrorFormulario('')
    setMensajeErrorAccion('')
    setMostrarFormulario(true)
  }

  // Abrir formulario para editar
  function abrirFormularioEditar(usuario) {
    setUsuarioEditar(usuario)
    setMensajeErrorFormulario('')
    setMensajeErrorAccion('')
    setMostrarFormulario(true)
  }

  // Guardar un usuario nuevo o actualizado
  async function guardarUsuario(datos) {
    setGuardando(true)
    setMensajeErrorFormulario('')
    setMensajeExito('')

    try {
      if (usuarioEditar) {
        const resultado = await actualizarUsuario(
          usuarioEditar.id,
          datos
        )

        setUsuarios((actuales) =>
          actuales.map((usuario) =>
            String(usuario.id) === String(usuarioEditar.id)
              ? resultado.usuario
              : usuario
          )
        )

        setMensajeExito(
          resultado.mensaje || 'Usuario actualizado correctamente'
        )

      } else {
        const resultado = await crearUsuario(datos)

        setUsuarios((actuales) => [
          ...actuales,
          resultado.usuario
        ])

        setMensajeExito(
          resultado.mensaje || 'Usuario creado correctamente'
        )
      }

      setMostrarFormulario(false)
      setUsuarioEditar(null)

    } catch (error) {
      if (error.response?.status === 401) {
        sessionStorage.removeItem('nutrivida_token')
        sessionStorage.removeItem('nutrivida_usuario')

        navigate('/login', { replace: true })
        return
      }

      setMensajeErrorFormulario(
        error.response?.data?.mensaje ||
        'No se pudo guardar el usuario'
      )

    } finally {
      setGuardando(false)
    }
  }

  // Desactivar un usuario sin eliminarlo de la base de datos
  async function procesarDesactivacion(usuario) {
    if (String(usuario.id) === String(usuarioSesion.id)) {
      setMensajeErrorAccion(
        'No puedes desactivar tu propia cuenta de administrador'
      )
      return
    }

    const confirmado = window.confirm(
      `¿Estás seguro de desactivar a ${usuario.nombre} ${usuario.apellido}?`
    )

    if (!confirmado) {
      return
    }

    setUsuarioProcesandoId(usuario.id)
    setMensajeErrorAccion('')
    setMensajeExito('')

    try {
      // Ejecutar la desactivacion en el backend
      await desactivarUsuario(usuario.id)

      // Actualizar solamente el usuario seleccionado
      setUsuarios((actuales) =>
        actuales.map((actual) =>
          String(actual.id) === String(usuario.id)
            ? { ...actual, activo: false }
            : actual
        )
      )

      setMensajeExito('Usuario desactivado correctamente')

    } catch (error) {
      if (error.response?.status === 401) {
        sessionStorage.removeItem('nutrivida_token')
        sessionStorage.removeItem('nutrivida_usuario')

        navigate('/login', { replace: true })
        return
      }

      setMensajeErrorAccion(
        error.response?.data?.mensaje ||
        'No se pudo desactivar el usuario'
      )

    } finally {
      setUsuarioProcesandoId(null)
    }
  }

  // Restringir acceso a administradores
  if (usuarioSesion?.rol !== 'administrador') {
    return <Navigate to="/login" replace />
  }

  return (
    <Container className="py-5">

      <div className="mb-4">
        <h1 className="text-success">
          Administración de usuarios
        </h1>

        <p className="text-muted">
          Gestión de usuarios registrados en NutriVida.
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
                Usuarios registrados
              </h2>

              <Badge bg="success">
                {usuarios.length} usuarios
              </Badge>
            </div>

            <Button
              variant="success"
              onClick={abrirFormularioCrear}
            >
              + Nuevo usuario
            </Button>

          </div>

          {cargando && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">
                Cargando usuarios...
              </p>
            </div>
          )}

          {!cargando && mensajeError && (
            <Alert variant="danger">
              {mensajeError}
            </Alert>
          )}

          {!cargando && !mensajeError && usuarios.length === 0 && (
            <Alert variant="info">
              No hay usuarios registrados.
            </Alert>
          )}

          {!cargando && !mensajeError && usuarios.length > 0 && (
            <TablaUsuarios
              usuarios={usuarios}
              alEditar={abrirFormularioEditar}
              alDesactivar={procesarDesactivacion}
              usuarioProcesandoId={usuarioProcesandoId}
            />
          )}

        </Card.Body>
      </Card>

      {mostrarFormulario && (
        <FormularioUsuario
          alCerrar={() => {
            if (!guardando) {
              setMostrarFormulario(false)
              setUsuarioEditar(null)
            }
          }}
          alGuardar={guardarUsuario}
          cargando={guardando}
          mensajeError={mensajeErrorFormulario}
          usuarioEditar={usuarioEditar}
        />
      )}

    </Container>
  )
}

export default AdministracionUsuarios
