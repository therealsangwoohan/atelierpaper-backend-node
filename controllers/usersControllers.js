const formidable = require('formidable');
const { pool } = require('../database/pool');
const { deleteFolderOfImages } = require('../storage/s3');
const { getCurrentUserId } = require('../utilities/auth');

async function createOneUser(request, response) {
  const form = formidable({ multiples: true });
  form.parse(request, async (err, fields) => {
    try {
      if (fields.specialPermission !== process.env.SPECIAL_PERMISSION) {
        response.statusCode = 400;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify({ error_message: "You don't have the permission to create an account." }));
        response.end();
        return;
      }

      const result = await pool.query(`INSERT INTO users (email, password, last_name, first_name, phone_number) VALUES ('${fields.email}', '${fields.password}', '${fields.last_name}', '${fields.first_name}', '${fields.phone_number}') RETURNING user_id`);

      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.write(JSON.stringify({ user_id: result.rows[0].user_id }));
      response.end();
    // TODO: Be more explicit on the type of error.
    } catch (error) {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'application/json');
      response.write(JSON.stringify({ error_message: 'There exists a user with the same email and/or password.' }));
      response.end();
    }
  });
}

async function readAllUsers(request, response) {
  const results = await pool.query('SELECT user_id, email, last_name, first_name, phone_number FROM users');
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify(results.rows));
  response.end();
}

async function readOneUser(request, response, user_id) {
  const results = await pool.query(`SELECT email, last_name, first_name, phone_number FROM users WHERE user_id='${user_id}'`);

  if (results.rowCount === 0) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ error_message: `There isn't a user with user_id=${user_id}` }));
    response.end();
    return;
  }

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify(results.rows[0]));
  response.end();
}

async function deleteOneUser(request, response) {
  // Auth.
  const currentUserId = await getCurrentUserId(request.headers.cookie);
  if (currentUserId === undefined) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ error_message: 'You are not logged in.' }));
    response.end();
    return;
  }

  // Delete folders of images.
  const projects = (await pool.query(`SELECT * FROM projects WHERE user_id='${currentUserId}'`)).rows;
  for (const project of projects) {
    deleteFolderOfImages(project.project_id);
  }

  // Delete user.
  await pool.query(`DELETE FROM users WHERE user_id='${currentUserId}'`);

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Set-Cookie', 'session_id=deleted; path=/; max-age=-1');
  response.write(JSON.stringify({ success_message: `user with user_id=${currentUserId} has been deleted.` }));
  response.end();
}

module.exports = {
  createOneUser,
  readAllUsers,
  readOneUser,
  deleteOneUser,
};
