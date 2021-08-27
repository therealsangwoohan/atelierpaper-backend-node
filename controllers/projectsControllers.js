const formidable = require('formidable');
const { pool } = require('../database/pool');
const { uploadImage, deleteFolderOfImages } = require('../storage/s3');
const { getCurrentUserId } = require('../utilities/auth');

async function createOneProject(request, response) {
  const currentUserId = await getCurrentUserId(request.headers.cookie);
  if (currentUserId === undefined) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ error_message: 'You are not logged in.' }));
    response.end();
    return;
  }

  const form = formidable({ multiples: true });
  form.parse(request, async (err, fields, files) => {

    try {
      const result = await pool.query(`INSERT INTO projects (user_id, title, body) VALUES ('${currentUserId}', '${fields.title}', '${fields.body}') RETURNING project_id`);
      const { project_id } = result.rows[0];
      files.images.forEach((image, idx) => {
        uploadImage(image, project_id, idx);
      });

      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.write(JSON.stringify({ success_message: `project ${project_id} created.` }));
      response.end();
    } catch (error) {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'application/json');
      response.write(JSON.stringify({ error }));
      response.end();
    }
  });
}

async function readAllProjects(request, response) {
  try {
    const results = await pool.query('SELECT * FROM projects');
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(results.rows));
    response.end();
  } catch (error) {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(error));
    response.end();
  }
}

async function readOneProject(request, response, project_id) {
  const results = await pool.query(`SELECT * FROM projects WHERE project_id='${project_id}'`);

  if (results.rowCount === 0) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ error_message: `There isn't a project with project_id=${project_id}` }));
    response.end();
    return;
  }

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify(results.rows[0]));
  response.end();
}

async function deleteOneProject(request, response, project_id) {
  const currentUserId = await getCurrentUserId(request.headers.cookie);
  if (currentUserId === undefined) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ error_message: 'You are not logged in.' }));
    response.end();
    return;
  }
  const result = await pool.query(`DELETE FROM projects WHERE user_id='${currentUserId}' AND project_id='${project_id}'`);

  if (result.rowCount === 0) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ error_message: `You don't own project ${project_id}` }));
    response.end();
    return;
  }

  deleteFolderOfImages(project_id);

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify({ success_message: `project ${project_id} deleted.` }));
  response.end();
}

module.exports = {
  createOneProject,
  readAllProjects,
  readOneProject,
  deleteOneProject,
};
