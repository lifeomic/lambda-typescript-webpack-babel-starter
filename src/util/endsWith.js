// NOTE: This file is plain JavaScript to demonstrate how JavaScript
// and TypeScript can coexist.

module.exports = (str, search) => {
  if (str == null) {
    return false;
  }

  const len = str.length;
  return str.substring(len - search.length, len) === search;
};
