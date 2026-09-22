import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import CampoFormulario from '../molecules/CampoFormulario'
import BotonLogin from '../atoms/BotonLogin'

function FormularioLogin() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')

  function iniciarSesion(event) {
    event.preventDefault()

    if (correo.trim() === '' || contrasena.trim() === '') {
      setMensaje('Debe completar todos los campos')
    } else {
      setMensaje('Inicio de sesión correcto')
    }
  }

  return (
    <Form onSubmit={iniciarSesion}>
      <h2 className="text-center mb-4">Iniciar sesión</h2>

      <CampoFormulario
        etiqueta="Correo electrónico"
        tipo="email"
        placeholder="Ingrese su correo"
        valor={correo}
        alCambiar={(event) => setCorreo(event.target.value)}
      />

      <CampoFormulario
        etiqueta="Contraseña"
        tipo="password"
        placeholder="Ingrese su contraseña"
        valor={contrasena}
        alCambiar={(event) => setContrasena(event.target.value)}
      />

      <BotonLogin texto="Iniciar sesión" />

      {mensaje && (
        <p className="text-center mt-3">{mensaje}</p>
      )}
    </Form>
  )
}

export default FormularioLogin