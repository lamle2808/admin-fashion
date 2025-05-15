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
  FormControl,
  Select,
  MenuItem,
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
    },
  },
}));

export default function Table({ setSelect, select }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableColors, setAvailableColors] = useState("");
  const [availableSizes, setAvailableSizes] = useState("");
  const [availableStock, setAvailableStock] = useState("");
  const [postItem, setPostItem] = useState({});

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
          const filtered = response.data.filter((p) => p.loHang !== null);
          setData(filtered);
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
    console.log(select);
    if (quantity >= 1) {
      const existingItem = select !== "" ? select : [];
      const existingProduct = existingItem.find(
        (item) =>
          item.product.id === selectedItem.product.id &&
          item.specifications.id === selectedItem.specifications.id
      );
      if (existingProduct) {
        const updatedItems = existingItem.map((item) =>
          item.product.id === selectedItem.product.id &&
          item.specifications.id === selectedItem.specifications.id
            ? {
                ...item,
                specifications: {
                  ...item.specifications,
                  count: item.specifications.count + quantity,
                },
              }
            : item
        );
        setSelect(updatedItems);
      } else {
        setSelect([
          ...existingItem,
          {
            ...selectedItem,
            specifications: { ...selectedItem.specifications, count: quantity },
          },
        ]);
      }
      setQuantity(1);
    }
  };

  const handleSelectItem = (params) => {
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
    setPostItem({ specifications: params.row.productSpecifications });
    const sizes = [];
    const colors = [];
    let stock = 0;
    console.log(params);
    params.row.productSpecifications.forEach((spec) => {
      if (spec.size) {
        const size = spec.size.trim();
        sizes.push(size);
        stock += parseInt(spec.count) || 0;
        setAvailableStock(stock);
      }
      if (spec.color) {
        colors.push(spec.color.trim());
      }

      setAvailableSizes([...new Set(sizes)]);

      setAvailableColors([...new Set(colors)]);
    });
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
        return (
          params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
        );
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
            handleSelectItem(params);
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
    productSpecifications: item.productSpecifications,
  }));
  const handleColorbtn = (color) => {
    setSelectedColor(color);

    const matched = postItem.specifications.find(
      (spec) => spec.color === color && spec.size === selectedSize
    );

    if (matched) {
      setAvailableStock(matched.count);
      setSelectedItem({
        ...selectedItem,
        specifications: {
          ...selectedItem.specifications,
          id: matched.id,
          color: color,
          size: selectedSize,
        },
      });
    } else {
      setAvailableStock(0); // hoặc null nếu không tìm thấy
    }
  };
  const handleSizebtn = (size) => {
    setSelectedSize(size);
    const matched = postItem.specifications.find(
      (spec) => spec.size === size && spec.color === selectedColor
    );

    if (matched) {
      setAvailableStock(matched.count);
      console.log(size);
      setSelectedItem({
        ...selectedItem,
        specifications: {
          ...selectedItem.specifications,
          id: matched.id,
          size: size,
        },
      });
    } else {
      setAvailableStock(0); // hoặc null nếu không tìm thấy
    }
  };
  return (
    <StylePaper
      sx={{
        padding: 3,
        borderRadius: 3,
        backgroundColor: "#F8FAFC",
        height: "85vh",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="600"
        color="#2c6fbf"
        mb={3}
        sx={{
          position: "relative",
          display: "inline-block",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #81C3FF, #2c6fbf)",
            borderRadius: "10px",
          },
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
          height: "calc(100% - 220px)",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: loading ? "center" : "normal",
          alignItems: loading ? "center" : "normal",
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
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
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
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
          <Stack direction={"row"} gap={5}>
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="caption"
                sx={{ display: "block", mb: 0.5, color: "text.secondary" }}
              >
                Size
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedSize}
                  onChange={(e) => handleSizebtn(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Chọn size</em>
                  </MenuItem>
                  {availableSizes?.map((size, index) => (
                    <MenuItem key={index} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography
                variant="caption"
                sx={{ display: "block", mb: 0.5, color: "text.secondary" }}
              >
                Màu sắc
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedColor}
                  onChange={(e) => handleColorbtn(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Chọn màu</em>
                  </MenuItem>
                  {availableColors.map((color, index) => (
                    <MenuItem key={index} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
          <Stack direction={"row"} sx={{ alignItems: "center" }}>
            <StyledTextField
              type="number"
              label="Số lượng"
              variant="outlined"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 0))
              }
              inputProps={{ min: 1 }}
              error={quantity > availableStock}
              helperText={
                quantity > availableStock ? "Vượt quá số lượng tồn kho" : ""
              }
              sx={{ width: 150 }}
            />
            <Typography variant="h6" sx={{ paddingLeft: 20 }}>
              Số lượng còn trong kho: {availableStock}
            </Typography>
          </Stack>
          <FormButton type="submit" disabled={quantity > availableStock}>
            Thêm vào đơn
          </FormButton>
        </Paper>
      ) : null}
    </StylePaper>
  );
}
