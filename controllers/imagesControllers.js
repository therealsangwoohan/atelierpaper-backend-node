const { getImageStream } = require('../storage/s3');

// TODO: What if the image doesn't exist?
function readOneImage(request, response, project_id, idx) {
  const imageStream = getImageStream(project_id, idx);

  response.statusCode = 200;
  response.setHeader('Content-Type', 'image/png');
  imageStream.pipe(response);
}

module.exports = {
  readOneImage,
};
