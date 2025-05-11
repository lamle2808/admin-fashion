import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import { useState } from "react";

import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ValueDate2 } from "../../Component/Style";
import { GridBox, StackNav } from "../InvoiceDetails/Style";

function ImportDetail() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [sum, setSum] = useState("");
  const id = useParams();

  useEffect(() => {
    axios
      .get(`/api/v1/importOrders/getById/${id.id}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setSum(
          res.data.importOrderDetail.reduce(
            (acc, item) => acc + item.importPrice * item.quantity,
            0
          )
        );
      })
      .catch((error) => console.log(error));
  }, [id.id]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },

    {
      field: "name",
      headerName: "Tên sản phẩm",
      flex: 1,
    },
    { field: "loHang", headerName: "Lô Hàng", flex: 0.5 },
    {
      field: "loai",
      headerName: "Loại",
      flex: 0.5,
    },
    {
      field: "brand",
      headerName: "Hãng",
      flex: 0.5,
    },

    {
      field: "quantity",
      headerName: "Số lượng",
      flex: 0.5,
    },
    {
      field: "price",
      headerName: "Giá nhập",
      flex: 0.5,
    },
  ];

  const checkData = () => {
    if (data !== "") {
      return (
        <Paper
          sx={{
            flex: 1,
            mx: "auto",
            width: "97%",
            p: 1,
            backgroundColor: "#E3EFFD",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ textAlign: "center" }}
            >{`Phiếu nhập ${id.id}`}</Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <StackNav direction={"row"}>
                <Typography variant="subtitle1">
                  Tổng giá trị:{" "}
                  {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND
                </Typography>
                <Typography variant="subtitle1">
                  Ngày lập: {ValueDate2(data.date)}
                </Typography>
              </StackNav>
            </Box>
            <Grid
              container
              sx={{
                justifyContent: "space-between",
                padding: 3,
              }}
            >
              <GridBox
                item
                md={4}
                sx={{
                  paddingLeft: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textDecoration: "underline" }}
                >
                  Thông tin nhân viên
                </Typography>
                <Typography variant="body1">
                  {data.employee.lastName + " " + data.employee.firstName}
                </Typography>
                <Typography variant="body1">{data.employee.email}</Typography>
                <Typography variant="body1">{data.employee.phone}</Typography>
              </GridBox>
              <GridBox item md={4} sx={{ paddingRight: 2 }}>
                <Typography
                  variant="h6"
                  align="right"
                  sx={{ fontWeight: "bold", textDecoration: "underline" }}
                >
                  Nhà cung cấp
                </Typography>
                <Typography variant="body1" align="right">
                  {data.supplier.name}
                </Typography>
                <Typography variant="body1" align="right">
                  {data.supplier.email}
                </Typography>
                <Typography align="right" variant="body1">
                  {data.supplier.phone}
                </Typography>
              </GridBox>
            </Grid>
            {data !== "" ? (
              <DataGrid
                localeText={{
                  toolbarColumns: "Cột",
                  toolbarDensity: "Khoảng cách",
                  toolbarFilters: "Lọc",
                  toolbarExport: "Xuất ",
                }}
                rows={data.importOrderDetail.map((item) => ({
                  id: item.id,
                  name: item.loHang.product.productName,
                  price: item.importPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                  quantity: item.quantity,
                  brand: item.loHang.product.brand.name,
                  loai: item.loHang.product.category.categoryName,
                  loHang: item.loHang.id,
                }))}
                columns={columns}
                sx={{ flex: 1, backgroundColor: "white" }}
                hideFooter
              />
            ) : (
              <></>
            )}
          </Box>
        </Paper>
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
    <Box sx={{ justifyContent: "center", minHeight: "100%", height: "100%" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%" }}>
          <Header setShow={setShow} show={show} />
          {checkData()}
        </Box>
      </Stack>
    </Box>
  );
}

export default ImportDetail;
