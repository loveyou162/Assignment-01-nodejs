const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "userToken.json" //Danh sách người dùng và Token tương ứng.
);
//đọc file
const userToken = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};
module.exports = userToken;
