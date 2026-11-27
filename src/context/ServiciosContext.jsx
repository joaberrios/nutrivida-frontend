import { createContext, useEffect, useState } from 'react'

import {
  listarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../services/serviciosService'

export const ServiciosContext = createContext(null)

export function ServiciosProvider({ children }) {
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorServicios, setErrorServicios] = useState('')

  // Cargar servicios desde PostgreSQL al iniciar
  useEffect(() => {
    let componenteActivo = true

    async function cargarServicios() {
      try {
        const resultado = await listarServicios()

        if (componenteActivo) {
          setServicios(
            Array.isArray(resultado) ? resultado : []
          )
          setErrorServicios('')
        }

      } catch (error) {
        if (componenteActivo) {
          setErrorServicios(
            error.response?.data?.mensaje ||
            'No se pudieron cargar los servicios'
          )
        }

      } finally {
        if (componenteActivo) {
          setCargando(false)
        }
      }
    }

    cargarServicios()

    return () => {
      componenteActivo = false
    }
  }, [])

  // Crear un servicio en el backend
  async function agregarServicio(nuevoServicio) {
    setErrorServicios('')

    try {
      const resultado = await crearServicio(nuevoServicio)

      setServicios((actuales) => [
        ...actuales,
        resultado
      ])

      return resultado

    } catch (error) {
      setErrorServicios(
        error.response?.data?.mensaje ||
        'No se pudo crear el servicio'
      )

      throw error
    }
  }

  // Actualizar un servicio en el backend
  async function editarServicio(codigo, datos) {
    setErrorServicios('')

    try {
      const resultado = await actualizarServicio(
        codigo,
        datos
      )

      setServicios((actuales) =>
        actuales.map((servicio) =>
          servicio.codigo === codigo
            ? resultado
            : servicio
        )
      )

      return resultado

    } catch (error) {
      setErrorServicios(
        error.response?.data?.mensaje ||
        'No se pudo actualizar el servicio'
      )

      throw error
    }
  }

  // Desactivar un servicio en el backend
  async function borrarServicio(codigo) {
    setErrorServicios('')

    try {
      await eliminarServicio(codigo)

      setServicios((actuales) =>
        actuales.filter(
          (servicio) => servicio.codigo !== codigo
        )
      )

    } catch (error) {
      setErrorServicios(
        error.response?.data?.mensaje ||
        'No se pudo desactivar el servicio'
      )

      throw error
    }
  }

  return (
    <ServiciosContext.Provider
      value={{
        servicios,
        cargando,
        errorServicios,
        agregarServicio,
        editarServicio,
        borrarServicio
      }}
    >
      {children}
    </ServiciosContext.Provider>
  )
}
