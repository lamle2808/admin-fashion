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
import { ValueDateKM } from "../../Component/Style";
import Left from "../../Component/Left";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SaleDB() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/api/v1/sales/getAll`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleOnCellClick = (params) => {
    navigate(`/SaleDetail/${params.id}`);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "discount",
      headerName: "Khuyến mãi (%)",
      flex: 1,
    },
    {
      field: "start",
      headerName: "Ngày bắt đầu",
      flex: 1,
      renderCell: (params) => <ValueDateKM {...params} />,
    },
    {
      field: "end",
      headerName: "Ngày kết thúc",
      flex: 1,
      renderCell: (params) => <ValueDateKM {...params} />,
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
            checkboxSelection
            rowHeight={50}
            rows={data.map((item) => ({
              id: item.id,
              discount: item.discount,
              start: item.start,
              end: item.end,
              product: item.product,
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
            onRowSelectionModelChange={(id, status) => {
              console.log(id);
            }}
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
              <Typography variant="h4">Danh sách khuyến mãi</Typography>
            </Box>

            {datatable()}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default SaleDB;
