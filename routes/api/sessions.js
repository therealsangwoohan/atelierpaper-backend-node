const {
  createOneSession, deleteOneSession,
} = require('../../controllers/sessionsControllers');

function sessionsRoutes(request, response) {
  if (request.method === 'POST' && /\/api\/sessions\/?$/.test(request.url)) {
    createOneSession(request, response);
  } else if (request.method === 'DELETE' && /\/api\/sessions\/currentsessionid$/.test(request.url)) {
    deleteOneSession(request, response);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ message: `${process.env.SERVER_HOST}${request.url} is invalid.` }));
    response.end();
  }
}

module.exports = {
  sessionsRoutes,
};
