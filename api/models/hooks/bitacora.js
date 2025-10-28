const nivelesCriticidad = {
  seguridad: 1,
  administracion: 2,
  contenido: 3
};

const registrarBitacora = async (db, {
  accion,
  entidad,
  entidad_id = null,
  usuario_id = null,
  antes = null,
  despues = null,
  criticidad = nivelesCriticidad.contenido,
  ip = null,
  user_agent = null,
  transaction = null
}) => {
  try {
    await db.Bitacora.create({
      accion,
      entidad,
      entidad_id: entidad_id?.toString() ?? null,
      usuario_id,
      antes,
      despues,
      criticidad,
      ip,
      user_agent
    }, { transaction });
  } catch (err) {
    // silent
  }
};

module.exports = { registrarBitacora, nivelesCriticidad };
