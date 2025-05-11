import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";

import { useState } from "react";
import Header from "../../Component/Header";
import Left from "../../Component/Left";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { ValueDate } from "../../Component/Style";
const ImportData = () => {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  useEffect(() => {
    axios
      .get(`/api/v1/importOrders/getAll`)
      .then(function (response) {
        console.log(response.data);
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "employee", headerName: "Người lập", flex: 1 },
    { field: "supplier", headerName: "Nhà cung cấp", flex: 1 },
    {
      field: "date",
      headerName: "Ngày lập",
      flex: 1,
      renderCell: (params) => <ValueDate {...params} />,
    },
  ];
  const handleOnCellClick = (params) => {
    // navigate(`/CheckOut/${params.id}`);
    window.open(`/DoAnTotNghiep/#/ImportOrderData/${params.id}`, "_blank");
  };

  const datatable = () => {
    if (Array.isArray(data) && data.length !== 0) {
      return (
        <Box height="80vh" width="99%">
          <DataGrid
            rowHeight={50}
            density="comfortable"
            rows={data.map((item) => ({
              id: item.id,
              employee: item.employee.lastName + " " + item.employee.firstName,
              date: item.date,
              supplier: item.supplier.name,
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
              ...data.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                csvOptions: {
                  fields: [
                    "id",
                    "category",
                    "brand",
                    "name",
                    "description",
                    "price",
                    "importPrice",
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
            <Box sx={{ padding: "5px 5px 5px" }}>
              <Typography variant="h4">Quản lý đơn nhập</Typography>
            </Box>

            {datatable()}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default ImportData;
