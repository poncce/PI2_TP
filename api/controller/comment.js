const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");

async function agregarComentario(req, res) {
  const { postId } = req.params;    
  const autorId = req.user.id;       
  const { contenido } = req.body;   


  if (!contenido) {
    return res.status(400).json({ message: "Falta el contenido del comentario" });
  }

  const post = await Post.findByPk(postId);
  if (!post) {
    return res.status(404).json({ message: "Post no encontrado" });
  }

  const comentario = await Comment.create({
    PostId: postId,
    autorId,
    contenido,
    fechaComentario: new Date(),
  });

  res.status(201).json({
    message: "Comentario agregado exitosamente"
  });
}

module.exports = {
  agregarComentario
}
