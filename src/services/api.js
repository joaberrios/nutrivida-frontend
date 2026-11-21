import axios from 'axios'

const DIRECCION_API = import.meta.env.VITE_API_URL

// Crear una instancia centralizada para comunicarse con el backend.
const clienteApi = axios.create({
  baseURL: DIRECCION_API,
  headers: {
    Accept: 'application/json'
  }
})

// Realizar solicitudes HTTP utilizando Axios.
export async function solicitarApi(
  ruta,
  {
    metodo = 'GET',
    datos,
    token,
    senal
  } = {}
) {
  if (!DIRECCION_API) {
    throw new Error('La direccion de la API no esta configurada.')
  }

  const encabezados = {}

  if (datos !== undefined) {
    encabezados['Content-Type'] = 'application/json'
  }

  if (token) {
    encabezados.Authorization = `Bearer ${token}`
  }

  try {
    const respuesta = await clienteApi.request({
      url: ruta,
      method: metodo,
      data: datos,
      headers: encabezados,
      signal: senal
    })

    if (respuesta.status === 204) {
      return null
    }

    if (
      respuesta.data === null ||
      respuesta.data === undefined ||
      respuesta.data === ''
    ) {
      throw new Error(
        'El servidor devolvio una respuesta no valida.'
      )
    }

    return respuesta.data

  } catch (error) {
    // Mantener el comportamiento de las solicitudes canceladas.
    if (
      axios.isCancel(error) ||
      error?.code === 'ERR_CANCELED' ||
      error?.name === 'AbortError'
    ) {
      throw error
    }

    // Gestionar los errores HTTP recibidos desde el backend.
    if (error?.response) {
      const resultado = error.response.data

      const errorApi = new Error(
        resultado?.mensaje ||
        'Ocurrio un error en la solicitud.'
      )

      errorApi.estado = error.response.status

      throw errorApi
    }

    // Gestionar problemas de conexion.
    if (error?.request) {
      throw new Error(
        'No se pudo conectar con el servidor.'
      )
    }

    throw error
  }
}
