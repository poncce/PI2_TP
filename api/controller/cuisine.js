// controller/cuisine.js
const { Cuisine } = require('../models/Cuisine');
const { agregarContexto } = require('../middlewares/contextMiddleware');

// Obtener todas las cocinas activas
const getCuisines = async (req, res) => {
  try {
    const cuisines = await Cuisine.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json(cuisines);
  } catch (error) {
    console.error('Error al obtener cocinas:', error);
    res.status(500).json({ message: 'Error al obtener las cocinas' });
  }
};

// Obtener una cocina por ID
const getCuisineById = async (req, res) => {
  try {
    const { id } = req.params;
    const cuisine = await Cuisine.findByPk(id);

    if (!cuisine) {
      return res.status(404).json({ message: 'Cocina no encontrada' });
    }

    res.json(cuisine);
  } catch (error) {
    console.error('Error al obtener cocina:', error);
    res.status(500).json({ message: 'Error al obtener la cocina' });
  }
};

// Crear una nueva cocina (solo admin)
const createCuisine = async (req, res) => {
  try {
    const { name, description, origin, flag } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre de la cocina es requerido' });
    }

    const opciones = agregarContexto(req);

    const cuisine = await Cuisine.create({
      name,
      description,
      origin,
      flag
    }, opciones);

    res.status(201).json(cuisine);
  } catch (error) {
    console.error('Error al crear cocina:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe una cocina con ese nombre' });
    }
    res.status(500).json({ message: 'Error al crear la cocina' });
  }
};

// Actualizar una cocina (solo admin)
const updateCuisine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, origin, flag, isActive } = req.body;

    const cuisine = await Cuisine.findByPk(id);
    if (!cuisine) {
      return res.status(404).json({ message: 'Cocina no encontrada' });
    }

    const opciones = agregarContexto(req);

    await cuisine.update({
      name,
      description,
      origin,
      flag,
      isActive
    }, opciones);

    res.json(cuisine);
  } catch (error) {
    console.error('Error al actualizar cocina:', error);
    res.status(500).json({ message: 'Error al actualizar la cocina' });
  }
};

// Eliminar una cocina (solo admin)
const deleteCuisine = async (req, res) => {
  try {
    const { id } = req.params;

    const cuisine = await Cuisine.findByPk(id);
    if (!cuisine) {
      return res.status(404).json({ message: 'Cocina no encontrada' });
    }

    // Soft delete: marcar como inactiva
    const opciones = agregarContexto(req);
    await cuisine.update({ isActive: false }, opciones);

    res.json({ message: 'Cocina eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cocina:', error);
    res.status(500).json({ message: 'Error al eliminar la cocina' });
  }
};

module.exports = {
  getCuisines,
  getCuisineById,
  createCuisine,
  updateCuisine,
  deleteCuisine
};