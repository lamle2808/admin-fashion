import { Box } from "@mui/material";
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
  const [data, setData] = useState("");
  // const a = props.select.map((item) => {
  //   return item.product.id;
  // });

  useEffect(() => {
    axios
      .get("api/v1/products/getAll")
      .then(function (response) {
        // setData(response.data.filter((item) => item.sale !== null));
        // setData(response.data.filter((row) => !a.includes(row.id)));

        setData(
          response.data.map((item) => ({
            id:
              item.id +
              "\\" +
              item.productName +
              "\\" +
              (item.sale ? item.sale.id : ""),
            name: item.productName,
            quantity: item.sale === null ? "Chưa có" : item.sale.id,
            category: item.category.categoryName,
            price: item.price,
          }))
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const columns = [
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
      field: "quantity",
      headerName: "Khuyến mãi",
    },
    {
      field: "price",
      headerName: "Giá",
      renderCell: (params) => (
        <div>
          {params.row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
        </div>
      ),
    },
  ];

  const handleSelect = (e) => {
    const orderDetails = Object.values(e).map((item) => {
      const itemDetails = item.split("\\");
      return {
        enable: 1,
        product: {
          id: itemDetails[0],
          name: itemDetails[1],
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

          justifyContent: "space-around",
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      sx={{
        height: "90vh",
        width: "100%",
        borderRadius: 5,
        // backgroundColor: "#fad9b3",
      }}
    >
      {data !== "" ? (
        <DataGrid
          rowHeight={100}
          localeText={{
            toolbarColumns: "Cột",
            toolbarDensity: "Khoảng cách",
            toolbarFilters: "Lọc",
          }}
          rows={data || []}
          slots={{
            toolbar: CustomToolbar,
          }}
          checkboxSelection
          columns={columns}
          onRowSelectionModelChange={(id) => {
            handleSelect(id);
          }}
          initialState={{
            ...data.initialState,
          }}
          isRowSelectable={(params) => params.row.quantity === "Chưa có"}
          getRowHeight={() => "auto"}
          sx={{
            borderRadius: 5,

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
  );
};

export default Table;
