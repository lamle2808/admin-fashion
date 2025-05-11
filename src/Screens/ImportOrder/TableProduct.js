import { Box } from "@mui/material";
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
      width: 50,
    },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Loại",
      flex: 0.5,
    },
    {
      field: "brand",
      headerName: "Hãng",
      flex: 0.5,
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />

        <GridToolbarQuickFilter />
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
        border: "1px solid black",
        backgroundColor: "#E3EFFD",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
      }}
    >
    
      <Box sx={{ height: "42vh", width: "95%" }}>
        {data && data.length > 0 && data ==="" ? (
          <DataGrid
            rowHeight={100}
            localeText={{
              toolbarColumns: "Cột",
              toolbarDensity: "Khoảng cách",
              toolbarFilters: "Lọc",
            }}
            rows={data.map((item) => ({
              id: item.id,
              name: item.productName,
              category: item.category.categoryName,
              brand: item.brand.name,
              brandId: item.brand.id,
              categoryId: item.category.id,
            })) }
            slots={{
              toolbar: CustomToolbar,
            }}
            isRowSelectable={(e) => handlePick(e)}
            columns={columns}
            initialState={{
              ...data.initialState,
            }}
            getRowHeight={() => "auto"}
            sx={{
              backgroundColor: "white",
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: 1,
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "10px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "16px",
              },
            }}
            hideFooter
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}

export default TableProduct;
