export const Phanloai = (id) => {
  switch (id) {
    case 1:
      return dataLaptop;
    case 2:
      return dataKeyboard;
    case 3:
      return dataMouse;
    case 4:
      return dataMonitor;
    case 5:
      return dataSSD;
    case 6:
      return dataRAM;
    case 7:
      return dataCPU;
    case 8:
      return dataCase;
    case 9:
      return dataNguon;
    case 10:
      return dataLoa;
    case 11:
      return dataVGA;
    case 12:
      return dataMain;
    default:
      return "";
  }
};
export const StatusCheck = (id) => {
  switch (id) {
    case "1":
      return "2";
    case "2":
      return "3";
    default:
      return "";
  }
};

export const dataColumn = [
  { year: "2010", population: 2 },
  { year: "2011", population: 3 },
  { year: "2012", population: 8 },
  { year: "2013", population: 9 },
  { year: "2014", population: 10 },
  { year: "2015", population: 11 },
  { year: "2016", population: 6 },
];

export const energyConsumption = [
  {
    country: "2016",
    hydro: 30,
    oil: 15,
  },
  {
    country: "2015",
    hydro: 19,
    oil: 33,
  },
  {
    country: "2014",
    hydro: 10,
    oil: 20,
  },
  {
    country: "2013",
    hydro: 31,
    oil: 43,
  },
  {
    country: "2012",
    hydro: 23,
    oil: 30,
  },
  {
    country: "2011",
    hydro: 26,
    oil: 22,
  },
  {
    country: "2010",
    hydro: 35,
    oil: 31,
  },
];

export const dataLaptop = [
  { specificationName: "Loại card đồ họa", specificationValue: "" },
  { specificationName: "Loại CPU", specificationValue: "" },
  { specificationName: "Dung lượng RAM", specificationValue: "" },
  { specificationName: "Loại RAM", specificationValue: "" },
  { specificationName: "Số khe ram", specificationValue: "" },
  { specificationName: "Ổ cứng", specificationValue: "" },
  { specificationName: "Màn hình cảm ứng", specificationValue: "" },
  { specificationName: "Chất liệu tấm nền", specificationValue: "" },
  { specificationName: "Tần số quét", specificationValue: "" },
  { specificationName: "Kích thước màn hình", specificationValue: "" },
  { specificationName: "Công nghệ màn hình", specificationValue: "" },
  {
    specificationName: "Độ phân giải màn hình",
    specificationValue: "",
  },
  { specificationName: "Loại đèn bàn phím", specificationValue: "" },
  { specificationName: "Webcam", specificationValue: "" },
  { specificationName: "Hệ điều hành", specificationValue: "" },
  { specificationName: "Wi-Fi", specificationValue: "" },
  { specificationName: "Bluetooth", specificationValue: "" },
  { specificationName: "Công nghệ âm thanh", specificationValue: "" },
  { specificationName: "Bảo mật", specificationValue: "" },
  { specificationName: "Tính năng đặc biệt", specificationValue: "" },
  { specificationName: "Pin", specificationValue: "" },
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Trọng lượng", specificationValue: "" },
  { specificationName: "Cổng giao tiếp", specificationValue: "" },
];

