
const mongoose = require('mongoose');

// Definimos el esquema de usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    //El unique nos permite que no haya dos usuarios iguales
    unique: true,
    match: [/.+\@.+\..+/, 'El email debe tener un formato válido'] // (opcional pero recomendable)
  }
});

// Creación del modelo User basado en el esquema
const User = mongoose.model('User', userSchema);

// Exportar el modelo para poder usarlo en la app y en los tests
module.exports = User;
