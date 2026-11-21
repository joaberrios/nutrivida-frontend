import { useContext, useState } from 'react'
import { CatalogoContext } from '../context/CatalogoContext'
import { useAutenticacion } from '../hooks/useAutenticacion'

import {
  crearServicioApi,
  actualizarServicioApi,
  eliminarServicioApi
} from '../services/serviciosService'

const formularioInicial = {
  codigo: '',
  tipo: '',
  nombre: '',
  duracion: '',
  modalidad: 'Presencial',
  profesional: '',
  precio: '',
  descripcion: ''
}

export function useAdministracionServicios() {
  const {
    servicios,
    cargando,
    error: errorCatalogo,
    recargarCatalogo
  } = useContext(CatalogoContext)

  const { token, cerrarSesion } = useAutenticacion()

  const [formulario, setFormulario] = useState(formularioInicial)
  const [codigoEditando, setCodigoEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario(anterior => ({
      ...anterior,
      [name]: value
    }))

    setError('')
    setMensaje('')
  }

  function manejarError(error) {
    if (error.estado === 401) {
      cerrarSesion()
    } else if (error.estado === 403) {
      setError('No tienes permisos de administrador.')
    } else {
      setError(
        error.message || 'No se pudo realizar la operación.'
      )
    }
  }

  async function guardarServicio(evento) {
    evento.preventDefault()

    if (procesando) return

    setError('')
    setMensaje('')

    if (
      Object.values(formulario).some(
        valor => String(valor).trim() === ''
      )
    ) {
      setError('Debes completar todos los campos.')
      return
    }

    const precio = Number(formulario.precio)

    if (!Number.isInteger(precio) || precio <= 0) {
      setError(
        'El precio debe ser un número entero mayor que cero.'
      )
      return
    }

    const datos = {
      codigo: formulario.codigo.trim().toUpperCase(),
      tipo: formulario.tipo.trim(),
      nombre: formulario.nombre.trim(),
      duracion: formulario.duracion.trim(),
      modalidad: formulario.modalidad.trim(),
      profesional: formulario.profesional.trim(),
      precio,
      descripcion: formulario.descripcion.trim()
    }

    if (!/^[A-Z0-9]+$/.test(datos.codigo)) {
      setError(
        'El código solo puede contener letras y números.'
      )
      return
    }

    setProcesando(true)

    try {
      if (codigoEditando) {
        await actualizarServicioApi(
          codigoEditando,
          datos,
          token
        )

        setMensaje('Servicio actualizado correctamente.')
      } else {
        await crearServicioApi(datos, token)

        setMensaje('Servicio agregado correctamente.')
      }

      setFormulario(formularioInicial)
      setCodigoEditando(null)
      recargarCatalogo()

    } catch (error) {
      manejarError(error)
    } finally {
      setProcesando(false)
    }
  }

  function seleccionarEditar(servicio) {
    setFormulario({
      codigo: servicio.codigo,
      tipo: servicio.tipo,
      nombre: servicio.nombre,
      duracion: servicio.duracion,
      modalidad: servicio.modalidad,
      profesional: servicio.profesional,
      precio: servicio.precio,
      descripcion: servicio.descripcion
    })

    setCodigoEditando(servicio.codigo)
    setMensaje('')
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  async function eliminar(codigo) {
    if (procesando) return

    if (
      !window.confirm(
        '¿Seguro que deseas eliminar este servicio?'
      )
    ) return

    setProcesando(true)
    setError('')
    setMensaje('')

    try {
      await eliminarServicioApi(codigo, token)

      if (codigoEditando === codigo) {
        setFormulario(formularioInicial)
        setCodigoEditando(null)
      }

      setMensaje('Servicio eliminado correctamente.')
      recargarCatalogo()

    } catch (error) {
      manejarError(error)
    } finally {
      setProcesando(false)
    }
  }

  function cancelar() {
    setFormulario(formularioInicial)
    setCodigoEditando(null)
    setError('')
    setMensaje('')
  }

  return {
    servicios,
    cargando,
    errorCatalogo,
    recargarCatalogo,
    formulario,
    codigoEditando,
    mensaje,
    error,
    procesando,
    cambiarCampo,
    guardarServicio,
    seleccionarEditar,
    eliminar,
    cancelar
  }
}


