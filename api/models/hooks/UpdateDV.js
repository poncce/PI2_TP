const { actualizarDV } = require('../DV');

function agregarHooksDV(modelo, nombreTabla) {
  modelo.addHook('afterCreate', async () => {
    await actualizarDV(modelo, nombreTabla);
  });
  modelo.addHook('afterUpdate', async () => {
    await actualizarDV(modelo, nombreTabla);
  });
  modelo.addHook('afterDestroy', async () => {
    await actualizarDV(modelo, nombreTabla);
  });
}

module.exports = { agregarHooksDV };
