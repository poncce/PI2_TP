// controller/post.js
const { Post } = require('../models/Post');
const { agregarContexto } = require('../middlewares/contextMiddleware');
const { Op } = require('sequelize');

const createPost = async (req, res) => {
  try {
    const autorId = req.user.id;
    const { titulo, contenido } = req.body;

    if (!titulo || !contenido) {
      return res.status(400).json({ message: 'Faltan datos requeridos: titulo y contenido' });
    }

    // Agregar contexto de la operación
    const opciones = agregarContexto(req);

    const newPost = await Post.create({
      autorId,
      titulo,
      contenido,
      fechaPublicacion: new Date()
    }, opciones);

    res.status(201).json({ message: 'Post creado exitosamente', post: newPost });
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ message: 'Error al crear el post', error: error.message });
  }
};

// Obtener todos los posts (recetas)
const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search
    } = req.query;

    const where = {};

    // Filtro de búsqueda
    if (search) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${search}%` } },
        { contenido: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['fechaPublicacion', 'DESC']]
    });

    // Obtener usernames para cada post
    const postsWithAuthors = await Promise.all(
      posts.rows.map(async (post) => {
        const { User } = require('../models');
        const user = await User.findByPk(post.autorId, {
          attributes: ['id', 'username']
        });

        return {
          ...post.toJSON(),
          autor: user ? { id: user.id, username: user.username } : null
        };
      })
    );

    res.json({
      total: posts.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(posts.count / parseInt(limit)),
      recipes: postsWithAuthors
    });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ message: 'Error al obtener los posts' });
  }
};

// Obtener un post por ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Obtener información del autor
    const { User } = require('../models');
    const user = await User.findByPk(post.autorId, {
      attributes: ['id', 'username']
    });

    const postWithAuthor = {
      ...post.toJSON(),
      autor: user ? { id: user.id, username: user.username } : null
    };

    res.json(postWithAuthor);
  } catch (error) {
    console.error('Error al obtener post:', error);
    res.status(500).json({ message: 'Error al obtener el post' });
  }
};

// Actualizar un post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar que el usuario sea el autor o admin
    if (post.autorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para editar este post' });
    }

    const opciones = agregarContexto(req);

    await post.update({
      titulo,
      contenido
    }, opciones);

    res.json({
      message: 'Post actualizado exitosamente',
      post
    });
  } catch (error) {
    console.error('Error al actualizar post:', error);
    res.status(500).json({ message: 'Error al actualizar el post' });
  }
};

// Eliminar un post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar que el usuario sea el autor o admin
    if (post.autorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este post' });
    }

    await post.destroy();

    res.json({
      message: 'Post eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ message: 'Error al eliminar el post' });
  }
};

// Búsqueda de posts
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;

    const where = {};

    // Búsqueda por texto
    if (q) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${q}%` } },
        { contenido: { [Op.like]: `%${q}%` } }
      ];
    }

    const posts = await Post.findAll({
      where,
      limit: 20,
      order: [['fechaPublicacion', 'DESC']]
    });

    res.json({
      total: posts.length,
      recipes: posts
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ message: 'Error en la búsqueda' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
};
