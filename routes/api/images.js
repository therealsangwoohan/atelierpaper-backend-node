const { readOneImage } = require('../../controllers/imagesControllers');

function imagesRoutes(request, response) {
  if (request.method === 'GET' && /\/api\/images\/\w+\/\w+$/.test(request.url)) {
    const project_id = request.url.split('/')[3];
    const idx = request.url.split('/')[4];
    readOneImage(request, response, project_id, idx);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ message: `${process.env.SERVER_HOST}${request.url} is invalid.` }));
    response.end();
  }
}

module.exports = {
  imagesRoutes,
};