export const dataKeyboard = [
  { specificationName: "Thiết kế", specificationValue: "" },
  { specificationName: "Kết nối", specificationValue: "" },
  { specificationName: "Keycap", specificationValue: "" },
  { specificationName: "Loại switch", specificationValue: "" },
  { specificationName: "Led", specificationValue: "" },
  { specificationName: "Hỗ trợ", specificationValue: "" },
  { specificationName: "Phụ kiện", specificationValue: "" },
  { specificationName: "Tương thích", specificationValue: "" },
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Trọng lượng", specificationValue: "" },
];
export const dataMonitor = [
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Tỷ lệ khung hình", specificationValue: "" },
  { specificationName: "Tấm nền", specificationValue: "" },
  { specificationName: "Góc nhìn", specificationValue: "" },
  { specificationName: "Độ phân giải", specificationValue: "" },
  { specificationName: "Độ sáng", specificationValue: "" },
  { specificationName: "Tỷ lệ tương phản tĩnh", specificationValue: "" },
  { specificationName: "Tỷ lệ tương phản động", specificationValue: "" },
  { specificationName: "Màu sắc hiển thị", specificationValue: "" },
  { specificationName: "Thời gian đáp ứng", specificationValue: "" },
  { specificationName: "Tần số quét", specificationValue: "" },
  {
    specificationName: "Cổng kết nối",
    specificationValue: "",
  },
  { specificationName: "Điện năng tiêu thụ", specificationValue: "" },
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Trọng lượng", specificationValue: "" },
];
export const dataMouse = [
  { specificationName: "Hãng sản xuất", specificationValue: "" },
  { specificationName: "Model", specificationValue: "" },
  { specificationName: "Màu", specificationValue: "" },
  {
    specificationName: "Tần suất gửi tín hiệu USB",
    specificationValue: "",
  },
  { specificationName: "Bộ vi xử lý", specificationValue: "" },
  { specificationName: "Chuyển động liên tục", specificationValue: "" },
  { specificationName: "Tương thích", specificationValue: "" },
  { specificationName: "Công nghệ không dây", specificationValue: "" },
  { specificationName: "Chân", specificationValue: "" },
  { specificationName: "Nút", specificationValue: "" },
  { specificationName: "Cảm biến", specificationValue: "" },
  {
    specificationName: "Độ phân giải",
    specificationValue: "",
  },
  { specificationName: "Tăng tốc tối đa", specificationValue: "" },
  { specificationName: "Tốc độ tối đa", specificationValue: "" },
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Trọng lượng", specificationValue: "" },
];
export const dataSSD = [
  { specificationName: "Thương hiệu", specificationValue: "" },
  { specificationName: "Bảo hành", specificationValue: "" },
  { specificationName: "Màu", specificationValue: "" },
  { specificationName: "Model", specificationValue: "" },
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Giao diện", specificationValue: "" },
  { specificationName: "Mức dung lượng", specificationValue: "" },
  { specificationName: "Đọc/ghi tuần tự", specificationValue: "" },
  { specificationName: "Độ bền", specificationValue: "" },
  { specificationName: "Nhiệt độ vận hành", specificationValue: "" },
  { specificationName: "Nhiệt độ bảo quản", specificationValue: "" },
  { specificationName: "Trọng lượng", specificationValue: "" },
];
export const dataRAM = [
  { specificationName: "Thương hiệu", specificationValue: "" },
  { specificationName: "Series", specificationValue: "" },
  { specificationName: "Màu sắc", specificationValue: "" },
  { specificationName: "Loại RAM", specificationValue: "" },
  { specificationName: "Dung lượng", specificationValue: "" },
  { specificationName: "Chuẩn Bus", specificationValue: "" },
  { specificationName: "Kiểu dáng", specificationValue: "" },
  { specificationName: "CAS", specificationValue: "" },
  { specificationName: "Đọ trễ", specificationValue: "" },
  { specificationName: "Kích thước", specificationValue: "" },
  {
    specificationName: "Khả năng tương thích hệ điều hành",
    specificationValue: "",
  },
  { specificationName: "Trọng lượng", specificationValue: "" },
];
export const dataCPU = [
  { specificationName: "Model", specificationValue: "" },
  { specificationName: "Số hiệu xử lý", specificationValue: "" },
  { specificationName: "Số nhân", specificationValue: "" },
  { specificationName: "Số luồng", specificationValue: "" },
  {
    specificationName: "Tốc độ của lõi hiệu năng",
    specificationValue: "",
  },
  {
    specificationName: "Tốc độ của lõi hiệu suất",
    specificationValue: "",
  },
  { specificationName: "Cache", specificationValue: "" },
  { specificationName: "Công suất cơ bản", specificationValue: "" },
  { specificationName: "Công suất tối đa", specificationValue: "" },
  { specificationName: "Socket", specificationValue: "" },
  { specificationName: "Băng thông tối đa", specificationValue: "" },
  {
    specificationName: "Phiên bản PCI Express",
    specificationValue: "",
  },
  { specificationName: "Cấu hình PCI Express", specificationValue: "" },
  {
    specificationName: "Số cổng PCI Express tối đa",
    specificationValue: "",
  },
  { specificationName: "Kích thước", specificationValue: "" },
];
export const dataCase = [
  { specificationName: "Thương hiệu", specificationValue: "" },
  { specificationName: "Tên sản phẩm", specificationValue: "" },
  { specificationName: "Kích cỡ case", specificationValue: "" },
  { specificationName: "Hỗ trợ mainboard", specificationValue: "" },
  { specificationName: "Màu sắc", specificationValue: "" },
  { specificationName: "Khoang chứa ổ cứng", specificationValue: "" },
  { specificationName: "Khe mở rộng", specificationValue: "" },
  {
    specificationName: "Độ cao tối đa tản khí CPU",
    specificationValue: "",
  },
  { specificationName: "Độ dài tối đa GPU", specificationValue: "" },
  {
    specificationName: "Độ dài tối đa nguồn PSU",
    specificationValue: "",
  },
  {
    specificationName: "Không gian quản lý cáp tối đa",
    specificationValue: "",
  },
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Trọng lượng", specificationValue: "" },
];
export const dataNguon = [
  { specificationName: "Thương hiệu", specificationValue: "" },
  { specificationName: "Công suất tối đa:", specificationValue: "" },
  { specificationName: "Số cổng cắm:", specificationValue: "" },
  { specificationName: "Hiệu suất:", specificationValue: "" },
  { specificationName: "Quạt làm mát:", specificationValue: "" },
  { specificationName: "Nguồn đầu vào:", specificationValue: "" },
  { specificationName: "Chứng nhận bảo vệ:", specificationValue: "" },
  { specificationName: "Hệ số công suất:", specificationValue: "" },
  { specificationName: "Kích thước chuẩn:", specificationValue: "" },
];
export const dataLoa = [
  { specificationName: "Hãng sản xuất", specificationValue: "" },
  { specificationName: "Thời lượng pin", specificationValue: "" },
  { specificationName: "Cổng sạc", specificationValue: "" },
  { specificationName: "Công suất", specificationValue: "" },
  { specificationName: "Cấu tạo", specificationValue: "" },
  { specificationName: "Tính năng khác", specificationValue: "" },
  { specificationName: "Bluetooth", specificationValue: "" },
  { specificationName: "Cổng kết nối", specificationValue: "" },
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Phạm vi kết nối", specificationValue: "" },
  { specificationName: "Trọng lượng", specificationValue: "" },
];
export const dataVGA = [
  { specificationName: "GPU:", specificationValue: "" },
  { specificationName: "Chuẩn Bus:", specificationValue: "" },
  { specificationName: "OpenGL:", specificationValue: "" },
  { specificationName: "Bộ nhớ:", specificationValue: "" },
  { specificationName: "Engine Clock:", specificationValue: "" },
  { specificationName: "Cổng kết nối:", specificationValue: "" },
  { specificationName: "Hiển thị tối đa:", specificationValue: "" },
  { specificationName: "Kích thước:", specificationValue: "" },
  { specificationName: "PSU đề nghị:", specificationValue: "" },
  { specificationName: "Đầu cấp nguồn:", specificationValue: "" },
  { specificationName: "Tản nhiệt:", specificationValue: "" },
];
export const dataMain = [
  { specificationName: "CPU", specificationValue: "" },
  { specificationName: "Chipset", specificationValue: "" },
  { specificationName: "RAM", specificationValue: "" },
  { specificationName: "Bộ nhớ:", specificationValue: "" },
  { specificationName: "Đổ họa tích hợp", specificationValue: "" },
  { specificationName: "Khe mở rộng", specificationValue: "" },
  { specificationName: "Lưu trữ", specificationValue: "" },
  { specificationName: "USB", specificationValue: "" },
  { specificationName: "LAN", specificationValue: "" },
  {
    specificationName: "KHÔNG DÂY / BLUETOOTH",
    specificationValue: "",
  },
  { specificationName: "Audio", specificationValue: "" },
  { specificationName: "Kết nối nội bộ", specificationValue: "" },
  {
    specificationName: "Cổng kết nối phía sau",
    specificationValue: "",
  },
  { specificationName: "Kích thước", specificationValue: "" },
  { specificationName: "Hệ điều hành", specificationValue: "" },
];
