const { pool } = require('../database/pool');
const { parseCookie } = require('./cookieParser');

async function getCurrentUserId(cookie) {
  const { session_id } = parseCookie(cookie);
  const results = await pool.query(`SELECT * FROM sessions WHERE session_id='${session_id}'`);

  if (results.rowCount === 0) {
    return undefined;
  }

  return results.rows[0].user_id.toString();
}

module.exports = {
  getCurrentUserId,
};
