const { v4 } = require('uuid');
const formidable = require('formidable');
const { pool } = require('../database/pool');
const { getCurrentUserId } = require('../utilities/auth');

async function readOneSession(request, response) {
  const currentUserId = await getCurrentUserId(request.headers.cookie);
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify({ currentUserId }));
  response.end();
}

async function createOneSession(request, response) {
  const form = formidable({ multiples: true });
  form.parse(request, async (err, fields) => {

    const results = await pool.query(`SELECT * FROM users WHERE email='${fields.email}' AND password='${fields.password}'`);
    if (results.rowCount === 0) {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'application/json');
      response.write(JSON.stringify({ error_message: 'Wrong email and/or password.' }));
      response.end();
      return;
    }

    const session_id = v4();
    const { user_id } = results.rows[0];
    await pool.query(`INSERT INTO sessions (session_id, user_id) VALUES ('${session_id}', '${user_id}')`);

    response.statusCode = 200;
    response.setHeader('Set-Cookie', `session_id=${session_id}; Path=/`);
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ success_message: `session ${session_id} has been created.` }));
    response.end();
  });
}

async function deleteOneSession(request, response) {
  const currentUserId = await getCurrentUserId(request.headers.cookie);
  if (currentUserId === undefined) {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify({ error_message: 'You are not logged in.' }));
    response.end();
    return;
  }

  await pool.query(`DELETE FROM sessions WHERE user_id='${currentUserId}'`);

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Set-Cookie', 'session_id=deleted; path=/; max-age=-1');
  response.write(JSON.stringify({ success_message: `session with user_id=${currentUserId} has been deleted.` }));
  response.end();
}

module.exports = {
  readOneSession,
  createOneSession,
  deleteOneSession,
};
