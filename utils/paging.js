module.exports = class Paging {
  static paging = (list, req) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20; //số lượng phần tử trên mỗi trang
    // Tính vị trí bắt đầu và kết thúc của các phần tử trên trang hiện tại
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    // Tạo một page dữ liệu từ danh sách trendingMovies
    const pageData = list.slice(startIndex, endIndex);
    return [pageData, page, pageSize];
  };
};
