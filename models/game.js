const mongoose = require('mongoose');

// Definición del esquema de la colección "sala"
const salaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  estado: { 
    type: String, 
    default: 'creado' // valor por defecto si no se especifica un estado
  }
});

// Definición del esquema de la colección "jugador"
const jugadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // el nombre del jugador es obligatorio
  },
  puntaje: {
    type: Number,
    default: 0, // puntaje inicial de un jugador
  },
  idSala: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sala', // referencia a la colección "sala"
    required: true, // la sala a la que pertenece el jugador es obligatoria
  },
});

// Creación de los modelos a partir de los esquemas definidos
const Jugador = mongoose.model('Jugador', jugadorSchema);
const Sala = mongoose.model('Sala', salaSchema);

// Exportación de los modelos
module.exports = {Jugador, Sala};
