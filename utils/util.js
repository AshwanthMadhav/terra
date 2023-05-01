const path = require("path");

const extractFileInfo = (fileName) => {
  return path.extname(fileName).toLowerCase();
};

module.exports = { extractFileInfo };
