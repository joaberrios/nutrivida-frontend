const servicios = [
  {
    codigo: 'CN001',
    tipo: 'Consulta',
    nombre: 'Primera consulta nutricional',
    duracion: '50 min',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 35000,
    descripcion: 'Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio.'
  },
  {
    codigo: 'CN002',
    tipo: 'Consulta',
    nombre: 'Control nutricional (seguimiento)',
    duracion: '30 min',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 25000,
    descripcion: 'Seguimiento mensual: medición de indicadores y ajuste del plan vigente.'
  },
  {
    codigo: 'CN003',
    tipo: 'Consulta',
    nombre: 'Control nutricional quincenal',
    duracion: '30 min',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 22000,
    descripcion: 'Seguimiento intensivo cada 15 días. Recomendado en los primeros 2 meses.'
  },
  {
    codigo: 'CN004',
    tipo: 'Consulta',
    nombre: 'Teleconsulta nutricional',
    duracion: '30 min',
    modalidad: 'Online (video)',
    profesional: 'Nutricionista',
    precio: 20000,
    descripcion: 'Consulta de seguimiento vía videollamada. Requiere contar con consulta presencial previa.'
  },
  {
    codigo: 'CN005',
    tipo: 'Consulta',
    nombre: 'Consulta de urgencia / reagendada',
    duracion: '30 min',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 28000,
    descripcion: 'Para pacientes que requieren atención fuera de su control habitual.'
  },
  {
    codigo: 'PL001',
    tipo: 'Plan especializado',
    nombre: 'Plan pérdida de peso (1 mes)',
    duracion: '—',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 65000,
    descripcion: 'Incluye primera consulta + 1 control quincenal + plan alimenticio personalizado + seguimiento por WhatsApp.'
  },
  {
    codigo: 'PL002',
    tipo: 'Plan especializado',
    nombre: 'Plan pérdida de peso (3 meses)',
    duracion: '—',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 170000,
    descripcion: 'Incluye primera consulta + 5 controles + 3 planes mensuales + seguimiento continuo.'
  },
  {
    codigo: 'PL003',
    tipo: 'Plan especializado',
    nombre: 'Plan nutrición deportiva (1 mes)',
    duracion: '—',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 70000,
    descripcion: 'Para deportistas y personas con actividad física frecuente. Cálculo de requerimientos energéticos y proteicos.'
  },
  {
    codigo: 'PL004',
    tipo: 'Plan especializado',
    nombre: 'Plan control diabetes / hipertensión',
    duracion: '—',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 75000,
    descripcion: 'Plan adaptado para patologías metabólicas. Coordinación con médico tratante si aplica.'
  },
  {
    codigo: 'PL005',
    tipo: 'Plan especializado',
    nombre: 'Plan alimentación vegetariana/vegana',
    duracion: '—',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 68000,
    descripcion: 'Diseñado para garantizar aporte adecuado de proteínas, hierro, vitamina B12 y calcio sin productos animales.'
  }
]

export default servicios