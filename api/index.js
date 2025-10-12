// index
const express = require('express');
const { sayHello } = require('./controller/sayHello');
const { getUsers, registerUser, login, me, createAdmin,} = require('./controller/user');
const { isAuth, isAdmin } = require('./middlewares/auth');

const { sequelize } = require('./config/db');
const server = express();

server.use(express.json())
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});



server.get('/', sayHello)
server.get('/users', isAuth, getUsers)
server.get('/me', isAuth, me)
server.post('/users', registerUser)
server.post('/login', login)
server.post('/admin/create', createAdmin)   // checkear con malcos




server.listen(3000, async () => {
    await sequelize.sync({ force: false })
    console.log('El server esta ejecutandose en el puerto 3000');

})


