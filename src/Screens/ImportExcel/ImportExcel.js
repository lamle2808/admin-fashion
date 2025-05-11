import React, { useEffect } from "react";
import { useState } from "react";
import Header from "../../Component/Header";
import Left from "../../Component/Left";
import { Button, Stack, Box, Typography, TextField } from "@mui/material";
import { ExcelRenderer } from "react-excel-renderer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  ExpandableCell,
  TextInputAd,
  VisuallyHiddenInput,
} from "../../Component/Style";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import axios from "axios";
import ModalNcc from "../ImportOrder/ModalNcc";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Phanloai } from "../../Component/data";
function ImportExcel() {
  const [show, setShow] = useState(true);
  const [nccD, setNccD] = useState("");
  const [rows, setRows] = useState([]);
  const [ncc, setNcc] = useState("");
  const [open, setOpen] = useState(false);
  const userId = localStorage.getItem("id");
  const [brands, setBrands] = useState("");
  const [loais, setLoais] = useState("");
  const [file, setFile] = useState("");

  useEffect(() => {
    axios
      .get("/api/v1/brands/getAllBrand")
      .then(function (response) {
        setBrands(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get("/api/v1/category/getAll")
      .then(function (response) {
        setLoais(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const fileHandler = (event) => {
    setFile(event.target.files[0].name);
    const fileObj = event.target.files[0];
    if (!fileObj) {
      Swal.fire({
        title: "Không tìm thấy File",
        icon: "question",
      });
      return false;
    }
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileObj.type === "text/csv"
      )
    ) {
      Swal.fire({
        title: "Không đúng File",
        text: "Chỉ nhận file Excel",
        icon: "error",
      });
      return false;
    }
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = [];
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            newRows.push({
              key: index,
              id: index,
              productId: row[0],
              name: row[1],
              quantity: row[2],
              category: row[3],
              categoryId: row[3],
              brand: row[4],
              brandId: row[4],
              importPrice: row[5],
              price: row[6],
              description: row[7] || "",
            });
          }
          return null;
        });
        let typeMap = {};
        brands.forEach((item) => {
          typeMap[item.name] = item.id; // index + 1 để bắt đầu từ 1
        });
        newRows.forEach((item) => {
          if (typeMap[item.brandId]) {
            item.brandId = typeMap[item.brandId];
          }
        });
        let typeMap2 = {};
        loais.forEach((item) => {
          typeMap2[item.categoryName] = item.id; // index + 1 để bắt đầu từ 1
        });
        newRows.forEach((item) => {
          if (typeMap2[item.categoryId]) {
            item.categoryId = typeMap2[item.categoryId];
          }
        });

        if (newRows.length === 0) {
          Swal.fire({
            title: "Không tìm thấy dữ liệu",
            icon: "error",
          });
          return false;
        } else {
          setRows(newRows);
        }
      }
    });
    return false;
  };
  const handleFind = () => {
    if (ncc !== "") {
      axios
        .get(`/api/v1/suppliers/getByEmailOrPhone/${ncc}`)
        .then(function (response) {
          if (response.data !== `${ncc} not found!!`) {
            setNccD(response.data);
          } else {
            setOpen(!open);
            setNccD("");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      Swal.fire({
        title: "Vui lòng nhập thông tin",
        icon: "error",
      });
    }
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
    },
    { field: "quantity", headerName: "Số Lượng", flex: 0.5 },

    { field: "category", headerName: "Loại", flex: 0.5 },
    { field: "brand", headerName: "Thương hiệu", flex: 0.5 },
    { field: "importPrice", headerName: "Giá nhập", flex: 0.5 },
    { field: "price", headerName: "Giá bán", flex: 0.5 },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 2,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
  ];

  const handleSubmit = () => {
    console.log(rows);
    const importOrderDetail = rows.map((item) => {
      if (item.productId === undefined) {
        return {
          importPrice: item.importPrice,
          quantity: item.quantity,
          loHang: {
            product: {
              quantity: item.quantity,
              price: item.price,
              productName: item.name,
              category: {
                id: item.categoryId,
              },
              brand: {
                id: item.brandId,
              },
              description: item.description,
              specifications: Phanloai(item.categoryId),
            },
          },
        };
      } else {
        return {
          importPrice: item.price,
          quantity: item.quantity,
          loHang: {
            product: {
              quantity: item.quantity,
              id: item.productId,
            },
          },
        };
      }
    });

    axios
      .post(`/api/v1/importOrders/saveOrUpdate`, {
        supplier: {
          id: nccD.id,
        },
        employee: {
          id: userId,
        },
        importOrderDetail: importOrderDetail,
      })
      .then(function (response) {
        console.log(response.data);
        setFile("");
        setNccD("");
        setNcc("");
        setRows("");
        Swal.fire({
          title: "Thành công",
          icon: "success",
        });
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          title: "Lỗi",
          icon: "error",
        });
      });
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%" }}>
      <ModalNcc setModal={setOpen} modal={open} />
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%", minWidth: "70%" }}>
          <Header
            text={"Thêm phiếu nhập bằng Excel"}
            setShow={setShow}
            show={show}
          />
          <Box
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              backgroundColor: "#E3EFFD",
            }}
          >
            <Box>
              <Stack direction={"row"} gap={10} sx={{ paddingTop: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 5,
                    padding: 2,
                    border: "1px solid black",
                  }}
                >
                  <Stack
                    direction={"row"}
                    spacing={5}
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TextInputAd
                      label="Nhà cung cấp"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={ncc}
                      onChange={(e) => setNcc(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      sx={{ width: 120, height: 40 }}
                      onClick={handleFind}
                    >
                      Tìm
                    </Button>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    flex: 2,
                  }}
                >
                  <Stack
                    sx={{
                      gap: 1,
                      border: "1px solid black",
                      padding: "10px 10px 10px 30px",
                      borderRadius: 5,
                      backgroundColor: "white",
                    }}
                  >
                    <Typography variant="body1">
                      Tên: {nccD.name || ""}
                    </Typography>
                    <Stack direction="row" gap={5}>
                      <Typography variant="body1">
                        Email: {nccD.email || ""}
                      </Typography>
                      <Typography variant="body1">
                        SDT: {nccD.phone || ""}
                      </Typography>
                    </Stack>
                    <Typography>Địa chỉ: {nccD.address || ""}</Typography>
                  </Stack>
                </Box>
              </Stack>
              <Stack
                direction={"row"}
                sx={{
                  marginTop: 2,
                  backgroundColor: "white",
                  padding: 1,

                  borderRadius: 5,
                  flex: 1,
                }}
              >
                <TextField size="small" value={file} variant="outlined" />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                >
                  Thêm File
                  <VisuallyHiddenInput type="file" onChange={fileHandler} />
                </Button>
                <Button
                  sx={{ marginLeft: 5 }}
                  component="label"
                  variant="outlined"
                  startIcon={<AddCircleIcon />}
                  onClick={handleSubmit}
                >
                  Tạo Phiếu nhập
                </Button>
              </Stack>
            </Box>
            <Box
              height={490}
              width="99%"
              sx={{ marginTop: 2, backgroundColor: "white" }}
            >
              <DataGrid
                // density="comfortable"
                rowHeight={50}
                rows={rows || []}
                localeText={{
                  toolbarColumns: "Cột",
                  toolbarDensity: "Khoảng cách",
                  toolbarFilters: "Lọc",
                  toolbarExport: "Xuất ",
                }}
                columns={columns}
                pageSizeOptions={[10, 50, 100]}
                initialState={{
                  ...rows.initialState,
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
                        "description",
                        "price",
                      ],
                      utf8WithBom: true,
                      fileName: "Table-Product-Data",
                    },
                  },
                }}
                slots={{
                  toolbar: GridToolbar,
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
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default ImportExcel;
