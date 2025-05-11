import { Box, CircularProgress, Stack, Typography, Button, InputAdornment, TextField } from "@mui/material";
import Header from "../../Component/Header";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { ValueDateKM, StylePaper } from "../../Component/Style";
import Left from "../../Component/Left";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TuneIcon from "@mui/icons-material/Tune";
import GetAppIcon from "@mui/icons-material/GetApp";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddIcon from "@mui/icons-material/Add";

function SaleDB() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`/api/v1/sales/getAll`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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
        String(item.id).includes(searchTermLower) ||
        String(item.discount).includes(searchTermLower) ||
        (item.description && item.description.toLowerCase().includes(searchTermLower))
      );
    });
  }, [data, searchTerm]);

  const handleOnCellClick = (params) => {
    navigate(`/SaleDetail/${params.id}`);
  };

  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      width: 80,
      headerClassName: "header-theme",
    },
    {
      field: "discount",
      headerName: "Khuyến mãi (%)",
      flex: 1,
      minWidth: 150,
      headerClassName: "header-theme",
    },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 1,
      minWidth: 200,
      headerClassName: "header-theme",
    },
    {
      field: "start",
      headerName: "Ngày bắt đầu",
      flex: 1,
      minWidth: 180,
      headerClassName: "header-theme",
      renderCell: (params) => <ValueDateKM value={params.value} />,
    },
    {
      field: "end",
      headerName: "Ngày kết thúc",
      flex: 1,
      minWidth: 180,
      headerClassName: "header-theme",
      renderCell: (params) => <ValueDateKM value={params.value} />,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      headerClassName: "header-theme",
      renderCell: (params) => {
        const now = new Date();
        const startDate = new Date(params.row.start);
        const endDate = new Date(params.row.end);
        
        if (now < startDate) {
          return (
            <Box
              sx={{
                backgroundColor: "#FFA72620",
                color: "#FFA726",
                fontWeight: "600",
                padding: "6px 12px",
                borderRadius: "16px",
                display: "inline-block",
                fontSize: "0.875rem",
                border: "1px solid #FFA72640",
              }}
            >
              Sắp diễn ra
            </Box>
          );
        } else if (now >= startDate && now <= endDate) {
          return (
            <Box
              sx={{
                backgroundColor: "#66BB6A20",
                color: "#66BB6A",
                fontWeight: "600",
                padding: "6px 12px",
                borderRadius: "16px",
                display: "inline-block",
                fontSize: "0.875rem",
                border: "1px solid #66BB6A40",
              }}
            >
              Đang áp dụng
            </Box>
          );
        } else {
          return (
            <Box
              sx={{
                backgroundColor: "#75757520",
                color: "#757575",
                fontWeight: "600",
                padding: "6px 12px",
                borderRadius: "16px",
                display: "inline-block",
                fontSize: "0.875rem",
                border: "1px solid #75757540",
              }}
            >
              Đã kết thúc
            </Box>
          );
        }
      },
    },
  ];

  function CustomToolbar() {
    return (
      <Stack direction="row" spacing={2} justifyContent="space-between" width="100%" p={1}>
        <Stack direction="row" spacing={2}>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/Sale')}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              backgroundColor: "#81C3FF",
              "&:hover": {
                backgroundColor: "#2c6fbf",
              },
            }}
          >
            Thêm khuyến mãi
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
    <Box sx={{ justifyContent: "center" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%", minWidth: "70%" }}>
          <Header show={show} setShow={setShow} />
          <Box
            bgcolor={"#EEF5FD"}
            sx={{
              height: "91vh",
              paddingLeft: 3,
              paddingRight: 3,
              paddingTop: 2,
              paddingBottom: 3,
            }}
          >
            <Typography variant="h5" fontWeight="600" color="#2c6fbf" mb={3}>
              Danh sách khuyến mãi
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
                      discount: item.discount || "",
                      description: item.description || "",
                      start: item.start || "",
                      end: item.end || "",
                      product: item.product || [],
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
                      navigate(`/SaleDetail/${params.id}`);
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

export default SaleDB;
