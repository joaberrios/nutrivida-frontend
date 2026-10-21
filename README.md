# NutriVida

NutriVida es una aplicación web desarrollada con React para la gestión de servicios nutricionales y el agendamiento de citas.

El proyecto permite consultar servicios, revisar categorías, registrar usuarios, iniciar sesión, agendar citas y administrar los servicios disponibles.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- Bootstrap
- React Bootstrap
- React Router DOM
- Context API
- Vitest
- React Testing Library
- Git y GitHub

## Funcionalidades principales

### Inicio de sesión y registro

El sistema permite iniciar sesión con cuentas existentes y registrar nuevos usuarios.

Los formularios incluyen validaciones para comprobar los datos ingresados y mostrar mensajes cuando existe algún error.

### Catálogo de servicios

Los usuarios pueden consultar los servicios nutricionales disponibles, buscar servicios, revisar categorías y acceder al detalle de cada servicio.

### Agendamiento de citas

El sistema permite seleccionar un servicio, nutricionista, fecha y horario.

Antes de confirmar la reserva, se muestra un resumen con los datos seleccionados.

El sistema también contempla una página de confirmación exitosa y otra para informar errores durante el agendamiento.

### Administración de servicios

El módulo de administración permite:

- Agregar nuevos servicios.
- Consultar los servicios registrados.
- Editar servicios existentes.
- Eliminar servicios.
- Validar campos obligatorios, precios y códigos duplicados.

### Almacenamiento de datos

El proyecto utiliza `localStorage` para guardar información de usuarios registrados, servicios y citas en el navegador.

Este almacenamiento corresponde a una implementación académica y no reemplaza una base de datos ni un sistema de autenticación seguro para producción.

## Arquitectura del proyecto

El proyecto utiliza una organización basada en Atomic Design:

- **Atoms:** componentes básicos reutilizables.
- **Molecules:** combinaciones de componentes pequeños.
- **Organisms:** componentes de mayor complejidad.
- **Templates:** estructuras reutilizables de páginas.
- **Pages:** páginas principales de la aplicación.

Además, incluye carpetas para servicios, contexto y datos.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/joaberrios/nutrivida-frontend.git
```

Ingresar a la carpeta:

```bash
cd nutrivida-frontend
```

Instalar las dependencias:

```bash
npm install
```

## Ejecutar el proyecto

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir en el navegador la dirección indicada por Vite, normalmente:

http://localhost:5173/

En Windows PowerShell, si existe una restricción para ejecutar scripts, se pueden utilizar los comandos `npm.cmd` y `npx.cmd`.

## Pruebas automáticas

El proyecto utiliza Vitest y React Testing Library para comprobar el funcionamiento de sus componentes y funcionalidades.

Ejecutar todas las pruebas:

```bash
npx vitest run
```

Resultado de la última ejecución verificada:

- **57 pruebas aprobadas.**
- **14 archivos de pruebas aprobados.**
- **0 pruebas fallidas.**

Entre las funcionalidades probadas se encuentran el inicio de sesión, registro, agendamiento de citas, confirmación de reservas, administración de servicios, contexto y almacenamiento de datos.

## Cobertura de pruebas

Para generar el informe de cobertura:

```bash
npx vitest run --coverage
```

Resultados de la última ejecución verificada:

| Indicador | Cobertura |
|---|---:|
| Sentencias | 82,22 % |
| Ramas | 87,58 % |
| Funciones | 73,33 % |
| Líneas | 82,09 % |

El informe HTML de cobertura se genera en la carpeta `coverage`.

## Control de versiones

El proyecto utiliza Git y GitHub para el control de versiones y el trabajo colaborativo.

Repositorio:

https://github.com/joaberrios/nutrivida-frontend

## Integrantes

- Joaquín
- Dastin

## Contexto académico

Proyecto desarrollado como parte de una evaluación académica de desarrollo web con React.