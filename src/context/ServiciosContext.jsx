
import { createContext, useState } from 'react'

import {
  listarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../services/serviciosService'

export const ServiciosContext = createContext(null)

export function ServiciosProvider({ children }) {
  const [servicios, setServicios] = useState(() => listarServicios())

  function actualizarLista() {
    setServicios(listarServicios())
  }

  function agregarServicio(nuevoServicio) {
    crearServicio(nuevoServicio)
    actualizarLista()
  }

  function editarServicio(codigo, datos) {
    actualizarServicio(codigo, datos)
    actualizarLista()
  }

  function borrarServicio(codigo) {
    eliminarServicio(codigo)
    actualizarLista()
  }

  const valor = {
    servicios,
    agregarServicio,
    editarServicio,
    borrarServicio
  }

  return (
    <ServiciosContext.Provider value={valor}>
      {children}
    </ServiciosContext.Provider>
  )
}
