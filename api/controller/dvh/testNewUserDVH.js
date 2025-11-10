/**
 * Script para probar la creación de un nuevo usuario con DVH automático
 */

const { User, DigitoVerificador } = require('../../models');
const { Op } = require('sequelize');

async function probarNuevoUsuarioDVH() {
  console.log('🧪 Probando creación de nuevo usuario con DVH automático...');
  console.log('='.repeat(60));

  try {
    // 1. Crear un nuevo usuario
    console.log('\n👤 Creando nuevo usuario de prueba...');
    const timestamp = Date.now();
    const nuevoUsuario = await User.create({
      username: `test_dvh_${timestamp}`,
      email: `test_dvh_${timestamp}@example.com`,
      password: 'test123456',
      estado: 'activo',
      isAdmin: false
    });

    console.log(`✅ Usuario creado: ${nuevoUsuario.username} (ID: ${nuevoUsuario.id})`);
    console.log(`🔢 DVH en usuario: ${nuevoUsuario.dvh}`);

    // 2. Verificar que se guardó en digitos_verificadores
    console.log('\n📋 Verificando registro en digitos_verificadores...');
    const dvvEncontrado = await DigitoVerificador.findOne({
      where: {
        [Op.or]: [
          { nombre_tabla: 'Usuarios' },
          { nombre_tabla: 'Usuario' }
        ],
        id_registro: nuevoUsuario.id,
        estado: 'activo'
      }
    });

    if (dvvEncontrado) {
      console.log(`✅ DVH encontrado en digitos_verificadores:`);
      console.log(`   📋 Tabla: ${dvvEncontrado.nombre_tabla}`);
      console.log(`   🔢 ID Registro: ${dvvEncontrado.id_registro}`);
      console.log(`   🔢 DV: ${dvvEncontrado.dv}`);
      console.log(`   📅 Fecha: ${dvvEncontrado.fecha_calculo}`);
      console.log(`   🏷️  Estado: ${dvvEncontrado.estado}`);

      // 3. Verificar que los DVH coincidan
      if (dvvEncontrado.dv === nuevoUsuario.dvh) {
        console.log('\n✅ ¡Perfecto! Los DVH coinciden en ambas tablas');
      } else {
        console.log('\n❌ Error: Los DVH no coinciden');
        console.log(`   DVH en usuario: ${nuevoUsuario.dvh}`);
        console.log(`   DVH en digitos_verificadores: ${dvvEncontrado.dv}`);
      }
    } else {
      console.log('❌ No se encontró el DVH en la tabla digitos_verificadores');
    }

    // 4. Mostrar estado actual de la tabla digitos_verificadores
    console.log('\n📊 Estado actual de digitos_verificadores:');
    const todosDVH = await DigitoVerificador.findAll({
      order: [['nombre_tabla', 'ASC'], ['id_registro', 'ASC']]
    });

    console.log(`📈 Total de registros: ${todosDVH.length}`);
    todosDVH.forEach(dvv => {
      console.log(`   🔢 ${dvv.nombre_tabla}:${dvv.id_registro} = ${dvv.dv}`);
    });

    console.log('\n✨ Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error(error.stack);
  }
}

// Ejecutar si se corre este script directamente
if (require.main === module) {
  probarNuevoUsuarioDVH().then(() => {
    console.log('🚀 Prueba finalizada');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Falló la prueba:', error);
    process.exit(1);
  });
}

module.exports = { probarNuevoUsuarioDVH };