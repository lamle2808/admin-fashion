import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import Header from "../../Component/Header";
import Left from "../../Component/Left";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect } from "react";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import InventoryIcon from "@mui/icons-material/Inventory";
import ModalProduct from "./ModalProduct";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [show, setShow] = useState(true);
  const [modalP, setModalP] = useState(false);
  const [tags, setTags] = useState("");
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/v1/products/getAll")
      .then(function (response) {
        setTags(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleOnCellClick = (params) => {
    setModalP(!modalP);
    setValue(params.row.id);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
    },
    { field: "quantity", headerName: "Tồn kho", flex: 0.5 },
    { field: "category", headerName: "Loại", flex: 0.5 },
    { field: "brand", headerName: "Thương hiệu", flex: 0.5 },
    {
      field: "loHang",
      headerName: "Trạng thái",
      flex: 0.5,
      renderCell: (params) => (
        <div>{params.row.loHang ? params.row.loHang.id : "Chưa mở bán"}</div>
      ),
    },
    {
      field: "price",
      headerName: "Giá",
      flex: 0.5,
      renderCell: (params) => (
        <div>
          {params.row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
          VND
        </div>
      ),
    },

    {
      field: "actions",
      headerName: "Chức năng",
      type: "actions",
      flex: 0.8,
      getActions: (params) => {
        let actions = [
          <Tooltip title="Sửa thông tin" placement="left">
            <IconButton
              onClick={() => navigate(`/ProductEdit/${params.id}`)}
              color="primary"
            >
              <DriveFileRenameOutlineIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip title="Nhập hàng" placement="left">
            <IconButton
              onClick={() => navigate("/ImportOrder")}
              color="success"
            >
              <InventoryIcon />
            </IconButton>
          </Tooltip>
        ];

        return actions;
      },
    },
  ];

  const datatable = () => {
    if (Array.isArray(tags) && tags.length !== 0) {
      return (
        <Box height="80vh" width="99%">
          <DataGrid
            rowHeight={50}
            rows={tags.map((item) => ({
              id: item.id,
              name: item.productName,

              category: item.category.categoryName,
              brand: item.brand.name,
              quantity: item.quantity,
              price: item.price,
              loHang: item.loHang,
            }))}
            localeText={{
              toolbarColumns: "Cột",
              toolbarDensity: "Khoảng cách",
              toolbarFilters: "Lọc",
              toolbarExport: "Xuất ",
            }}
            columns={columns}
            pageSizeOptions={[10, 50, 100]}
            initialState={{
              ...tags.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                csvOptions: {
                  fields: [
                    "id",
                    "name",
                    "category",
                    "brand",
                    "price",
                    "description",
                  ],
                  utf8WithBom: true,
                  fileName: "Table-Product-Data",
                },
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            onCellDoubleClick={handleOnCellClick}
            getRowHeight={() => "auto"}
            sx={{
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: 1,
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "8px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "10px",
              },
            }}
          />
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%" }}>
      {value !== "" ? (
        <ModalProduct setModal={setModalP} modal={modalP} value={value} />
      ) : (
        <></>
      )}
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%", minWidth: "70%" }}>
          <Header setShow={setShow} show={show} />
          <Box
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "5px 5px 15px" }}>
              <Typography variant="h4">Quản lý sản phẩm</Typography>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<InventoryIcon />}
                onClick={() => navigate("/ImportOrder")}
              >
                Tạo phiếu nhập hàng
              </Button>
            </Box>
            
            <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
              <Alert severity="info" sx={{ mb: 1 }}>
                <strong>Lưu ý về quản lý tồn kho:</strong> Số lượng tồn kho của sản phẩm được quản lý thông qua phiếu nhập hàng.
              </Alert>
              <Typography variant="body2">
                1. Để chỉnh sửa thông tin cơ bản của sản phẩm (tên, mô tả, giá, thông số kỹ thuật), nhấn vào biểu tượng <DriveFileRenameOutlineIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />.
              </Typography>
              <Typography variant="body2">
                2. Để nhập thêm hàng hoặc cập nhật số lượng tồn kho của sản phẩm, nhấn vào biểu tượng <InventoryIcon fontSize="small" sx={{ verticalAlign: 'middle' }} /> hoặc nhấn nút "Tạo phiếu nhập hàng".
              </Typography>
            </Paper>

            {datatable()}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Product;
