const { Post } = require('../models/Posts');

const createPost = async (req, res) => {
  const autorId = req.user.id; 
  const { titulo, contenido } = req.body;

  if (!titulo || !contenido) {
    return res.status(400).json({ message: 'Faltan datos requeridos: titulo y contenido' });
  }

  const newPost = await Post.create({
    autorId,
    titulo,
    contenido,
  });

  res.status(201).json({ message: 'Post creado exitosamente'});
};

module.exports = {
  createPost,
};
