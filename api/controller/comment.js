const { Comment } = require("../models/Comments");
const { Post } = require("../models/Posts");

async function agregarComentario({ postId, autorId, contenido }) {
  const post = await Post.findByPk(postId);
  if (!post) {
    res.json({ message: "Post no encontrado" });
}
  const comentario = await Comment.create({
    PostId: postId,
    autorId,
    contenido,
    fechaComentario: new Date(),
  });

  res.json({ message: "Comentario agregado exitosamente" });
}

module.exports = {
  agregarComentario,
};
