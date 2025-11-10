const { calcularDVH } = require('../controller/dvh/dvh');

/**
 * Guarda el DVH en la tabla digitos_verificadores
 * @param {Object} instance - Instancia del modelo
 * @param {string} dvhCalculado - DVH calculado
 */
async function guardarDVHEnTabla(instance, dvhCalculado) {
  try {
    // Importar dinámicamente para evitar dependencia circular
    const { DigitoVerificador } = require('../models');

    // Mapeo explícito de modelos a nombres de tablas en la base de datos
    const mapeoTablas = {
      'User': 'Usuarios',
      'Post': 'Posts',
      'Comment': 'Comments',
      'Friendship': 'Friendships',
      'Calification': 'Califications',
      'Bitacora': 'Bitacoras'
    };

    const nombreTabla = mapeoTablas[instance.constructor.name] ||
                       instance.constructor.options.tableName ||
                       instance.constructor.name;

    // Verificar si ya existe un registro para este DVH
    const existente = await DigitoVerificador.findOne({
      where: {
        nombre_tabla: nombreTabla,
        id_registro: instance.id,
        estado: 'activo'
      }
    });

    if (existente) {
      // Actualizar el DVH existente
      await existente.update({
        dv: dvhCalculado,
        fecha_calculo: new Date()
      });
      console.log(`📝 DVH actualizado en tabla digitos_verificadores para ${nombreTabla}:${instance.id}`);
    } else {
      // Crear nuevo registro de DVH
      await DigitoVerificador.create({
        nombre_tabla: nombreTabla,
        id_registro: instance.id,
        dv: dvhCalculado,
        fecha_calculo: new Date(),
        estado: 'activo'
      });
      console.log(`📝 DVH guardado en tabla digitos_verificadores para ${nombreTabla}:${instance.id}`);
    }
  } catch (error) {
    console.error('❌ Error al guardar DVH en tabla digitos_verificadores:', error);
    // No lanzamos el error para no interrumpir el flujo principal
  }
}

/**
 * Middleware para añadir automáticamente el DVH a los registros antes de guardarlos
 * Se usa en los hooks de Sequelize (beforeCreate, beforeUpdate)
 */
const addDVHToRecord = async (instance) => {
  try {
    // Obtener los datos del registro como objeto plano
    const datos = instance.get({ plain: true });

    // Calcular y asignar el DVH
    const dvhCalculado = calcularDVH(datos);
    instance.dvh = dvhCalculado;

    console.log(`🔢 DVH calculado para ${instance.constructor.name}: ${dvhCalculado}`);

    // Si el registro ya tiene ID, guardar también en la tabla digitos_verificadores
    if (instance.id) {
      await guardarDVHEnTabla(instance, dvhCalculado);
    }
  } catch (error) {
    console.error('Error en middleware DVH:', error);
    // Asignar valor por defecto en caso de error
    instance.dvh = '00000000';
  }
};

/**
 * Hook para Sequelize - se ejecuta antes de crear un registro
 */
const beforeCreateDVH = (instance) => {
  addDVHToRecord(instance);
};

/**
 * Hook para Sequelize - se ejecuta después de crear un registro
 * Aquí guardamos en la tabla digitos_verificadores porque ya tenemos el ID
 */
const afterCreateDVH = async (instance) => {
  if (instance.id && instance.dvh) {
    await guardarDVHEnTabla(instance, instance.dvh);
  }
};

/**
 * Hook para Sequelize - se ejecuta antes de actualizar un registro
 */
const beforeUpdateDVH = (instance) => {
  addDVHToRecord(instance);
};

/**
 * Hook para Sequelize - se ejecuta después de actualizar un registro
 */
const afterUpdateDVH = async (instance) => {
  if (instance.id && instance.dvh) {
    await guardarDVHEnTabla(instance, instance.dvh);
  }
};

/**
 * Middleware Express para verificar DVH en operaciones sensibles
 */
const verifyDVHMiddleware = (req, res, next) => {
  // Este middleware se puede usar en rutas que necesiten verificar integridad
  req.verificarIntegridad = true;
  next();
};

module.exports = {
  beforeCreateDVH,
  afterCreateDVH,
  beforeUpdateDVH,
  afterUpdateDVH,
  verifyDVHMiddleware,
  addDVHToRecord,
  guardarDVHEnTabla
};