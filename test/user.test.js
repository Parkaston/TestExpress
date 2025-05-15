const app = require('../app');
const request = require('supertest');
// Importamos mongoose (para manejar la base de datos MongoDB)
const mongoose = require('mongoose');

// Importamos MongoMemoryServer para levantar un MongoDB temporal en memoria
const { MongoMemoryServer } = require('mongodb-memory-server');

// Importamos el modelo User (definido por nosotros en user.js)
const User = require('../models/user'); 

// Declaramos una variable para almacenar la instancia del servidor MongoDB en memoria
let mongoServer;


beforeAll(async () => {
  // Creamos el servidor MongoDB temporal
  mongoServer = await MongoMemoryServer.create();

  // Obtenemos la URI )
  const uri = mongoServer.getUri();

  // Conectamos mongoose a la base de datos en memoria
  await mongoose.connect(uri, {
    useNewUrlParser: true,          // Opciones para evitar warnings
    useUnifiedTopology: true
  });
});

//Despues de cada test, eliminamos todos los usuarios creados
// y cerramos la conexión con la base de datos
afterEach(async () => {
    // Borra todos los usuarios creados durante un test
  await User.deleteMany();   
});

//Finalmente despues de hacer los test borramos la base de datos,
// cerramos la conexion y apagamos el servidor temporal en memoria
afterAll(async () => {
  await mongoose.connection.dropDatabase();  // Borra la base completa
  await mongoose.connection.close();         // Cierra la conexión con MongoDB
  await mongoServer.stop();                  // Apaga el servidor MongoDB temporal
});

//Necesito agregar un test para que no falle el test de jest
describe('Prueba para MongoDB memory server', () => {
  it('debería conectar a la base de datos en memoria', async () => {
    expect(mongoose.connection.readyState).toBe(1);  
    //El estado 1 signfica que la conexión está abierta
  });
});



//Vamos a hacer los teste de tipo TDD donde primero hacemos el test y luego la implementación
//Hacemos el test de la API para crear un usuario
describe('PUT /api/users/:id', () => {
  it('debería actualizar el nombre y/o email de un usuario existente', async () => {
    // Creamos un usuario para poder actualizarlo después
    const user = await User.create({ name: 'Laura', email: 'laura@example.com' });

    // Hacemos la petición PUT con los datos actualizados
    const updatedData = { name: 'Laura Modificada', email: 'laura.mod@example.com' };
    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .send(updatedData);

    // Chequeamos que la respuesta sea 200 y los datos hayan cambiado
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.email).toBe(updatedData.email);

    // Comprobamos directamente en la base de datos que se guardaron los cambios
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.name).toBe(updatedData.name);
    expect(updatedUser.email).toBe(updatedData.email);
  });
});


