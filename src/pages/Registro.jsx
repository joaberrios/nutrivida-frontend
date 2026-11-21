
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap'

import { registrarPaciente } from '../services/autenticacionService'

const dominiosPermitidos = [
  '@duocuc.cl',
  '@gmail.com',
  '@profesorduoc.cl'
]

function Registro() {
  const navigate = useNavigate()

  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  })

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!mensaje) return

    const temporizador = setTimeout(() => {
      navigate('/login')
    }, 1500)

    return () => clearTimeout(temporizador)
  }, [mensaje, navigate])

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

    setError('')
    setMensaje('')
  }

  async function registrarUsuario(evento) {
    evento.preventDefault()

    if (cargando || mensaje) return

    setError('')

    const nombre = formulario.nombre.trim()
    const apellido = formulario.apellido.trim()
    const correo = formulario.correo.trim().toLowerCase()
    const contrasena = formulario.contrasena
    const confirmarContrasena = formulario.confirmarContrasena

    if (
      !nombre ||
      !apellido ||
      !correo ||
      !contrasena ||
      !confirmarContrasena
    ) {
      setError('Debes completar todos los campos.')
      return
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formatoCorreo.test(correo)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }

    const dominioValido = dominiosPermitidos.some(
      (dominio) => correo.endsWith(dominio)
    )

    if (!dominioValido) {
      setError(
        'Solo se permiten correos @duocuc.cl, @gmail.com o @profesorduoc.cl.'
      )
      return
    }

    if (
      nombre.length > 100 ||
      apellido.length > 100 ||
      correo.length > 255
    ) {
      setError('Los datos ingresados son demasiado largos.')
      return
    }

    if (
      contrasena.length < 15 ||
      contrasena.length > 128
    ) {
      setError(
        'La contraseña debe tener entre 15 y 128 caracteres.'
      )
      return
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)

    try {
      await registrarPaciente({
        nombre,
        apellido,
        correo,
        contrasena
      })

      setFormulario({
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: ''
      })

      setMensaje(
        'Cuenta creada correctamente. Ya puedes iniciar sesión.'
      )

    } catch (error) {
      if (error.estado === 409) {
        setError(
          'Ya existe una cuenta con ese correo electrónico.'
        )
      } else if (error.estado === 429) {
        setError(
          'Demasiados intentos. Inténtalo más tarde.'
        )
      } else {
        setError(
          error.message || 'No se pudo registrar la cuenta.'
        )
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <Container className="py-5">
      <Card
        className="shadow-sm mx-auto"
        style={{ maxWidth: '500px' }}
      >
        <Card.Body className="p-4">

          <h2 className="text-center text-success mb-4">
            Crear cuenta
          </h2>

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          {mensaje && (
            <Alert variant="success">{mensaje}</Alert>
          )}

          <Form onSubmit={registrarUsuario} noValidate>

            <fieldset disabled={cargando || Boolean(mensaje)}>

              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre</Form.Label>

                <Form.Control
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                  placeholder="Ingresa tu nombre"
                  autoComplete="given-name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="apellido">
                <Form.Label>Apellido</Form.Label>

                <Form.Control
                  type="text"
                  name="apellido"
                  value={formulario.apellido}
                  onChange={cambiarCampo}
                  placeholder="Ingresa tu apellido"
                  autoComplete="family-name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="correo">
                <Form.Label>Correo electrónico</Form.Label>

                <Form.Control
                  type="email"
                  name="correo"
                  value={formulario.correo}
                  onChange={cambiarCampo}
                  placeholder="Ingresa tu correo"
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contrasena">
                <Form.Label>Contraseña</Form.Label>

                <Form.Control
                  type="password"
                  name="contrasena"
                  value={formulario.contrasena}
                  onChange={cambiarCampo}
                  placeholder="Crea una contraseña"
                  autoComplete="new-password"
                />

                <Form.Text className="text-muted">
                  Debe tener al menos 15 caracteres.
                </Form.Text>
              </Form.Group>

              <Form.Group
                className="mb-4"
                controlId="confirmarContrasena"
              >
                <Form.Label>
                  Confirmar contraseña
                </Form.Label>

                <Form.Control
                  type="password"
                  name="confirmarContrasena"
                  value={formulario.confirmarContrasena}
                  onChange={cambiarCampo}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                />
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="w-100"
              >
                {cargando ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Registrando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </Button>

            </fieldset>

          </Form>

          <p className="text-center mt-3 mb-0">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login">
              Iniciar sesión
            </Link>
          </p>

        </Card.Body>
      </Card>
    </Container>
  )
}

export default Registro
