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
import { useNavigate } from "react-router-dom";
import { CheckStatus, FormButton, StylePaper } from "../../Component/Style";

function Employee() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const roleAcc = localStorage.getItem("asd");

  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/v1/employee/getAll`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleOnCellClick = (params) => {
    window.open(`/DoAnTotNghiep/#/Employee/${params.row.phone}`, "_blank");
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Họ và tên",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      renderCell: (params) => (
        <CheckStatus value={params.row.status ? "3" : "4"} />
      ),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
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
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid rgba(224, 224, 224, 1)",
          backgroundColor: "#f9fafb",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <GridToolbarQuickFilter sx={{ minWidth: 200 }} />
          
          {roleAcc === "123" && (
            <FormButton
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/CreateEmployee`)}
              sx={{ ml: 2 }}
            >
              Thêm nhân viên
            </FormButton>
          )}
        </Box>
      </GridToolbarContainer>
    );
  }
  
  const datatable = () => {
    if (loading) {
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
    
    if (Array.isArray(data) && data.length !== 0) {
      return (
        <StylePaper sx={{ height: "80vh", width: "100%" }}>
          <DataGrid
            localeText={{
              toolbarColumns: "Cột",
              toolbarDensity: "Khoảng cách",
              toolbarFilters: "Lọc",
              toolbarExport: "Xuất",
              toolbarQuickFilterPlaceholder: "Tìm kiếm...",
            }}
            rowHeight={55}
            rows={data.map((item) => ({
              id: item.id,
              name: item.lastName + " " + item.firstName,
              status: item.account?.enable || false,
              email: item.email,
              phone: item.phone,
            }))}
            density="comfortable"
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              ...data.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                csvOptions: {
                  fields: ["id", "name", "status", "email", "phone"],
                  utf8WithBom: true,
                  fileName: "DanhSachNhanVien",
                },
              },
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
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f9fafb",
                fontWeight: 600,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f5f9ff",
              },
              border: "none",
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              }
            }}
          />
        </StylePaper>
      );
    } else {
      return (
        <StylePaper
          sx={{
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Không có dữ liệu nhân viên
          </Typography>
        </StylePaper>
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
            bgcolor={"#EEF5FD"}
            sx={{
              height: "91vh",
              padding: 3,
              overflowY: "auto",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" fontWeight={600} color="#2c6fbf">
                Quản lý nhân viên
              </Typography>
            </Stack>

            {datatable()}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Employee;
