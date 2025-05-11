import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Button,
  Checkbox,
  TextField,
  InputAdornment,
  Paper
} from "@mui/material";
import Header from "../../Component/Header";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TuneIcon from "@mui/icons-material/Tune";
import GetAppIcon from "@mui/icons-material/GetApp";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { CheckStatus, ValueDate, StylePaper } from "../../Component/Style";
import Left from "../../Component/Left";
import axios from "axios";

function CheckOut() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadInvoiceData();
  }, []);

  const loadInvoiceData = () => {
    setLoading(true);
    axios
      .get(`/api/v1/orders/getAllOrder`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        setLoading(false);
      });
  };

  const handleOnCellClick = (params) => {
    // navigate(`/CheckOut/${params.id}`);
    window.open(`/DoAnTotNghiep/#/CheckOut/${params.id}`, "_blank");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter(item => {
      const customerName = `${item.customer?.lastName || ""} ${item.customer?.firstName || ""}`.toLowerCase();
      const id = item.id?.toString().toLowerCase() || "";
      const query = searchTerm.toLowerCase();
      
      return customerName.includes(query) || id.includes(query);
    });
  }, [data, searchTerm]);

  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      width: 120,
      headerClassName: "header-theme",
    },
    {
      field: "name",
      headerName: "Người mua",
      flex: 1,
      minWidth: 180,
      headerClassName: "header-theme",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => <CheckStatus {...params} />,
      headerClassName: "header-theme",
    },
    {
      field: "date",
      headerName: "Ngày lập",
      width: 150,
      renderCell: (params) => <ValueDate {...params} />,
      headerClassName: "header-theme",
    },
  ];

  function CustomToolbar() {
    return (
      <Stack direction="row" spacing={2} justifyContent="space-between" width="100%" p={1}>
        <Stack direction="row" spacing={2}>
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
              Quản lý hóa đơn
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
                      id: item.id,
                      name: `${item.customer?.lastName || ""} ${item.customer?.firstName || ""}`,
                      status: item.statusOrder,
                      date: item.date,
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
                    onRowClick={handleOnCellClick}
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

export default CheckOut;
