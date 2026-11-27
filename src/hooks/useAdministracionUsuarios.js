
import { useCallback, useEffect, useState } from 'react'
import { useAutenticacion } from './useAutenticacion'

import {
  listarUsuarios,
  consultarUsuario,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario
} from '../services/usuariosService'

const formularioInicial = {
  nombre: '',
  apellido: '',
  correo: '',
  contrasena: '',
  rol: 'paciente'
}

export function useAdministracionUsuarios() {
  const { token, usuario: usuarioActual } = useAutenticacion()

  const [usuarios, setUsuarios] = useState([])
  const [formulario, setFormulario] = useState(formularioInicial)
  const [idEditando, setIdEditando] = useState(null)
  const [detalle, setDetalle] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const cargarUsuarios = useCallback(async () => {
    if (!token) return

    setCargando(true)

    try {
      const respuesta = await listarUsuarios(token)

      const lista = Array.isArray(respuesta)
        ? respuesta
        : respuesta?.usuarios

      if (!Array.isArray(lista)) {
        throw new Error(
          'El servidor no devolvió una lista de usuarios.'
        )
      }

      setUsuarios(lista)

    } catch (errorSolicitud) {
      setError(errorSolicitud.message)

    } finally {
      setCargando(false)
    }
  }, [token])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario(anterior => ({
      ...anterior,
      [name]: value
    }))

    setError('')
    setMensaje('')
  }

  function seleccionarEditar(usuario) {
    setIdEditando(usuario.id)

    setFormulario({
      nombre: usuario.nombre ?? '',
      apellido: usuario.apellido ?? '',
      correo: usuario.correo ?? '',
      contrasena: '',
      rol: usuario.rol ?? 'paciente'
    })

    setDetalle(null)
    setError('')
    setMensaje('')
  }

  function cancelar() {
    setFormulario({ ...formularioInicial })
    setIdEditando(null)
    setError('')
    setMensaje('')
  }

  async function guardarUsuario(evento) {
    evento.preventDefault()

    if (procesando) return

    setError('')
    setMensaje('')

    const datos = {
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      correo: formulario.correo.trim().toLowerCase(),
      rol: formulario.rol
    }

    if (!datos.nombre || !datos.apellido || !datos.correo) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    if (
      !['paciente', 'administrador'].includes(datos.rol)
    ) {
      setError('Selecciona un rol válido.')
      return
    }

    if (idEditando === null) {
      if (
        formulario.contrasena.length < 15 ||
        formulario.contrasena.length > 128
      ) {
        setError(
          'La contraseña debe tener entre 15 y 128 caracteres.'
        )
        return
      }

      datos.contrasena = formulario.contrasena
    }

    setProcesando(true)

    try {
      if (idEditando !== null) {
        await actualizarUsuario(
          idEditando,
          datos,
          token
        )

        setMensaje('Usuario actualizado correctamente.')

      } else {
        await crearUsuario(datos, token)

        setMensaje('Usuario creado correctamente.')
      }

      setFormulario({ ...formularioInicial })
      setIdEditando(null)
      setDetalle(null)

      await cargarUsuarios()

    } catch (errorSolicitud) {
      setError(errorSolicitud.message)

    } finally {
      setProcesando(false)
    }
  }

  async function consultar(id) {
    setError('')
    setDetalle(null)

    try {
      const respuesta = await consultarUsuario(id, token)

      setDetalle(respuesta?.usuario ?? respuesta)

    } catch (errorSolicitud) {
      setError(errorSolicitud.message)
    }
  }

  async function desactivar(id) {
    if (String(usuarioActual?.id) === String(id)) {
      setError('No puedes desactivar tu propia cuenta.')
      return
    }

    const confirmado = window.confirm(
      '¿Seguro que deseas desactivar este usuario?'
    )

    if (!confirmado) return

    setProcesando(true)
    setError('')
    setMensaje('')

    try {
      await desactivarUsuario(id, token)

      setDetalle(null)
      setMensaje('Usuario desactivado correctamente.')

      await cargarUsuarios()

    } catch (errorSolicitud) {
      setError(errorSolicitud.message)

    } finally {
      setProcesando(false)
    }
  }

  return {
    usuarios,
    formulario,
    idEditando,
    detalle,
    cargando,
    procesando,
    error,
    mensaje,
    cargarUsuarios,
    cambiarCampo,
    seleccionarEditar,
    cancelar,
    guardarUsuario,
    consultar,
    desactivar
  }
}
