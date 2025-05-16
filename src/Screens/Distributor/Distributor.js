import React, { useEffect, useState } from 'react';
import {
  Box, 
  Button, 
  CircularProgress, 
  Stack, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  InputAdornment,
  TextField
} from '@mui/material';
import Header from '../../Component/Header';
import Left from '../../Component/Left';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TuneIcon from '@mui/icons-material/Tune';
import GetAppIcon from '@mui/icons-material/GetApp';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Swal from 'sweetalert2';
import axios from 'axios';
import { StylePaper, TextInputAd, FormButton } from '../../Component/Style';

function Distributor() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get('/api/v1/suppliers/getAll')
      .then(res => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: 'Bạn có chắc muốn xoá nhà phân phối này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/v1/suppliers/delete/${row.id}`);
          Swal.fire({
            title: 'Đã xoá!', 
            text: 'Nhà phân phối đã được xoá thành công.', 
            icon: 'success',
            confirmButtonColor: "#2c6fbf"
          });
          fetchData();
        } catch {
          Swal.fire('Lỗi', 'Không thể xoá nhà phân phối', 'error');
        }
      }
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter(item => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (item.name && item.name.toLowerCase().includes(searchTermLower)) ||
        (item.address && item.address.toLowerCase().includes(searchTermLower)) ||
        (item.phone && item.phone.toLowerCase().includes(searchTermLower)) ||
        (item.email && item.email.toLowerCase().includes(searchTermLower))
      );
    });
  }, [data, searchTerm]);

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      headerClassName: "header-theme",
    },
    { 
      field: 'name', 
      headerName: 'Tên nhà phân phối', 
      flex: 1, 
      minWidth: 180,
      headerClassName: "header-theme",
    },
    { 
      field: 'address', 
      headerName: 'Địa chỉ', 
      flex: 1, 
      minWidth: 200,
      headerClassName: "header-theme",
    },
    { 
      field: 'phone', 
      headerName: 'Số điện thoại', 
      width: 180,
      headerClassName: "header-theme",
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1, 
      minWidth: 200,
      headerClassName: "header-theme",
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 160,
      headerClassName: "header-theme",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button 
            size="small" 
            variant="outlined"
            startIcon={<EditIcon />} 
            onClick={() => { setEditRow(params.row); setModalEdit(true); }}
            sx={{
              borderRadius: "6px",
              borderColor: "#81C3FF",
              color: "#2c6fbf",
              "&:hover": {
                borderColor: "#2c6fbf",
                backgroundColor: "rgba(44, 111, 191, 0.1)",
              }
            }}
          >
            Sửa
          </Button>
          <Button 
            size="small" 
            color="error" 
            variant="outlined"
            startIcon={<DeleteIcon />} 
            onClick={() => handleDelete(params.row)}
            sx={{
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.1)",
              }
            }}
          >
            Xoá
          </Button>
        </Stack>
      )
    }
  ];

  function CustomToolbar() {
    return (
      <Stack direction="row" spacing={2} justifyContent="space-between" width="100%" p={1}>
        <Stack direction="row" spacing={2}>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            color="primary"
            onClick={() => setModal(true)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              backgroundColor: "#81C3FF",
              "&:hover": {
                backgroundColor: "#2c6fbf",
              },
            }}
          >
            Thêm nhà phân phối
          </Button>
          
          <Button 
            startIcon={<TuneIcon />} 
            variant="contained" 
            color="primary"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              backgroundColor: "#81C3FF",
              "&:hover": {
                backgroundColor: "#2c6fbf",
              },
            }}
          >
            Cột
          </Button>
          
          <Button 
            startIcon={<FilterAltIcon />}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              backgroundColor: "#81C3FF",
              "&:hover": {
                backgroundColor: "#2c6fbf",
              },
            }}
          >
            Lọc
          </Button>
          
          <Button 
            startIcon={<GetAppIcon />}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              backgroundColor: "#81C3FF",
              "&:hover": {
                backgroundColor: "#2c6fbf",
              },
            }}
          >
            Xuất
          </Button>
        </Stack>
        
        <TextField
          placeholder="Tìm kiếm..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "300px",
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Stack>
    );
  }

  function CustomPagination() {
    const totalPages = Math.ceil((filteredData?.length || 0) / pageSize);
    
    return (
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center" 
        justifyContent="flex-end" 
        p={1}
      >
        <Typography variant="body2">
          Rows per page: 
        </Typography>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          style={{ 
            padding: '4px 8px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            marginRight: '16px'
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        
        <Typography variant="body2">
          {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filteredData?.length || 0)} of {filteredData?.length || 0}
        </Typography>
        
        <Button 
          disabled={page === 0}
          onClick={() => setPage(p => Math.max(0, p - 1))}
          sx={{ minWidth: 0, p: 0.5 }}
        >
          <NavigateBeforeIcon />
        </Button>
        
        <Button 
          disabled={page >= Math.ceil((filteredData?.length || 0) / pageSize) - 1}
          onClick={() => setPage(p => p + 1)}
          sx={{ minWidth: 0, p: 0.5 }}
        >
          <NavigateNextIcon />
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ justifyContent: 'center' }}>
      <DistributorModal open={modal} onClose={() => setModal(false)} onSave={fetchData} />
      <DistributorModal open={modalEdit} onClose={() => setModalEdit(false)} onSave={fetchData} initialData={editRow} />
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: '100%', minWidth: '70%' }}>
          <Header show={show} setShow={setShow} />
          <Box
            bgcolor={'#EEF5FD'}
            sx={{
              height: '91vh',
              paddingLeft: 3,
              paddingRight: 3,
              paddingTop: 2,
              paddingBottom: 3,
            }}
          >
            <Typography variant="h5" fontWeight="600" color="#2c6fbf" mb={3}>
              Quản lý nhà phân phối
            </Typography>

            <StylePaper 
              sx={{ 
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    height: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Box width="100%">
                  <CustomToolbar />
                  
                  <DataGrid
                    rows={filteredData.map((item) => ({
                      id: item.id || "",
                      name: item.name || "",
                      address: item.address || "",
                      phone: item.phone || "",
                      email: item.email || "",
                    }))}
                    columns={columns}
                    page={page}
                    pageSize={pageSize}
                    loading={loading}
                    disableColumnFilter
                    disableColumnMenu
                    disableSelectionOnClick
                    autoHeight
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    components={{
                      Pagination: CustomPagination,
                    }}
                    onRowDoubleClick={(params) => { 
                      setEditRow(params.row); 
                      setModalEdit(true); 
                    }}
                    sx={{
                      border: 'none',
                      "& .MuiDataGrid-row": {
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f9ff",
                        },
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid #edf2f7",
                      },
                      "& .header-theme": {
                        backgroundColor: "#f1f9ff",
                        color: "#2c6fbf",
                        fontWeight: 600
                      },
                      "& .MuiDataGrid-columnHeaders": {
                        borderBottom: "none"
                      },
                    }}
                  />
                </Box>
              )}
            </StylePaper>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

function DistributorModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    if (initialData) {
      setForm({
        id: initialData.id || '',
        name: initialData.name || '', 
        address: initialData.address || '', 
        phone: initialData.phone || '', 
        email: initialData.email || ''
      });
    } else {
      setForm({ name: '', address: '', phone: '', email: '' });
    }
  }, [initialData, open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    setLoading(true);
    
    // Kiểm tra và làm sạch dữ liệu trước khi gửi
    const supplierData = {
      ...(form.id ? { id: form.id } : {}),
      name: form.name.trim(),
      address: form.address.trim(),
      email: form.email.trim(),
      phone: form.phone.trim()
    };
    
    console.log("Dữ liệu gửi đi:", supplierData);
    
    axios.post('/api/v1/suppliers/saveOrUpdate', supplierData)
      .then((response) => {
        console.log("Kết quả:", response.data);
        Swal.fire({
          title: 'Thành công', 
          text: initialData ? 'Đã cập nhật nhà phân phối' : 'Đã thêm nhà phân phối mới', 
          icon: 'success',
          confirmButtonColor: "#2c6fbf"
        });
        onClose();
        onSave();
      })
      .catch((error) => {
        console.log("Lỗi:", error);
        
        let errorMessage = 'Không thể lưu thông tin nhà phân phối';
        
        if (error.response && error.response.data) {
          console.log("Chi tiết lỗi:", error.response.data);
          if (typeof error.response.data === 'string') {
            // Hiển thị lỗi từ server nếu có
            errorMessage = error.response.data;
          }
        }
        
        Swal.fire({
          title: 'Lỗi', 
          text: errorMessage, 
          icon: 'error'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }
      }}
    >
      <DialogTitle 
        sx={{
          textAlign: "center",
          borderBottom: "1px solid #edf2f7",
          pb: 2,
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight="600" 
          color="#2c6fbf"
          sx={{
            position: 'relative',
            display: 'inline-block',
            mb: 1,
            "&:after": {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, #81C3FF, #2c6fbf)',
              borderRadius: '10px'
            }
          }}
        >
          {initialData ? 'Chỉnh sửa nhà phân phối' : 'Thêm nhà phân phối'}
        </Typography>
        {initialData && (
          <Typography variant="body2" color="text.secondary">
            Mã nhà phân phối: #{initialData.id}
          </Typography>
        )}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <TextInputAd
            label="Tên nhà phân phối"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextInputAd
            label="Địa chỉ"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextInputAd
            label="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextInputAd
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            type="email"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center" }}>
          <FormButton
            onClick={onClose}
            variant="contained"
            color="error"
          >
            Hủy
          </FormButton>
          <FormButton 
            type="submit" 
            variant="contained"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : (initialData ? "Cập nhật" : "Thêm mới")}
          </FormButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default Distributor; 