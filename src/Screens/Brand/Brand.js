import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
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
import AddIcon from "@mui/icons-material/Add";
import ModalBox from "./Add";
import ModalEdit from "./Edit";

function Brand() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [modal, setModal] = useState(false);
  const [modalE, setModalE] = useState(false);
  const [id, setId] = useState("");
  useEffect(() => {
    axios
      .get(`/api/v1/brands/getAllBrand`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Thương hiệu",
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "Tên công ty",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
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
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setModal(!modal)}
        >
          Thêm thương hiệu
        </Button>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />

        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  const handleOnCellClick = (params) => {
    setModalE(true);
    setId(params.row);
  };
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
              name: item.name,
              phone: item.phone || "",
              address: item.address || "",
              fullName: item.fullName || "",
            }))}
            onCellDoubleClick={handleOnCellClick}
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
                  fields: ["tid", "name"],
                  utf8WithBom: true,
                  fileName: "TableTagData",
                },
              },
            }}
            slots={{
              toolbar: CustomToolbar,
            }}
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
      <ModalBox setModal={setModal} modal={modal} setTags={setData} />
      <ModalEdit
        setModal={setModalE}
        modal={modalE}
        setTags={setData}
        id={id}
        setId={setId}
      />
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
              <Typography variant="h4">Quản lý thương hiệu</Typography>
            </Box>

            {datatable()}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Brand;
