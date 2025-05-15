const request = require('supertest');
const app = require('../app');

//Definimos el test para greeting con su ruta y lo que esperamos que suceda
describe('GET /api/greeting', () => {
  it('debería devolver "Hello, World!" como texto plano', async () => {
    const response = await request(app).get('/api/greeting');

    //Verificamos que el codigo sea 200 y el tipo de contenido que lleva dentro
    // finalmente verificamos que el texto sea Hello World
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    expect(response.text).toBe('Hello, World!');
  });
});