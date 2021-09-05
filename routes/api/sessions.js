const {
  createOneSession, deleteOneSession, readOneSession,
} = require('../../controllers/sessionsControllers');

function sessionsRoutes(request, response) {
  if (request.method === 'GET' && /\/api\/sessions\/currentsessionid$/.test(request.url)) {
    readOneSession(request, response);
  } else if (request.method === 'POST' && /\/api\/sessions\/?$/.test(request.url)) {
    createOneSession(request, response);
  } else if (request.method === 'DELETE' && /\/api\/sessions\/currentsessionid$/.test(request.url)) {
    deleteOneSession(request, response);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ message: `http://localhost:5000${request.url} is invalid.` }));
    response.end();
  }
}

module.exports = {
  sessionsRoutes,
};
