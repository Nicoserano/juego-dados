// Importamos los modelos de la base de datos
const {Sala, Jugador} = require('../models/game');

// Controlador para renderizar la página principal del juego
const mainController = (req, res) => {
    res.render('index', { title: 'Juego de dados Sofka' });
};

// Controlador para crear una nueva sala de juego
const crearSala = async (req, res) => {
    try {
      const { nombre } = req.body;
      // Buscamos si ya existe una sala con ese nombre
      const salaExistente = await Sala.findOne({ nombre });
      if (salaExistente) {
        return res.status(400).json({ message: 'Ya existe una sala con ese nombre' });
      }
      // Creamos una nueva sala con el nombre proporcionado y estado "iniciado"
      const nuevaSala = new Sala({ nombre, estado: 'iniciado' });
      await nuevaSala.save();
      const idSala = nuevaSala._id;
      // Renderizamos la página para que los jugadores puedan unirse a la sala
      res.render('gamers', { nombreSala: nombre, idSala: idSala }); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Ha ocurrido un error al crear la sala');
    }
};

// Controlador para crear los jugadores en una sala
const crearJugadores = async (req, res) => {
    const { nombre1, nombre2, nombre3 } = req.body;
    const idSala = req.body.idSala;

    try {
      // Buscamos la sala por ID
      const sala = await Sala.findById(idSala);

      if (!sala) {
        return res.status(404).json({ message: 'Sala no encontrada' });
      }
      // Creamos los 3 jugadores con los nombres proporcionados y el ID de la sala
      const jugador1 = new Jugador({ nombre: nombre1, idSala });
      const jugador2 = new Jugador({ nombre: nombre2, idSala });
      const jugador3 = new Jugador({ nombre: nombre3, idSala });

      // Guardamos los jugadores en la base de datos
      await jugador1.save();
      await jugador2.save();
      await jugador3.save();
      // Cambiamos el estado de la sala a "jugadores creados"
      sala.estado = 'jugadores creados';
      await sala.save();
      console.log('creados')
      // Redirigimos a la página principal del juego
      res.render('game', {nombre1,nombre2,nombre3,idSala});

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};


// Este controlador busca el estado de una sala a partir de su ID y lo muestra en una vista.

const verEstadoSala = async (req, res) => {
  const idSala = req.params.idSala;
  console.log(idSala);

  try {
    // Buscamos la sala en la base de datos utilizando el método findById de Mongoose.
    const sala = await Sala.findById(idSala);

    // Si no se encuentra la sala, se devuelve un mensaje de error con un estado de respuesta 404.
    if (!sala) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }

    // Si se encuentra la sala, se renderiza la vista "state" con el estado de la sala como parámetro.
    res.render('state', { estado: sala.estado });

  } catch (error) {
    // Si ocurre algún error durante el proceso, se muestra un mensaje de error genérico con un estado de respuesta 500.
    console.error(error);
    res.status(500).send('Ha ocurrido un error al buscar la sala');
  }
};


// Función asincrónica para lanzar los dados de los jugadores en una sala de juego específica
const lanzarDados = async (req, res) => {

    // Obtenemos el ID de la sala a partir de los parámetros de la solicitud
    const idSala = req.params.idSala;
    console.log(idSala);
    
    try {
      // Buscamos la sala correspondiente al ID
      const sala = await Sala.findById(idSala);
      
      // Si la sala no existe, devolvemos un mensaje de error
      if (!sala) {
        return res.status(404).json({ message: 'Sala no encontrada' });
      }
      
      // Si el estado de la sala es "terminado", redirigimos al usuario a la vista de la sala
      if (sala.estado === 'terminado') {
        return res.render('sala', {idSala});
      }
      
      // Buscamos los jugadores de la sala
      const jugadores = await Jugador.find({ idSala });
      
      // Lanzamos los dados para cada jugador
      for (let jugador of jugadores) {
        let totalPuntaje = 0;
        for (let i = 0; i < 1; i++) {
          const dado1 = Math.floor(Math.random() * 6) + 1;
          const dado2 = Math.floor(Math.random() * 6) + 1;
          const puntaje = dado1 + dado2;
          totalPuntaje += puntaje;
        }
        // Guardamos el puntaje total del jugador
        jugador.puntaje = totalPuntaje;
        await jugador.save();
      }
      
      // Cambiamos el estado de la sala a "terminado"
      sala.estado = 'terminado';
      await sala.save();
      
      // Buscamos al ganador de la partida (el jugador con el puntaje más alto)
      const ganador = await Jugador.findOne({ idSala }).sort({ puntaje: -1 });
      
      // Mostramos la vista 'winner' con los datos del ganador
      res.render('winner', { nombreGanador: ganador.nombre, puntajeGanador: ganador.puntaje, idSala });
    } catch (error) {
      // Si ocurrió un error al lanzar los dados, lo mostramos en la consola y enviamos una respuesta de error al cliente
      console.error(error);
      res.status(500).send('Ha ocurrido un error al lanzar los dados');
    }
    };



// Función asincrónica para mostrar los puntajes de los jugadores en una sala de juego específica
const verJugadores = async (req, res) => {

  // Obtenemos el ID de la sala a partir de los parámetros de la solicitud
  const idSala = req.params.idSala;
  console.log(idSala);
  
  try {
      // Buscamos los jugadores de la sala especificada, ordenados por puntaje descendente
      const jugadores = await Jugador.find({ idSala }).sort({ puntaje: -1 });
      
      
      // Si no se encontraron jugadores en la sala, devolvemos un mensaje de error
      if (!jugadores || jugadores.length === 0) {
        return res.status(404).json({ message: 'Jugadores no encontrados' });
      }
      
      // Renderizamos la vista 'players' y le pasamos los datos de los jugadores encontrados
      res.render('players', { jugadores });
  } catch (error) {
      // Si ocurrió un error al buscar los jugadores, lo mostramos en la consola y enviamos una respuesta de error al cliente
      console.error(error);
      res.status(500).send('Ha ocurrido un error al buscar los jugadores');
  }
};




module.exports = { crearSala, mainController, crearJugadores, verEstadoSala , lanzarDados, verJugadores, };
