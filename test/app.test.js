

const app = require('../app'); 
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user');

let mongoServer;




//Vamos a setear la base de datos temporal para hacer los test

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

//Despues de cada testm eliminamos los usuarios creados
afterEach(async () => {
  await User.deleteMany(); 
});

//Cerramos la conexión y apagamos el servidor temporal
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

//Hacemos los test de la API
describe('Pruebas de integración para /api/users', () => {

  it('debería crear un usuario y almacenarlo en la base de datos', async () => {
    const userData = { name: 'Juan Perez', email: 'juan@example.com' };

    const response = await request(app)
      .post('/api/users')
      .send(userData);
    // Verificamos que la respuesta sea correcta
    // y que el usuario se haya almacenado en la base de dato
    // comparando el nombre y el email con el que enviamos la soliciutd
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);

    const userInDb = await User.findOne({ email: userData.email });
    expect(userInDb).not.toBeNull();
    expect(userInDb.name).toBe(userData.name);
  });


  //Hacemos el test de la API para obtener todos los usuarios
  it('debería devolver todos los usuarios almacenados', async () => {
    await User.create([
      { name: 'Ana Lopez', email: 'ana@example.com' },
      { name: 'Carlos Ruiz', email: 'carlos@example.com' }
    ]);

    const response = await request(app).get('/api/users');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Ana Lopez');
    expect(response.body[1].name).toBe('Carlos Ruiz');
  });


  //Testeamos el endpoint para obtener usuario por endpoint y verificar que funcione el mensaje
  //de error si no existe el usuario
  it('no debería permitir crear dos usuarios con el mismo email', async () => {
    const userData = { name: 'Pedro Gomez', email: 'pedro@example.com' };

    // Primer usuario (debería funcionar)
    await request(app).post('/api/users').send(userData);

    // Segundo usuario con mismo email (debería fallar)
    const response = await request(app).post('/api/users').send(userData);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/duplicate key error/i); 
    // Este mensaje puede variar, por eso usamos regex y no string exacto
  });

});




//Hacemos el test de api/hello donde probamos que el endpoint devuelve un Hello World o un Hello + nombre
// dependiendo de si le pasamos un nombre o no
describe('GET /api/hello', () => {
  
  it('Deberia devolver un hello world si no le pasamos un parametro', async () => {
    const response = await request(app).get('/api/hello');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Hello World');
  });

  it('Deberia enviar un mensaje personalizado si tenemos un name', async () => {
    const response = await request(app).get('/api/hello?name=Juan');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Hello Juan');
  });

});


//

describe('POST /api/echo', () => {

  it('debería responder con el mismo mensaje enviado', async () => {
    const mensaje = 'Este es un test';
    const response = await request(app)
      .post('/api/echo')
      .send({ message: mensaje });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(mensaje);
  });

  it('debería devolver error 400 si no se envía message', async () => {
    const response = await request(app)
      .post('/api/echo')
      .send({}); // No enviamos 'message'

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('El campo "message" es obligatorio.');
  });

});


