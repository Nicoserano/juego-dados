// Importamos la librería 'express'
const express = require('express');

// Creamos un objeto 'router' a partir de la función Router de 'express'
const router = express.Router();

// Importamos los controladores de la lógica de negocio de nuestro juego
const { crearSala, mainController, crearJugadores, verEstadoSala, lanzarDados, verJugadores } = require('../controllers/gameController');

// Ruta principal de nuestro juego, que muestra la página principal
router.get('/', mainController);

// Ruta para crear una sala de juego
router.post('/crear-sala', crearSala);

// Ruta para crear los jugadores que participarán en la sala de juego
router.post('/crear-jugadores', crearJugadores);

// Ruta para ver el estado actual de una sala de juego específica
router.get('/ver-estado-sala/:idSala', verEstadoSala);

// Ruta para lanzar los dados de una sala de juego específica
router.post('/lanzar-dados/:idSala', lanzarDados);

// Ruta para ver los puntajes de los jugadores en una sala de juego específica
router.get('/ver-puntajes/:idSala', verJugadores);

// Exportamos nuestro router para que pueda ser utilizado en nuestro servidor
module.exports = router;