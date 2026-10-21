import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import CampoFormulario from '../molecules/CampoFormulario'
import BotonLogin from '../atoms/BotonLogin'

const usuariosPermitidos = {
  'joa.berrios@duocuc.cl': '1212',
  'das.rojas@duocuc.cl': '2121'
}

const dominiosPermitidos = [
  '@duocuc.cl',
  '@gmail.com',
  '@profesorduoc.cl'
]

function FormularioLogin() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')

  const navigate = useNavigate()

  function iniciarSesion(event) {
    event.preventDefault()

    const correoLimpio = correo.trim().toLowerCase()
    const contrasenaLimpia = contrasena.trim()

    if (!correoLimpio || !contrasenaLimpia) {
      setMensaje('Debe completar todos los campos')
      return
    }

    const correoValido = dominiosPermitidos.some((dominio) =>
      correoLimpio.endsWith(dominio)
    )

    if (!correoValido) {
      setMensaje(
        'Correo no permitido. Utilice @duocuc.cl, @gmail.com o @profesorduoc.cl'
      )
      return
    }

    try {
      const usuariosGuardados = JSON.parse(
        localStorage.getItem('nutrivida_usuarios') || '[]'
      )

      if (!Array.isArray(usuariosGuardados)) {
        throw new Error('Datos de usuarios inválidos')
      }

      const usuarioRegistrado = usuariosGuardados.find(
        (usuario) => usuario.correo === correoLimpio
      )

      const cuentaOriginal = Object.hasOwn(
        usuariosPermitidos,
        correoLimpio
      )

      if (!cuentaOriginal && !usuarioRegistrado) {
        setMensaje('Cuenta no encontrada')
        return
      }

      const contrasenaCorrecta = cuentaOriginal
        ? usuariosPermitidos[correoLimpio]
        : usuarioRegistrado.contrasena

      if (contrasenaCorrecta !== contrasenaLimpia) {
        setMensaje('Contraseña incorrecta')
        return
      }

      setMensaje('')
      navigate('/menu')
    } catch {
      setMensaje('No se pudieron comprobar los usuarios registrados.')
    }
  }

  return (
    <Form onSubmit={iniciarSesion}>
      <h2 className="text-center mb-4">
        Iniciar sesión
      </h2>

      <CampoFormulario
        etiqueta="Correo electrónico"
        tipo="email"
        placeholder="Ingrese su correo"
        valor={correo}
        alCambiar={(event) => {
          setCorreo(event.target.value)
          setMensaje('')
        }}
      />

      <CampoFormulario
        etiqueta="Contraseña"
        tipo="password"
        placeholder="Ingrese su contraseña"
        valor={contrasena}
        alCambiar={(event) => {
          setContrasena(event.target.value)
          setMensaje('')
        }}
      />

      <BotonLogin texto="Iniciar sesión" />

      {mensaje && (
        <p className="text-center mt-3 text-danger">
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