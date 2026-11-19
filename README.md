# NutriVida - Frontend

## 1. Identificacion del proyecto

- Asignatura: Desarrollo Fullstack II - DSY1104.
- Proyecto: NutriVida.
- Entrega: Guia 19.
- Seccion: pendiente de completar.
- Integrantes: pendiente de completar.

NutriVida es una aplicacion web que permite consultar
servicios nutricionales, registrar usuarios, iniciar
sesion y reservar horas de atencion.

Tambien permite consultar las reservas realizadas y
administrar los servicios nutricionales.

## 2. Repositorios

Frontend:
https://github.com/joaberrios/nutrivida-frontend

Backend:
https://github.com/dasrojas-cpu/nutrivida-backend

Ambos proyectos se encuentran separados y se comunican
mediante una API REST.

## 3. Tecnologias utilizadas

| Tecnologia | Version utilizada o declarada |
|---|---|
| Node.js | 24.21.0 |
| npm | 11.19.0 |
| React | 19.2.8 |
| React Bootstrap | 2.10.10 |
| Bootstrap | 5.3.8 |
| React Router | 7.18.4 |
| Vite | 8.3.5 |
| Vitest | 5.0.3 |
| Oxlint | 1.81.0 |

React permite construir interfaces mediante componentes
reutilizables.

React Bootstrap facilita el diseño adaptable a diferentes
tamaños de pantalla.

Vite permite ejecutar y compilar el proyecto.

Vitest y Testing Library permiten comprobar el
comportamiento de los componentes y sus funcionalidades.

## 4. Arquitectura del frontend

El proyecto utiliza Atomic Design y separacion
de responsabilidades.

| Carpeta | Responsabilidad |
|---|---|
| components/atoms | Componentes pequeños reutilizables |
| components/molecules | Combinacion de componentes |
| components/organisms | Formularios y secciones completas |
| components/templates | Estructura y proteccion de pantallas |
| pages | Pantallas de la aplicacion |
| context | Contextos y proveedores de estado |
| hooks | Logica reutilizable |
| services | Comunicacion con la API REST |
| utils | Funciones auxiliares |
| data | Datos auxiliares |
| assets | Imagenes y recursos visuales |

La logica de administracion de servicios se encuentra
separada de su formulario y tabla.

Los contextos y proveedores se mantienen en archivos
independientes.

Los hooks personalizados utilizan el prefijo use,
respetando las reglas de React y manteniendo sus
nombres descriptivos en español.

El catalogo ya no utiliza localStorage como fuente
de persistencia.

Los datos de servicios y reservas se obtienen desde
el backend conectado a PostgreSQL.

## 5. Funcionalidades implementadas

- Registro de pacientes.
- Inicio y cierre de sesion.
- Catalogo de servicios.
- Detalle de servicios nutricionales.
- Seleccion de nutricionista.
- Agendamiento de citas.
- Confirmacion de reservas.
- Historial de reservas propias.
- Administracion de servicios.
- Rutas protegidas por autenticacion y rol.
- Manejo de errores de conexion.
- Manejo de sesiones vencidas.
- Estados de carga y resultados vacios.

## 6. Integracion con la API REST

El archivo src/services/api.js centraliza las
solicitudes HTTP.

| Funcionalidad | Metodo | Endpoint |
|---|---|---|
| Registro | POST | /api/auth/register |
| Login | POST | /api/auth/login |
| Catalogo y detalle | GET | /api/servicios |
| Nutricionistas | GET | /api/nutricionistas |
| Confirmar cita | POST | /api/reservas |
| Historial | GET | /api/reservas |
| Crear servicio | POST | /api/servicios |
| Editar servicio | PUT | /api/servicios/{codigo} |
| Eliminar servicio | DELETE | /api/servicios/{codigo} |

El backend tambien implementa GET /api/auth/me
y GET /api/servicios/{codigo}.

La sesion inicial se obtiene desde la respuesta
del login. El detalle de servicios utiliza los
datos obtenidos desde el contexto del catalogo.

### Flujo de una reserva

