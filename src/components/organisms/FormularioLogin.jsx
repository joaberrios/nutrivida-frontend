import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

import CampoFormulario from '../molecules/CampoFormulario'
import BotonLogin from '../atoms/BotonLogin'
import { iniciarSesion } from '../../services/autenticacionService'

function FormularioLogin() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()

  async function procesarInicioSesion(event) {
    event.preventDefault()

    if (cargando) return

    setMensaje('')

    const correoLimpio = correo.trim().toLowerCase()

    if (!correoLimpio || !contrasena.trim()) {
      setMensaje('Debe completar todos los campos')
      return
    }

    const dominiosPermitidos = [
      '@gmail.com',
      '@duocuc.cl',
      '@profesorduoc.cl',
      '@hotmail.com'
    ]

    const correoValido = dominiosPermitidos.some(
      dominio => correoLimpio.endsWith(dominio)
    )

    if (!correoValido) {
      setMensaje('Correo no permitido')
      return
    }

    setCargando(true)

    try {
      const resultado = await iniciarSesion({
        correo: correoLimpio,
        contrasena
      })

      if (!resultado.accessToken || !resultado.usuario) {
        setMensaje('Respuesta del servidor invalida')
        return
      }

      sessionStorage.setItem(
        'nutrivida_token',
        resultado.accessToken
      )

      sessionStorage.setItem(
        'nutrivida_usuario',
        JSON.stringify(resultado.usuario)
      )

      navigate('/inicio')

    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
        'No se pudo conectar con el servidor'
      )

    } finally {
      setCargando(false)
    }
  }

  return (
    <Form onSubmit={procesarInicioSesion}>
      <h2 className="text-center mb-4">
        Iniciar sesión
      </h2>

      <CampoFormulario
        etiqueta="Correo electrónico"
        tipo="email"
        placeholder="Ingrese su correo"
        valor={correo}
        alCambiar={event => setCorreo(event.target.value)}
      />

      <CampoFormulario
        etiqueta="Contraseña"
        tipo="password"
        placeholder="Ingrese su contraseña"
        valor={contrasena}
        alCambiar={event => setContrasena(event.target.value)}
      />

      <BotonLogin
        texto={cargando ? 'Ingresando...' : 'Iniciar sesión'}
      />

      {mensaje && (
        <p className="text-center text-danger mt-3" role="alert">
          {mensaje}
        </p>
      )}
    </Form>
  )
}

export default FormularioLogin
