const express = require('express');
const app = express();
const User = require('./models/user');
//Middleware para interpretar el formato JSON en las solicitudes
app.use(express.json());




app.use((req, res, next) => {
  console.log(`Método: ${req.method} | Ruta: ${req.path}`);
  next();
});



app.get('/api/hello', (req, res) => {

    //obtenemos el nombre de la consulta con el método query
    //Si hay nombre lo usamos, si no enviamo directamente un Hello World
  const name = req.query.name; 
  const message = name ? `Hello ${name}` : 'Hello World';
  res.status(200).json({ message });
});

app.post('/api/echo', (req, res) => {
  const { message } = req.body;

  //Hacemos la validacion para asegurarnos que el mensaje no esté vacío
  //Si no hubiese un mensaje,  devolvemos un codigo 400 con un mensaje de error
  if (!message) {
    return res.status(400).json({ error: 'El campo "message" es obligatorio.' });
  }

  // Devolvemos el mismo mensaje recibido
  res.status(200).json({ message });
});


//Hacemos un post para crear un usuario
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    // Creamos y guardamos el usuario
    const user = new User({ name, email });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    // Manejo básico de errores (ej. email duplicado, campos inválidos)
    res.status(400).json({ error: error.message });
  }
});

//El get para obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();  // Buscar todos los usuarios
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

//Obtener usuario por id
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    // Si el ID no es válido (formato incorrecto de ObjectId) mandamos un 400 con el mensaje de error
    res.status(400).json({ error: 'ID inválido' });
  }
});


//Una vez que tenemos el test de greeting, creamos el endpoint con lo mínimo necesario para poder pasarlo.
//Vale, finalmente lo modifique en el punto 14, para que reciba un parámetro opcional name
// y devuelva un saludo personalizado si se pasa el nombre, o un Hello World si no se pasa nada
app.get('/api/greeting', (req, res) => {
    // Leemos el parámetro opcional name de la consulta
  // Si no se pasa, devolvemos "Hello, World!"
  const name = req.query.name;  
  const message = name ? `Hello, ${name}!` : 'Hello, World!';

  res.status(200).type('text/plain').send(message);
});


// Vamos a actualizar un usuario existente
app.put('/api/users/:id', async (req, res) => {
  try {
    // Buscamos y actualizamos el usuario según su ID, le asignamos los datos nuevos enviados en el body 
    //
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,                              // ID recibido por URL
      { name: req.body.name, email: req.body.email },  // Nuevos datos enviados en el body
      { new: true}        
    );

    // Si no se enccuentra el usuario le devolvemos un 404
    // y un mensaje de error
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si todo sale bien, devolvemos el usuario actualizado
    // y un código 200
    res.status(200).json(updatedUser);

  } catch (error) {
    // Si hubo un error devolvemos un codigo 400
    res.status(400).json({ error: error.message });
  }
});


    module.exports = app;