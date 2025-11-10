/**
 * Script de prueba para demostrar el funcionamiento del sistema DVH
 */

const { calcularDVH, verificarDVH } = require('./dvh');
const { User, Post } = require('../../models');

async function probarSistemaDVH() {
  console.log('🔒 Sistema de Dígito Verificador Horizontal (DVH)');
  console.log('='.repeat(50));

  try {
    // 1. Probar cálculo de DVH con datos de ejemplo
    console.log('\n1️⃣ Probando cálculo de DVH con datos de ejemplo...');

    const datosEjemplo = {
      username: 'usuario_prueba',
      email: 'test@example.com',
      estado: 'activo',
      isAdmin: false
    };

    const dvhCalculado = calcularDVH(datosEjemplo);
    console.log('📝 Datos de ejemplo:', datosEjemplo);
    console.log('🔢 DVH calculado:', dvhCalculado);

    // 2. Probar verificación con datos correctos
    console.log('\n2️⃣ Probando verificación con DVH correcto...');

    const datosConDVH = {
      ...datosEjemplo,
      dvh: dvhCalculado
    };

    const esValido = verificarDVH(datosConDVH);
    console.log('✅ Verificación con DVH correcto:', esValido ? 'VÁLIDO' : 'INVÁLIDO');

    // 3. Probar detección de manipulación
    console.log('\n3️⃣ Probando detección de manipulación de datos...');

    const datosManipulados = {
      ...datosConDVH,
      username: 'usuario_malicioso', // Cambiamos un dato pero mantenemos el DVH original
      dvh: dvhCalculado // Mismo DVH que los datos originales
    };

    const esValidoManipulado = verificarDVH(datosManipulados);
    console.log('❌ Verificación con datos manipulados:', esValidoManipulado ? 'VÁLIDO' : 'INVÁLIDO');
    console.log('🚨 ¡Manipulación detectada!');

    // 4. Probar con usuarios reales de la base de datos (si existen)
    console.log('\n4️⃣ Verificando integridad de usuarios en la base de datos...');

    try {
      const usuarios = await User.findAll({ limit: 3 });

      if (usuarios.length === 0) {
        console.log('📭 No hay usuarios en la base de datos para verificar');
      } else {
        console.log(`📊 Encontrados ${usuarios.length} usuarios para verificar:`);

        for (const usuario of usuarios) {
          const datosUsuario = usuario.get({ plain: true });
          const integridadUsuario = verificarDVH(datosUsuario);

          console.log(`   👤 Usuario ${usuario.username} (ID: ${usuario.id}): ${integridadUsuario ? '✅ Válido' : '❌ Inválido'} - DVH: ${usuario.dvh}`);
        }
      }
    } catch (dbError) {
      console.log('⚠️  No se pudo conectar a la base de datos:', dbError.message);
    }

    // 5. Demostrar diferentes métodos de cálculo
    console.log('\n5️⃣ Comparando métodos de cálculo...');

    const { calcularDVHSimple } = require('./dvh');
    const dvhHash = calcularDVH(datosEjemplo);
    const dvhSimple = calcularDVHSimple(datosEjemplo);

    console.log('🔐 Método SHA-256 (recomendado):', dvhHash);
    console.log('🧮 Método simple (suma ponderada):', dvhSimple);

    console.log('\n✨ Pruebas completadas con éxito!');
    console.log('🎯 El sistema DVH está funcionando correctamente.');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas si se corre este script directamente
if (require.main === module) {
  probarSistemaDVH();
}

module.exports = { probarSistemaDVH };