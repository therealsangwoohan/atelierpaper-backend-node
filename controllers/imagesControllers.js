const { s3, getImageStream } = require('../storage/s3');

// TODO: What if the image doesn't exist?
function readOneImage(request, response, project_id, idx) {
  const imageStream = getImageStream(project_id, idx);

  response.statusCode = 200;
  response.setHeader('Content-Type', 'image/png');
  imageStream.pipe(response);
}

function getProjectImagesUrls(request, response, project_id) {
  const listObjectsParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: `${project_id}/`,
  };

  s3.listObjects(listObjectsParams, (err, data) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(data.Contents.map((content) => `http://99.79.46.146/api/images/${content.Key.slice(0, -4)}`)));
    response.end();
  });
}

module.exports = {
  readOneImage,
  getProjectImagesUrls,
};
