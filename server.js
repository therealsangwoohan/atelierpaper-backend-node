require('dotenv').config();

const http = require('http');
const { usersRoutes } = require('./routes/api/users');
const { sessionsRoutes } = require('./routes/api/sessions');
const { projectsRoutes } = require('./routes/api/projects');
const { imagesRoutes } = require('./routes/api/images');

const server = http.createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  response.setHeader('Access-Control-Allow-Headers', 'Set-Cookie');
  if (/\/api\/users(\/.*)?$/.test(request.url)) {
    usersRoutes(request, response);
  } else if (/\/api\/sessions(\/.*)?$/.test(request.url)) {
    sessionsRoutes(request, response);
  } else if (/\/api\/projects(\/.*)?$/.test(request.url)) {
    projectsRoutes(request, response);
  } else if (/\/api\/images(\/.*)?$/.test(request.url)) {
    imagesRoutes(request, response);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ message: `${process.env.SERVER_HOST}${request.url} is invalid.` }));
    response.end();
  }
});

server.listen(5000, 'localhost', () => console.log('The server has been bound.'));
