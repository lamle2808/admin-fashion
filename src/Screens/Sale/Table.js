import { Box, CircularProgress, Chip, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import axios from "axios";

const Table = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    axios
      .get("api/v1/products/getAll")
      .then(function (response) {
        setData(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerClassName: "header-theme",
    },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      flex: 1,
      minWidth: 200,
      headerClassName: "header-theme",
    },
    {
      field: "category",
      headerName: "Loại",
      flex: 0.5,
      minWidth: 120,
      headerClassName: "header-theme",
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          sx={{ 
            backgroundColor: "#e3f2fd", 
            color: "#2c6fbf",
            fontWeight: 500
          }}
        />
      ),
    },
    {
      field: "quantity",
      headerName: "Khuyến mãi",
      width: 130,
      headerClassName: "header-theme",
      renderCell: (params) => (
        params.value === "Chưa có" ? (
          <Chip 
            label="Chưa áp dụng" 
            size="small"
            color="success"
            variant="outlined"
          />
        ) : (
          <Tooltip title="Sản phẩm đã được áp dụng khuyến mãi">
            <Chip 
              label={`ID: ${params.value}`} 
              size="small"
              color="primary"
            />
          </Tooltip>
        )
      ),
    },
    {
      field: "price",
      headerName: "Giá",
      width: 130,
      headerClassName: "header-theme",
      renderCell: (params) => (
        <div style={{ fontWeight: 500 }}>
          {params.row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫
        </div>
      ),
    },
  ];

  const handleSelect = (e) => {
    const orderDetails = Object.values(e).map((item) => {
      return {
        enable: 1,
        product: {
          id: item,
        },
      };
    });
    props.setSelect(orderDetails);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          width: "100%",
          borderBottom: "1px solid #edf2f7",
          padding: "8px 16px",
        }}
      >
        <GridToolbarColumnsButton 
          sx={{ color: "#2c6fbf" }}
        />
        <GridToolbarFilterButton 
          sx={{ color: "#2c6fbf" }}
        />
        <GridToolbarDensitySelector 
          sx={{ color: "#2c6fbf" }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter 
          sx={{ 
            "& .MuiInputBase-root": {
              borderRadius: "8px",
            },
          }}
        />
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      {loading ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          localeText={{
            toolbarColumns: "Cột",
            toolbarDensity: "Khoảng cách",
            toolbarFilters: "Lọc",
            toolbarQuickFilterPlaceholder: "Tìm kiếm...",
            noRowsLabel: "Không có dữ liệu",
          }}
          rows={
            data.map((item) => ({
              id: item.id,
              name: item.productName,
              quantity: item.sale === null ? "Chưa có" : item.sale.id,
              category: item.category.categoryName,
              price: item.price,
            })) || []
          }
          isRowSelectable={(params) => params.row.quantity === "Chưa có"}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          columns={columns}
          onRowSelectionModelChange={handleSelect}
          autoHeight
          disableColumnFilter
          disableColumnMenu
          hideFooterSelectedRowCount
          sx={{
            height: "100%",
            border: "none",
            "& .MuiDataGrid-row": {
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f5f9ff",
              },
              "&.Mui-selected": {
                backgroundColor: "#e3f2fd",
                "&:hover": {
                  backgroundColor: "#d0e8fd",
                },
              }
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
      )}
    </Box>
  );
};

export default Table;
