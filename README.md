# Proyecto Testing Backend - Módulo 5 (Escuela Musk)

Este proyecto es una API backend desarrollada con Node.js y Express, creada como parte del Módulo 5 de la Escuela Musk.  
El objetivo principal fue aplicar diferentes tipos de pruebas (unitarias, integración, funcionales, TDD) para simular un entorno de desarrollo profesional.

## 🛠 Tecnologías utilizadas

- Node.js
- Express
- Mongoose
- MongoDB Memory Server
- Jest
- Supertest

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/TuUsuario/TuRepositorio.git
cd TestExpress
```
2. Instalar dependencias:

```
npm install

```

3. Ejecutar tests:

```
npm test
```

📋 Endpoints implementados
✅ /api/hello
GET → Devuelve { message: "Hello World" }

Permite opcionalmente personalizar el mensaje con ?name=Juan.

✅ /api/echo
POST → Devuelve el mismo mensaje enviado en el cuerpo { message: "..." }.

✅ /api/users
POST → Crea un nuevo usuario { name, email }.

GET → Devuelve todos los usuarios.

✅ /api/users/:id
GET → Devuelve un usuario por ID.

PUT → Actualiza un usuario existente (name y/o email).

✅ /api/greeting
GET → Devuelve "Hello, World!" como texto plano.

También permite personalizarlo con ?name=Juan.

🧪 Testing aplicado
Este proyecto aplicó diferentes niveles de testing:

Unitarios → Verificación de funciones y endpoints básicos.

Integración → Verificación de interacción con la base de datos (MongoDB en memoria).

Funcionales → Simulación de flujos completos (registro y obtención de usuarios).

TDD → Ejemplo aplicado en el endpoint /api/greeting, escribiendo primero la prueba y luego el código.

📝 Decisiones arquitectónicas
Se optó por una arquitectura Monolito, ya que la escala del proyecto es pequeña y no justifica microservicios.

Se aplicó el patrón MVC básico (Model - Controller), adecuado para proyectos de este tamaño.

Se priorizó la escritura de pruebas desde el primer momento (TDD) para garantizar calidad de desarrollo.


👨‍💻 Autor
[Guillermo Luna Alvarez]
Escuela Musk - Módulo 5
