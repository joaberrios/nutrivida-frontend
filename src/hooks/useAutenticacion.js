import { useContext } from 'react'
import { AutenticacionContext } from '../context/AutenticacionContext'

export function useAutenticacion() {
  const contexto = useContext(AutenticacionContext)

  if (!contexto) {
    throw new Error(
      'El contexto de autenticación no está disponible.'
    )
  }

  return contexto
}


