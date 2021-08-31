const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Uploads an image to s3.
function uploadImage(image, project_id, idx) {
  fs.readFile(image.path, (err, imageBuffer) => {

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${project_id}/${idx}.png`,
      Body: imageBuffer,
    };
    s3.putObject(params, () => {});
  });
}

// Deletes a folder from s3.
function deleteFolderOfImages(project_id) {
  const listObjectsParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: `${project_id}/`,
  };
  s3.listObjects(listObjectsParams, (err, data) => {

    const deleteObjectsParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: { Objects: [] },
    };
    for (const content of data.Contents) {
      deleteObjectsParams.Delete.Objects.push({ Key: content.Key });
    }
    s3.deleteObjects(deleteObjectsParams, () => {});
  });
}

// Gets image stream from s3.
function getImageStream(project_id, idx) {
  return s3.getObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${project_id}/${idx}.png`,
  }).createReadStream();
}

module.exports = {
  s3,
  uploadImage,
  deleteFolderOfImages,
  getImageStream,
};
