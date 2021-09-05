const {
  createOneUser, readAllUsers, readOneUser, deleteOneUser,
} = require('../../controllers/usersControllers');

function usersRoutes(request, response) {
  if (request.method === 'POST' && /\/api\/users\/?$/.test(request.url)) {
    createOneUser(request, response);
  } else if (request.method === 'GET' && /\/api\/users\/?$/.test(request.url)) {
    readAllUsers(request, response);
  } else if (request.method === 'GET' && /\/api\/users\/\w+$/.test(request.url)) {
    const user_id = request.url.split('/')[3];
    readOneUser(request, response, user_id);
  } else if (request.method === 'DELETE' && /\/api\/users\/currentuserid$/.test(request.url)) {
    deleteOneUser(request, response);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ message: `http://localhost:5000${request.url} is invalid.` }));
    response.end();
  }
}

module.exports = {
  usersRoutes,
};
