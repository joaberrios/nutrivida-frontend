import { createContext, useState } from 'react'
import {
  listarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../services/serviciosService'

export const ServiciosContext = createContext()

export function ServiciosProvider({ children }) {
  const [servicios, setServicios] = useState(listarServicios())

  function agregarServicio(nuevoServicio) {
    crearServicio(nuevoServicio)
    setServicios(listarServicios())
  }

  function editarServicio(codigo, datos) {
    actualizarServicio(codigo, datos)
    setServicios(listarServicios())
  }

  function borrarServicio(codigo) {
    eliminarServicio(codigo)
    setServicios(listarServicios())
  }

  return (
    <ServiciosContext.Provider
      value={{
        servicios,
        agregarServicio,
        editarServicio,
        borrarServicio
      }}
    >
      {children}
    </ServiciosContext.Provider>
  )
}