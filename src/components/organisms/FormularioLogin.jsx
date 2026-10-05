import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
 
import CampoFormulario from '../molecules/CampoFormulario'
import BotonLogin from '../atoms/BotonLogin'
 
function FormularioLogin() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
 
  const navigate = useNavigate()
 
  function iniciarSesion(event) {
    event.preventDefault()
 
    const correoLimpio = correo.trim().toLowerCase()
    const contrasenaLimpia = contrasena.trim()
 
    if (correoLimpio === '' || contrasenaLimpia === '') {
      setMensaje('Debe completar todos los campos')
      return
    }
 
    const dominiosPermitidos = [
      '@gmail.com',
      '@duocuc.cl',
      '@profesorduoc.cl'
    ]
 
    const correoValido =
      dominiosPermitidos.some((dominio) =>
        correoLimpio.endsWith(dominio)
      )
 
    if (!correoValido) {
      setMensaje('Correo no permitido')
      return
    }
 
    setMensaje('Inicio de sesión correcto')
    navigate('/menu')
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
        <p className="text-center mt-3">
          {mensaje}
        </p>
      )}
    </Form>
  )
}
 
export default FormularioLogin