import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  styled,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import { StylePaper, FormButton } from "../../Component/Style";
import axios from "axios";
import Swal from "sweetalert2";

const StyledTextField = styled(TextField)(() => ({
  backgroundColor: "white",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#81C3FF",
      borderWidth: "1px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2c6fbf",
      borderWidth: "2px",
    }
  }
}));

export default function Table({ setSelect, select }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Tải dữ liệu sản phẩm từ server
    loadProductData();
  }, []);

  const loadProductData = () => {
    setLoading(true);
    axios
      .get("/api/v1/products/getAll")
      .then(function (response) {
        console.log("Dữ liệu sản phẩm:", response.data);
        // Đảm bảo dữ liệu trả về là mảng hợp lệ
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error("Dữ liệu sản phẩm không phải là mảng:", response.data);
          setData([]);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể tải danh sách sản phẩm",
          icon: "error",
        });
        setData([]);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity >= 1) {
      const existingItem = select !== "" ? select : [];
      const existingProduct = existingItem.find(
        (item) => item.product.id === selectedItem.product.id
      );

      if (existingProduct) {
        const updatedItems = existingItem.map((item) =>
          item.product.id === selectedItem.product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        setSelect(updatedItems);
      } else {
        setSelect([...existingItem, { ...selectedItem, quantity }]);
      }
      setQuantity(1);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      headerClassName: "header-theme",
    },
    {
      field: "productName",
      headerName: "Tên sản phẩm",
      flex: 1,
      minWidth: 200,
      headerClassName: "header-theme",
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      width: 120,
      headerClassName: "header-theme",
    },
    {
      field: "price",
      headerName: "Giá",
      width: 150,
      valueFormatter: (params) => {
        return params.value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
      },
      headerClassName: "header-theme",
    },
    {
      field: "actions",
      headerName: "Thêm vào đơn",
      width: 150,
      sortable: false,
      headerClassName: "header-theme",
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedItem({
              product: {
                id: params.row.id,
                productName: params.row.productName,
                price: params.row.price,
              },
              loHang: {
                id: params.row.loHangId || 1, // Giá trị mặc định nếu không có
              },
            });
          }}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            backgroundColor: "#81C3FF",
            "&:hover": {
              backgroundColor: "#2c6fbf",
            },
          }}
        >
          Chọn
        </Button>
      ),
    },
  ];

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = data.filter((item) => {
    if (filter === "") {
      return true;
    } else {
      return (
        item.productName &&
        item.productName.toLowerCase().includes(filter.toLowerCase())
      );
    }
  });

  // Chuyển đổi dữ liệu cho DataGrid
  const rows = filteredData.map((item) => ({
    id: item.id,
    productName: item.productName,
    quantity: item.quantity || 0,
    price: item.price || 0,
    loHangId: item.loHang?.id || 1,
  }));

  return (
    <StylePaper
      sx={{
        padding: 3,
        borderRadius: 3,
        backgroundColor: "#F8FAFC",
        height: "85vh"
      }}
    >
      <Typography 
        variant="h5" 
        fontWeight="600" 
        color="#2c6fbf" 
        mb={3}
        sx={{
          position: 'relative',
          display: 'inline-block',
          "&:after": {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, #81C3FF, #2c6fbf)',
            borderRadius: '10px'
          }
        }}
      >
        Danh sách sản phẩm
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <StyledTextField 
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm sản phẩm..."
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <StylePaper 
        sx={{ 
          height: 'calc(100% - 220px)', 
          overflow: 'hidden',
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          display: 'flex',
          justifyContent: loading ? 'center' : 'normal',
          alignItems: loading ? 'center' : 'normal',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50, 100]}
            disableSelectionOnClick
            sx={{
              border: "none",
              "& .header-theme": {
                backgroundColor: "#f1f9ff",
                color: "#2c6fbf",
                fontWeight: 600
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none"
              }
            }}
          />
        )}
      </StylePaper>

      {selectedItem.product ? (
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 3,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#2c6fbf">
            Thêm sản phẩm vào đơn
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography fontWeight="500">
              {selectedItem.product.productName}
            </Typography>
            <Typography color="text.secondary">
              {selectedItem.product.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
              VND
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <StyledTextField
              type="number"
              label="Số lượng"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              inputProps={{ min: 1 }}
              error={quantity > selectedItem.product.quantity}
              helperText={quantity > selectedItem.product.quantity ? "Vượt quá số lượng tồn kho" : ""}
              sx={{ width: 150 }}
            />
            <FormButton 
              type="submit"
              disabled={quantity > selectedItem.product.quantity}
            >
              Thêm vào đơn
            </FormButton>
          </Stack>
        </Paper>
      ) : null}
    </StylePaper>
  );
}
