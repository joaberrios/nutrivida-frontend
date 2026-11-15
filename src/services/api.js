
const DIRECCION_API = import.meta.env.VITE_API_URL

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

  const encabezados = {
    Accept: 'application/json'
  }

  if (datos !== undefined) {
    encabezados['Content-Type'] = 'application/json'
  }

  if (token) {
    encabezados.Authorization = `Bearer ${token}`
  }

  let respuesta

  try {
    respuesta = await fetch(
      `${DIRECCION_API}${ruta}`,
      {
        method: metodo,
        headers: encabezados,
        body: datos !== undefined
          ? JSON.stringify(datos)
          : undefined,
        signal: senal
      }
    )
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error(
      'No se pudo conectar con el servidor.'
    )
  }

  if (respuesta.status === 204) {
    return null
  }

  const resultado = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const error = new Error(
      resultado?.mensaje || 'Ocurrio un error en la solicitud.'
    )

    error.estado = respuesta.status

    throw error
  }

  if (resultado === null) {
    throw new Error('El servidor devolvio una respuesta no valida.')
  }

  return resultado
}
