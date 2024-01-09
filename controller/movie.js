const Movie = require("../models/Movies");
const GenreList = require("../models/genreList");
const VideoList = require("../models/videoList");
const Paging = require("../utils/paging");
//api trending
exports.getMovieTrending = (req, res, next) => {
  const allMovies = Movie.all();
  //sắp xếp theo trường popularity giảm dần
  const trendingMovies = allMovies.sort((a, b) => b.popularity - a.popularity);
  const [pageData, page, pageSize] = Paging.paging(trendingMovies, req);
  res.status(200).json({
    results: pageData,
    page: page,
    total_pages: trendingMovies.length / pageSize,
  });
};
//api top rate
exports.getMovieTopRate = (req, res, next) => {
  const allMovies = Movie.all();
  const topRateMovies = allMovies.sort(
    (a, b) => b.vote_average - a.vote_average
  );
  const [pageData, page, pageSize] = Paging.paging(topRateMovies, req);
  res.status(200).json({
    results: pageData,
    page: page,
    total_pages: topRateMovies.length / pageSize,
  });
};
//api phim theo thể loại
exports.getMovieGenre = (req, res, next) => {
  const genreId = req.query.genre;
  //kiểm tra đường dẫn nếu không có params genreId thì hiển thị lỗi
  if (!genreId) {
    return res.status(400).json({ message: "Not found genre param" });
  }
  const moviesAll = Movie.all();
  //Lọc các phần tử có genre_id chứa giá trị từ tham số genre
  const filteredMovies = moviesAll.filter((movie) =>
    movie.genre_ids.includes(parseInt(genreId))
  );
  //kiểm tra xem thể loại có tồn tại trong danh sách không
  if (filteredMovies.length === 0) {
    return res.status(404).json({ message: "Not found that genre id" });
  }
  const genreNameAll = GenreList.all();
  const genreName = genreNameAll.find(
    (genre) => genre.id === parseInt(genreId)
  ).name;
  const [pageData, page, pageSize] = Paging.paging(filteredMovies, req);
  res.status(200).json({
    results: pageData,
    page: page,
    total_pages: filteredMovies.length / pageSize,
    genre_name: genreName,
  });
};
//api lấy trailer phim
exports.getMovieTrailer = (req, res, next) => {
  const filmId = +req.query.filmid;
  console.log(filmId);
  // Kiểm tra xem người dùng đã cung cấp tham số film_id chưa
  if (!filmId) {
    return res.status(400).json({ message: "Not found film_id param" });
  }
  const videoAll = VideoList.all();
  // Tìm video phù hợp theo film_id
  const filteredVideos = videoAll
    .filter((item) => item.id === filmId)
    .flatMap((film) => film.videos)
    .filter((video) => {
      return (
        video.official === true &&
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser")
      );
    });

  // Kiểm tra xem có video phù hợp hay không
  if (filteredVideos.length === 0) {
    return res.status(404).json({ message: "Not found video" });
  }
  // // Sắp xếp theo thời gian published_at giảm dần
  filteredVideos.sort(
    (a, b) => new Date(b.published_at) - new Date(a.published_at)
  );

  res.status(200).json({
    results: filteredVideos,
  });
};
exports.postMovieSearch = (req, res, next) => {
  // Lấy các thông tin tìm kiếm từ request body
  const { name, genre, mediatype, language, year } = req.body.keyword;
  console.log(104, { name, genre, mediatype, language, year });

  // Lấy toàn bộ danh sách phim
  const allMovies = Movie.all();

  // Lọc phim theo từng điều kiện riêng lẻ (không phân biệt hoa thường)
  const filteredMovies = allMovies.filter((movie) => {
    // Chuyển đổi tiêu đề và mô tả thành chữ thường để so sánh không phân biệt hoa thường
    const titleLower = movie.title ? movie.title.toLowerCase() : "";
    const overviewLower = movie.overview ? movie.overview.toLowerCase() : "";

    // Kiểm tra điều kiện cho từng trường tìm kiếm
    let nameMatch = true;
    if (name) {
      nameMatch =
        titleLower.includes(name.toLowerCase()) ||
        overviewLower.includes(name.toLowerCase());
    }

    let genreMatch = true;
    if (genre) {
      // Kiểm tra xem genre_ids có chứa giá trị genre không
      genreMatch = movie.genre_ids ? movie.genre_ids.includes(+genre) : false;
    }

    let mediatypeMatch = true;
    if (mediatype) {
      // Kiểm tra xem media_type có khớp với giá trị mediatype không
      mediatypeMatch = movie.media_type
        ? movie.media_type.toLowerCase() === mediatype.toLowerCase()
        : false;
    }

    let languageMatch = true;
    if (language) {
      // Kiểm tra xem original_language có khớp với giá trị language không
      languageMatch = movie.original_language
        ? movie.original_language.toLowerCase() === language.toLowerCase()
        : false;
    }

    let yearMatch = true;
    if (year) {
      // Kiểm tra xem năm phát hành có khớp với giá trị year không
      yearMatch = movie.release_date
        ? movie.release_date.split("-")[0] === year
        : false;
    }

    // Trả về true nếu phim thỏa mãn tất cả các điều kiện
    return (
      nameMatch && genreMatch && mediatypeMatch && languageMatch && yearMatch
    );
  });

  // Kiểm tra xem có phim thỏa mãn hay không
  if (filteredMovies.length === 0) {
    return res.status(200).json({
      results: [],
      page: 1,
      total_pages: 0,
    });
  }

  // Sử dụng cơ chế phân trang
  const [pageData, page, pageSize] = Paging.paging(filteredMovies, req);

  // Trả về dữ liệu phim thỏa mãn theo định dạng Paging
  res.status(200).json({
    results: pageData,
    page: page,
    total_pages: Math.ceil(filteredMovies.length / pageSize),
  });
};
