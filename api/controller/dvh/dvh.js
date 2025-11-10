const crypto = require('crypto');

/**
 * Calcula el Dígito Verificador Horizontal (DVH) para un registro
 * Usando un algoritmo de hash optimizado para garantizar integridad
 *
 * @param {Object} data - Objeto con los datos del registro (sin incluir DVH)
 * @returns {string} - DVH calculado como string hexadecimal
 */
function calcularDVH(data) {
  try {
    // Eliminar campos que no deben participar en el cálculo
    const { dvh, id, createdAt, updatedAt, ...datosLimpios } = data;

    // Ordenar las claves para garantizar consistencia
    const clavesOrdenadas = Object.keys(datosLimpios).sort();

    // Construir string concatenando todos los valores de forma ordenada
    let stringConcatenado = '';
    for (const clave of clavesOrdenadas) {
      if (datosLimpios[clave] !== null && datosLimpios[clave] !== undefined) {
        stringConcatenado += String(datosLimpios[clave]);
      }
    }

    // Calcular hash SHA-256 y tomar los primeros 8 caracteres (más eficiente)
    const hash = crypto.createHash('sha256')
      .update(stringConcatenado, 'utf8')
      .digest('hex')
      .substring(0, 8); // 32 bits = 8 caracteres hexadecimales

    return hash;
  } catch (error) {
    console.error('Error al calcular DVH:', error);
    // En caso de error, retornar un valor por defecto
    return '00000000';
  }
}

/**
 * Verifica si el DVH de un registro es válido
 *
 * @param {Object} registro - Registro completo con su DVH
 * @returns {boolean} - true si el DVH es válido, false si hay manipulación
 */
function verificarDVH(registro) {
  if (!registro.dvh) {
    return false;
  }

  const dvhCalculado = calcularDVH(registro);
  return registro.dvh === dvhCalculado;
}

/**
 * Calcula DVH usando método alternativo (suma ponderada con primo 7)
 * Este método es más simple pero menos seguro que el hash
 *
 * @param {Object} data - Objeto con los datos del registro
 * @returns {number} - DVH calculado como número
 */
function calcularDVHSimple(data) {
  try {
    const { dvh, id, createdAt, updatedAt, ...datosLimpios } = data;

    let sumaTotal = 0;
    let peso = 1;

    // Recorrer todos los valores y sumar caracteres ASCII con pesos
    const valores = Object.values(datosLimpios);
    for (const valor of valores) {
      if (valor !== null && valor !== undefined) {
        const stringValor = String(valor);
        for (let i = 0; i < stringValor.length; i++) {
          sumaTotal += stringValor.charCodeAt(i) * peso;
          peso = (peso % 7) + 1; // Ciclar entre 1 y 7
        }
      }
    }

    return sumaTotal % 100000000; // Mantenerlo en 8 dígitos
  } catch (error) {
    console.error('Error al calcular DVH simple:', error);
    return 0;
  }
}

module.exports = {
  calcularDVH,
  verificarDVH,
  calcularDVHSimple
};