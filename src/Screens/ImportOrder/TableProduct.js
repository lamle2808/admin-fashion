import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import axios from "axios";

function TableProduct(props) {
  const [data, setData] = useState("");
  useEffect(() => {
    axios
      .get("api/v1/products/getAll")
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
    },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      flex: 1,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
    },
    {
      field: "category",
      headerName: "Loại sản phẩm",
      flex: 0.5,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
    },
    {
      field: "brand",
      headerName: "Thương hiệu",
      flex: 0.5,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          width: "100%",
          justifyContent: "space-between",
          p: 1,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <GridToolbarColumnsButton sx={{ color: '#1976d2' }} />
          <GridToolbarFilterButton sx={{ color: '#1976d2' }} />
        </Box>
        <GridToolbarQuickFilter 
          sx={{ 
            width: '300px',
            '& .MuiInputBase-root': {
              borderRadius: '8px',
              backgroundColor: 'white'
            }
          }} 
          placeholder="Tìm kiếm sản phẩm..."
        />
      </GridToolbarContainer>
    );
  }

  const handlePick = (e) => {
    props.setBrand(e.row.brandId);
    props.setLoai(e.row.categoryId);
    props.setProduct(e.row.name);
    props.setProductId(e.row.id);
  };
  return (
    <Box
      sx={{
        height: "44vh",
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        border: "1px solid #e0e0e0",
      }}
    >
      {data && data.length > 0 ? (
        <DataGrid
          rowHeight={56}
          localeText={{
            toolbarColumns: "Cột",
            toolbarDensity: "Khoảng cách",
            toolbarFilters: "Lọc",
            noRowsLabel: "Không có dữ liệu",
            toolbarQuickFilterPlaceholder: "Tìm kiếm...",
          }}
          rows={data.map((item) => ({
            id: item.id,
            name: item.productName,
            category: item.category?.categoryName || "Chưa phân loại",
            brand: item.brand?.name || "Chưa có",
            brandId: item.brand?.id,
            categoryId: item.category?.id,
          }))}
          slots={{
            toolbar: CustomToolbar,
          }}
          onRowClick={(e) => handlePick(e)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          getRowHeight={() => "auto"}
          sx={{
            width: "100%",
            height: "100%",
            border: "none",
            '& .table-header': {
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 'bold',
              fontSize: '0.875rem',
            },
            '& .table-cell': {
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
              '&:nth-of-type(odd)': {
                backgroundColor: '#fafafa',
              },
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e0e0e0',
              padding: '8px 16px',
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: '2px solid #bbdefb',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #bbdefb',
            },
          }}
        />
      ) : (
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          p: 3
        }}>
          <Typography variant="body1" color="text.secondary">
            Đang tải dữ liệu sản phẩm...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default TableProduct;
