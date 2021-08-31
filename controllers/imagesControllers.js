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
    console.log(err);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(data));
    response.end();
  });
}

module.exports = {
  readOneImage,
  getProjectImagesUrls,
};
