const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes/routes');

// Configuración de la conexión a la base de datos
mongoose.connect(process.env.MONGODB)
.then(() => console.log('Conectado a la base de datos'))
  .catch(error => console.error(error));

// Configuración del motor de plantillas para renderizar vistas en formato Pug
app.set('view engine', 'pug');

// Configuración de middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de las rutas
app.use('/', router);

// Configuración del puerto del servidor
app.listen(8080, () => console.log('Servidor iniciado en el puerto 8080'));