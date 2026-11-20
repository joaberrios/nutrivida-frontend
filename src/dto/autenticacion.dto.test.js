import { describe, expect, it } from 'vitest'

import {
  crearRegistroDTO,
  crearInicioSesionDTO
} from './autenticacion.dto'

describe('DTO de autenticacion', () => {

  it('transforma los datos del registro', () => {
    const resultado = crearRegistroDTO({
      nombre: ' Juan ',
      apellido: ' Perez ',
      correo: ' JUAN@GMAIL.COM ',
      contrasena: 'ClaveSegura12345',
      confirmarContrasena: 'ClaveSegura12345'
    })

    expect(resultado).toEqual({
      nombre: 'Juan',
      apellido: 'Perez',
      correo: 'juan@gmail.com',
      contrasena: 'ClaveSegura12345'
    })
  })

  it('no envia la confirmacion ni datos adicionales', () => {
    const resultado = crearRegistroDTO({
      nombre: 'Juan',
      apellido: 'Perez',
      correo: 'juan@gmail.com',
      contrasena: 'ClaveSegura12345',
      confirmarContrasena: 'ClaveSegura12345',
      rol: 'administrador',
      activo: true
    })

    expect(resultado).not.toHaveProperty('confirmarContrasena')
    expect(resultado).not.toHaveProperty('rol')
    expect(resultado).not.toHaveProperty('activo')
    expect(Object.keys(resultado)).toHaveLength(4)
  })

  it('transforma los datos del inicio de sesion', () => {
    const resultado = crearInicioSesionDTO({
      correo: ' JUAN@GMAIL.COM ',
      contrasena: 'ClaveSegura12345'
    })

    expect(resultado).toEqual({
      correo: 'juan@gmail.com',
      contrasena: 'ClaveSegura12345'
    })
  })

  it('no envia datos adicionales durante el login', () => {
    const resultado = crearInicioSesionDTO({
      correo: 'juan@gmail.com',
      contrasena: 'ClaveSegura12345',
      rol: 'administrador',
      usuario_id: 10
    })

    expect(resultado).not.toHaveProperty('rol')
    expect(resultado).not.toHaveProperty('usuario_id')
    expect(Object.keys(resultado)).toHaveLength(2)
  })
})
