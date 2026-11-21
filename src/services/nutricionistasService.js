import { solicitarApi } from './api'

// Obtener los nutricionistas activos desde el backend
export function listarNutricionistas(senal) {
  return solicitarApi('/nutricionistas', { senal })
}
