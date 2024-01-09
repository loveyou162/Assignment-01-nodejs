const express = require("express");
const router = express.Router();
const userTokenData = require("../data/userToken.json");
const movieController = require("../controller/movie");

router.get("/trending", authentication, movieController.getMovieTrending);

router.get("/top-rate", authentication, movieController.getMovieTopRate);

router.get("/discover", authentication, movieController.getMovieGenre);

// router.post("/video/:film_id", movieController.postMovieTrailer);
router.get("/video", authentication, movieController.getMovieTrailer);

router.post("/search", authentication, movieController.postMovieSearch);

function authentication(req, res, next) {
  const tokenHeader = req.headers["authorization"];
  console.log(20, tokenHeader);
  const token = tokenHeader.split(" ")[1];
  console.log(22, token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token is missing" });
  }
  //kiểm tra xem token có tồn tại trong danh sách userToken không
  const user = userTokenData.find((user) => user.token === token);
  console.log(28, user);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
  req.user = user;
  next();
}

module.exports = router;
