const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "videoList.json" //Danh sách các video tương ứng với các film hiện tại.
);

const videoList = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};
module.exports = videoList;
