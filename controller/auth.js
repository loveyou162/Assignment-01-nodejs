const userTokenList = require("../models/userToken");
exports.HandleLogins = (req, res, next) => {
  const data = req.body;
  console.log(data);
  const userTokenAll = userTokenList.all();
  const user = userTokenAll.find(
    (user) => user.userId === data.username && user.password === data.password
  );
  const userToken = user.token;
  res.json({ userToken });
};
