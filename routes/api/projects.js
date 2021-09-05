const {
  createOneProject, readAllProjects, readOneProject, updateOneProject, deleteOneProject,
} = require('../../controllers/projectsControllers');

function projectsRoutes(request, response) {
  if (request.method === 'POST' && /\/api\/projects\/?$/.test(request.url)) {
    createOneProject(request, response);
  } else if (request.method === 'GET' && /\/api\/projects\/?$/.test(request.url)) {
    readAllProjects(request, response);
  } else if (request.method === 'GET' && /\/api\/projects\/\w+$/.test(request.url)) {
    const project_id = request.url.split('/')[3];
    readOneProject(request, response, project_id);
  } else if (request.method === 'POST' && /\/api\/projects\/\w+$/.test(request.url)) {
    const project_id = request.url.split('/')[3];
    updateOneProject(request, response, project_id);
  } else if (request.method === 'DELETE' && /\/api\/projects\/\w+$/.test(request.url)) {
    const project_id = request.url.split('/')[3];
    deleteOneProject(request, response, project_id);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ message: `http://localhost:5000${request.url} is invalid.` }));
    response.end();
  }
}

module.exports = {
  projectsRoutes,
};
