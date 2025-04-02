import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import Header from "../../Component/Header";

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
import Left from "../../Component/Left";
import axios from "axios";

function Account() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get(`/api/v1/customer/getListCustomer`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleOnCellClick = (params) => {
    // navigate(`/Account/${params.id}`);

    window.open(`/DoAnTotNghiep/#/Account/${params.row.phone}`, "_blank");
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Khách hàng",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      renderCell: (params) => (
        <>{params.row.status === "" ? "Tạm khóa" : "Hoạt động"}</>
      ),
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "SDT",
      flex: 1,
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
        <GridToolbarDensitySelector />
        <GridToolbarExport />

        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  const datatable = () => {
    if (Array.isArray(data) && data.length !== 0) {
      return (
        <Box height="80vh" width="99%" bgcolor={"#ffffff"}>
          <DataGrid
            localeText={{
              toolbarColumns: "Cột",
              toolbarDensity: "Khoảng cách",
              toolbarFilters: "Lọc",
              toolbarExport: "Xuất",
            }}
            rowHeight={50}
            rows={data.map((item) => ({
              id: item.id,
              name: item.lastName + " " + item.firstName,
              status: item.account || "",
              email: item.email,
              phone: item.phone,
            }))}
            density="comfortable"
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
                  fields: ["tid", "name", "description"],
                  utf8WithBom: true,
                  fileName: "TableTagData",
                },
              },
            }}
            onRowSelectionModelChange={(id) => {}}
            slots={{
              toolbar: CustomToolbar,
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
    <Box sx={{ justifyContent: "center" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%", minWidth: "70%" }}>
          <Header show={show} setShow={setShow} />
          <Box
            bgcolor={"#E3EFFD"}
            sx={{
              height: "91vh",
              paddingLeft: 2,
              paddingRight: 2,
            }}
          >
            <Box sx={{ padding: "5px 5px 5px" }}>
              <Typography variant="h4">
                Danh sách tài khoản khách hàng
              </Typography>
            </Box>

            {datatable()}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Account;