1. El paciente inicia sesion.
2. React recibe el JWT y los datos del usuario.
3. El paciente selecciona un servicio.
4. Selecciona fecha, hora y nutricionista.
5. React envia los datos y el JWT al backend.
6. El backend verifica la identidad y disponibilidad.
7. PostgreSQL almacena la reserva.
8. React muestra el resultado de la operacion.

El precio y la identidad del paciente son determinados
por el servidor y no por el navegador.

## 7. Seguridad

El JWT se mantiene en memoria mediante el contexto
de autenticacion.

No se almacena el token en localStorage.

La sesion tiene una vigencia de 30 minutos.

El token se envia mediante Authorization Bearer
en las solicitudes protegidas.

Las rutas de paciente y administrador se mantienen
separadas.

El backend realiza las comprobaciones definitivas
de autenticacion y permisos.

Cerrar sesion elimina el token de React, pero no
revoca una copia previa del token en el servidor.

El despliegue utiliza un tunel SSH para las pruebas
del laboratorio. La configuracion HTTPS definitiva
queda pendiente para produccion.

## 8. Instalacion y ejecucion

Requisitos:

- Node.js y npm.
- Backend disponible.
- Conexion autorizada a la API.

Instalar dependencias:

    npm ci

En una instalacion nueva, copiar el archivo
.env.example a .env.local.

Configurar la variable:

    VITE_API_URL=http://127.0.0.1:3001/api

La direccion anterior corresponde al tunel SSH
utilizado para conectar con AWS EC2.

El puerto local 3001 se redirige al puerto 3000
del backend.

Ejecutar el frontend:

    npm run dev -- --port 5173 --strictPort

Abrir en el navegador:

    http://localhost:5173

La direccion del backend y su configuracion se
encuentran documentadas en el repositorio backend.

## 9. Pruebas automatizadas

Ejecutar las pruebas:

    npm test

Ejecutar las pruebas con cobertura:

    npm run test:coverage

Resultados del 19 de noviembre de 2026:

| Indicador | Resultado |
|---|---|
| Archivos de pruebas | 18 de 18 |
| Casos aprobados | 97 de 97 |
| Casos fallidos | 0 |
| Cobertura de lineas | 75.38% |
| Cobertura de sentencias | 74.81% |
| Cobertura de funciones | 68.84% |
| Cobertura de ramificaciones | 67.72% |

Se realizaron pruebas de registro, login, rutas
protegidas, vencimiento de sesion, agendamiento,
confirmacion, historial, administracion, catalogo
y cliente HTTP.

Las pruebas del frontend utilizan respuestas simuladas
para comprobar el comportamiento de la interfaz.

Las pruebas de integracion con PostgreSQL se ejecutan
desde el repositorio backend.

## 10. Calidad y compilacion

Revisar el codigo:

    npm run lint

Resultados de Oxlint:

- Errores: 0.
- Advertencias: 0.

Generar la version de produccion:

    npm run build

Resultado: compilacion aprobada.

Auditar dependencias de produccion:

    npm audit --omit=dev

Resultado de la ultima auditoria:
0 vulnerabilidades detectadas.

Este resultado no garantiza la ausencia de todos
los riesgos de seguridad.

## 11. Estado del proyecto

La integracion principal con el backend se encuentra
implementada.

El frontend cuenta con 97 casos de pruebas aprobados.
El backend cuenta con 71 casos aprobados y 11
endpoints documentados mediante OpenAPI.

Pendientes de entrega:

- Incorporar integrantes y seccion.
- Completar responsabilidades individuales.
- Incorporar diagramas y enlaces de Google Drive.
- Completar evidencias manuales pendientes.
- Revisar y sincronizar ambos repositorios.

Las mejoras de infraestructura, HTTPS y disponibilidad
se encuentran detalladas en la planificacion del backend.

## 12. Documentacion

- Diagrama entidad-relacion: pendiente de enlace.
- Diagrama de arquitectura: pendiente de enlace.
- Diagrama de secuencia JWT: pendiente de enlace.

Swagger mediante el tunel SSH:

http://127.0.0.1:3001/documentacion/

La documentacion tecnica de seguridad, base de datos
y API REST se encuentra en el README del backend.
