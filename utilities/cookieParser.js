function parseCookie(str) {
  const strs = str.split(', ');
  const result = {};
  for (let i = 0; i < strs.length; i += 1) {
    const cur = strs[i].split('=');
    result[cur[0]] = cur[1];
  }
  return result;
}

module.exports = {
  parseCookie,
};
