
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import CampoFormulario from '../molecules/CampoFormulario'
import BotonLogin from '../atoms/BotonLogin'
import { usarAutenticacion } from '../../context/AutenticacionContext'

const dominiosPermitidos = [
  '@duocuc.cl',
  '@gmail.com',
  '@profesorduoc.cl'
]

function FormularioLogin() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()

  const {
    iniciarSesion,
    sesionVencida
  } = usarAutenticacion()

  async function enviarFormulario(evento) {
    evento.preventDefault()

    if (cargando) return

    setMensaje('')

    const correoLimpio = correo.trim().toLowerCase()

    if (!correoLimpio || !contrasena) {
      setMensaje('Debe completar todos los campos')
      return
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formatoCorreo.test(correoLimpio)) {
      setMensaje('Ingrese un correo electrónico válido')
      return
    }

    const correoValido = dominiosPermitidos.some(
      (dominio) => correoLimpio.endsWith(dominio)
    )

    if (!correoValido) {
      setMensaje(
        'Correo no permitido. Utilice @duocuc.cl, @gmail.com o @profesorduoc.cl'
      )
      return
    }

    setCargando(true)

    try {
      await iniciarSesion(correoLimpio, contrasena)

      setContrasena('')
      setMensaje('')

      navigate('/menu', { replace: true })

    } catch (error) {
      if (error.estado === 401) {
        setMensaje('Correo o contraseña incorrectos')
      } else if (error.estado === 429) {
        setMensaje(
          'Demasiados intentos. Inténtelo más tarde.'
        )
      } else {
        setMensaje(
          error.message || 'No se pudo iniciar sesión'
        )
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <Form onSubmit={enviarFormulario} noValidate>

      <h2 className="text-center mb-4">
        Iniciar sesión
      </h2>

      {sesionVencida && (
        <p className="text-center text-warning" role="alert">
          Su sesión ha vencido. Inicie sesión nuevamente.
        </p>
      )}

      <fieldset disabled={cargando}>

        <CampoFormulario
          etiqueta="Correo electrónico"
          tipo="email"
          placeholder="Ingrese su correo"
          valor={correo}
          alCambiar={(evento) => {
            setCorreo(evento.target.value)
            setMensaje('')
          }}
        />

        <CampoFormulario
          etiqueta="Contraseña"
          tipo="password"
          placeholder="Ingrese su contraseña"
          valor={contrasena}
          alCambiar={(evento) => {
            setContrasena(evento.target.value)
            setMensaje('')
          }}
        />

        <BotonLogin
          texto={
            cargando
              ? 'Iniciando sesión...'
              : 'Iniciar sesión'
          }
        />

      </fieldset>

      {mensaje && (
        <p
          className="text-center mt-3 text-danger"
          role="alert"
        >
          {mensaje}
        </p>
      )}

      <p className="text-center mt-3">
        ¿No tienes una cuenta?{' '}

        <Link to="/registro">
          Regístrate aquí
        </Link>
      </p>

    </Form>
  )
}

export default FormularioLogin

