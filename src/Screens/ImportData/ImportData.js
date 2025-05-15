import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  MenuItem,
  Select,
  Pagination,
  Tooltip,
  CircularProgress,
  Paper,
  IconButton,
  Divider,
  Badge,
  Chip,
  Button,
  Card,
} from "@mui/material";
import Header from "../../Component/Header";
import Left from "../../Component/Left";
import {
  ModernCard,
  CardTitle,
  TableContainer,
  ActionButton,
  StyledChip,
  StyledSearchInput,
  StyledSelect,
  commonStyles,
  ValueDate,
} from "../../Component/Style";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SortIcon from "@mui/icons-material/Sort";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ImportData = () => {
  const [show, setShow] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Lấy dữ liệu từ API
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/v1/importOrders/getAll`)
      .then(function (response) {
        console.log(response.data);
        setOrders(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể lấy dữ liệu đơn nhập. Vui lòng thử lại sau.",
          icon: "error",
        });
      });
  }, []);

  // Xử lý lọc dữ liệu
  const filteredOrders = orders && Array.isArray(orders) ? orders.filter(order => {
    if (!searchTerm) return true;
    
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.supplier && order.supplier.name && 
       order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  }) : [];

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Xử lý xem chi tiết đơn nhập
  const handleViewDetail = (id) => {
    navigate(`/ImportOrderData/${id}`);
  };

  // Xử lý tạo đơn nhập mới
  const handleCreateNew = () => {
    navigate("/ImportOrder");
  };

  // Xuất Excel
  const handleExportExcel = () => {
    Swal.fire({
      title: "Đang xử lý",
      text: "Đang chuẩn bị file Excel...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Giả lập việc xuất Excel
    setTimeout(() => {
      Swal.fire({
        title: "Thành công",
        text: "Đã xuất dữ liệu thành công",
        icon: "success",
      });
    }, 1500);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Left />
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: "#f8f9fa", 
          p: 3,
          minHeight: '100vh',
        }}
      >
        <Header text="Quản lý đơn nhập" show={show} setShow={setShow} />
        
        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600 }}>
          Quản lý đơn nhập
        </Typography>
        
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          {/* Thanh công cụ trên cùng */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid #eee',
            flexWrap: 'wrap',
            gap: 2
          }}>
            {/* Ô tìm kiếm bên trái */}
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <StyledSearchInput
                size="small"
                fullWidth
                placeholder="Tìm kiếm theo ID hoặc nhà cung cấp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Các nút chức năng bên phải */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<CalendarMonthIcon />}
                sx={{ borderRadius: 1, textTransform: 'none' }}
              >
                Lọc ngày
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<SortIcon />}
                sx={{ borderRadius: 1, textTransform: 'none' }}
              >
                Sắp xếp
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportExcel}
                sx={{ borderRadius: 1, textTransform: 'none' }}
              >
                Xuất Excel
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                sx={{ borderRadius: 1, textTransform: 'none' }}
              >
                Làm mới
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                sx={{ borderRadius: 1, textTransform: 'none' }}
              >
                Tạo đơn nhập
              </Button>
            </Box>
          </Box>
          
          {/* Bảng dữ liệu */}
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Người lập</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Nhà cung cấp</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Ngày lập</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : !filteredOrders || filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography sx={{ py: 3 }}>Không tìm thấy dữ liệu phù hợp</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      hover
                      sx={{ 
                        cursor: 'pointer', 
                        '&:hover': {
                          bgcolor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                      onClick={() => handleViewDetail(order.id)}
                    >
                      <TableCell sx={{ fontWeight: "500", color: '#1976d2' }}>{order.id}</TableCell>
                      <TableCell>
                        {order.employee ? `${order.employee.lastName} ${order.employee.firstName}` : "N/A"}
                      </TableCell>
                      <TableCell>{order.supplier ? order.supplier.name : "N/A"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonthIcon sx={{ fontSize: 16, mr: 1, color: '#757575' }} />
                          <ValueDate value={order.date} />
                        </Box>
                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(order.id);
                          }}
                          sx={{ borderRadius: 4, textTransform: 'none' }}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Phân trang */}
          {!loading && filteredOrders && filteredOrders.length > 0 && (
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              p: 2, 
              borderTop: '1px solid #eee' 
            }}>
              <Typography variant="body2" color="text.secondary">
                Hiển thị {(page - 1) * rowsPerPage + 1}-
                {Math.min(page * rowsPerPage, filteredOrders.length)} trong số {filteredOrders.length} đơn nhập
              </Typography>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, newPage) => setPage(newPage)}
                  color="primary"
                  size="small"
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Dòng mỗi trang:
                  </Typography>
                  <Select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(e.target.value);
                      setPage(1);
                    }}
                    size="small"
                    sx={{ minWidth: 65, height: 30 }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default ImportData;
