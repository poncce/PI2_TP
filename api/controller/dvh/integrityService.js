const { verificarDVH } = require('./dvh');
const { User, Post } = require('../../models');

/**
 * Servicio para verificar la integridad de los datos usando DVH
 */
class IntegrityService {
  /**
   * Verifica la integridad de todos los usuarios en la base de datos
   * @returns {Object} - Resultado de la verificación
   */
  static async verificarIntegridadUsuarios() {
    try {
      const usuarios = await User.findAll();
      const resultados = [];

      for (const usuario of usuarios) {
        const esValido = verificarDVH(usuario.dataValues);
        resultados.push({
          id: usuario.id,
          username: usuario.username,
          dvh: usuario.dvh,
          valido: esValido,
          error: esValido ? null : 'DVH no coincide - posible manipulación'
        });
      }

      const total = usuarios.length;
      const validos = resultados.filter(r => r.valido).length;
      const invalidos = total - validos;

      return {
        entidad: 'Usuarios',
        total,
        validos,
        invalidos,
        detalles: resultados
      };
    } catch (error) {
      throw new Error(`Error al verificar integridad de usuarios: ${error.message}`);
    }
  }

  /**
   * Verifica la integridad de todos los posts en la base de datos
   * @returns {Object} - Resultado de la verificación
   */
  static async verificarIntegridadPosts() {
    try {
      const posts = await Post.findAll();
      const resultados = [];

      for (const post of posts) {
        const esValido = verificarDVH(post.dataValues);
        resultados.push({
          id: post.id,
          titulo: post.titulo,
          dvh: post.dvh,
          valido: esValido,
          error: esValido ? null : 'DVH no coincide - posible manipulación'
        });
      }

      const total = posts.length;
      const validos = resultados.filter(r => r.valido).length;
      const invalidos = total - validos;

      return {
        entidad: 'Posts',
        total,
        validos,
        invalidos,
        detalles: resultados
      };
    } catch (error) {
      throw new Error(`Error al verificar integridad de posts: ${error.message}`);
    }
  }

  /**
   * Verifica la integridad de un registro específico
   * @param {string} modelo - Nombre del modelo (User, Post)
   * @param {number} id - ID del registro
   * @returns {Object} - Resultado de la verificación
   */
  static async verificarRegistro(modelo, id) {
    try {
      let Modelo;
      switch (modelo.toLowerCase()) {
        case 'user':
        case 'usuario':
          Modelo = User;
          break;
        case 'post':
          Modelo = Post;
          break;
        default:
          throw new Error(`Modelo no soportado: ${modelo}`);
      }

      const registro = await Modelo.findByPk(id);
      if (!registro) {
        throw new Error(`Registro no encontrado: ${modelo} con ID ${id}`);
      }

      const esValido = verificarDVH(registro.dataValues);

      return {
        entidad: modelo,
        id: registro.id,
        datos: registro.dataValues,
        dvh: registro.dvh,
        valido: esValido,
        error: esValido ? null : 'DVH no coincide - posible manipulación de datos'
      };
    } catch (error) {
      throw new Error(`Error al verificar registro: ${error.message}`);
    }
  }

  /**
   * Verificación completa de integridad de toda la base de datos
   * @returns {Object} - Resultado completo
   */
  static async verificacionCompleta() {
    try {
      const [usuarios, posts] = await Promise.all([
        this.verificarIntegridadUsuarios(),
        this.verificarIntegridadPosts()
      ]);

      const totalRegistros = usuarios.total + posts.total;
      const totalValidos = usuarios.validos + posts.validos;
      const totalInvalidos = usuarios.invalidos + posts.invalidos;

      return {
        timestamp: new Date().toISOString(),
        resumen: {
          totalRegistros,
          totalValidos,
          totalInvalidos,
          porcentajeIntegridad: totalRegistros > 0 ? (totalValidos / totalRegistros * 100).toFixed(2) : 0
        },
        detalle: {
          usuarios,
          posts
        }
      };
    } catch (error) {
      throw new Error(`Error en verificación completa: ${error.message}`);
    }
  }
}

module.exports = IntegrityService;