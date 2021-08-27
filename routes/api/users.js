const {
  createOneUser, deleteOneUser,
} = require('../../controllers/usersControllers');

function usersRoutes(request, response) {
  if (request.method === 'POST' && /\/api\/users\/?$/.test(request.url)) {
    createOneUser(request, response);
  } else if (request.method === 'DELETE' && /\/api\/users\/currentuserid$/.test(request.url)) {
    deleteOneUser(request, response);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ message: `${process.env.SERVER_HOST}${request.url} is invalid.` }));
    response.end();
  }
}

module.exports = {
  usersRoutes,
};
