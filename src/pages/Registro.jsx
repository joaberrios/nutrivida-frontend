import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'

const dominiosPermitidos = [
  '@duocuc.cl',
  '@gmail.com',
  '@profesorduoc.cl'
]

const cuentasExistentes = [
  'joa.berrios@duocuc.cl',
  'das.rojas@duocuc.cl'
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

  function cambiarCampo(event) {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }))

    setError('')
    setMensaje('')
  }

  function registrarUsuario(event) {
    event.preventDefault()

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

    const dominioValido = dominiosPermitidos.some((dominio) =>
      correo.endsWith(dominio)
    )

    if (!dominioValido) {
      setError(
        'Solo se permiten correos @duocuc.cl, @gmail.com o @profesorduoc.cl.'
      )
      return
    }

    if (contrasena.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.')
      return
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      const usuariosGuardados = JSON.parse(
        localStorage.getItem('nutrivida_usuarios') || '[]'
      )

      if (!Array.isArray(usuariosGuardados)) {
        throw new Error('Los datos de usuarios no son válidos.')
      }

      const existeCuenta =
        cuentasExistentes.includes(correo) ||
        usuariosGuardados.some((usuario) => usuario.correo === correo)

      if (existeCuenta) {
        setError('Ya existe una cuenta con ese correo electrónico.')
        return
      }

      const nuevoUsuario = {
        nombre,
        apellido,
        correo,
        contrasena
      }

      localStorage.setItem(
        'nutrivida_usuarios',
        JSON.stringify([...usuariosGuardados, nuevoUsuario])
      )

      setMensaje('Cuenta creada correctamente. Ya puedes iniciar sesión.')
      setError('')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch {
      setError('No se pudo guardar la cuenta. Inténtalo nuevamente.')
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

          {error && <Alert variant="danger">{error}</Alert>}
          {mensaje && <Alert variant="success">{mensaje}</Alert>}

          <Form onSubmit={registrarUsuario} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarCampo}
                placeholder="Ingresa tu nombre"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formulario.apellido}
                onChange={cambiarCampo}
                placeholder="Ingresa tu apellido"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={cambiarCampo}
                placeholder="Ingresa tu correo"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="contrasena"
                value={formulario.contrasena}
                onChange={cambiarCampo}
                placeholder="Crea una contraseña"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmarContrasena"
                value={formulario.confirmarContrasena}
                onChange={cambiarCampo}
                placeholder="Repite tu contraseña"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="success"
              className="w-100"
            >
              Registrarse
            </Button>
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