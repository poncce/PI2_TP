const express = require('express');
const { User } = require('../models');

const router = express.Router();

// Ruta de prueba para bitácora
router.post('/test-bitacora', async (req, res) => {
  try {
    // Simular una operación para probar la bitácora
    const testUser = await User.create({
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@test.com`,
      password: 'test123',
      estado: 'activo'
    }, {
      context: {
        usuario_id: 1, // Simular usuario 1
        ip: req.ip,
        user_agent: req.get('User-Agent')
      }
    });

    res.json({
      message: 'Usuario de prueba creado',
      user: testUser,
      bitacoraNote: 'Esta operación debería haberse registrado en la bitácora'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;