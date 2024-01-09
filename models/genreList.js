const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "genreList.json" //Danh sách các thể loại film đang có và id tương ứng
);
//đọc file

const genreList = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};
module.exports = genreList;
