import {
  Box,
  Button,
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
import { BoxBtn, GridBox, SaleDis } from "./Style";
import { StatusCheck } from "../../Component/data";
import Swal from "sweetalert2";
function InvoiceDetails() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [sum, setSum] = useState("");
  const idO = useParams();
  const userId = localStorage.getItem("id");

  useEffect(() => {
    axios
      .get(`/api/v1/orders/getOrderById/${idO.id}`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setSum(
          res.data.orderDetails.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
          )
        );
      })
      .catch((error) => console.log(error));
  }, [idO.id]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },

    {
      field: "name",
      headerName: "Tên sản phẩm",
      flex: 1,
    },
    {
      field: "loHang",
      headerName: "Lô hàng",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      flex: 0.5,
    },
    {
      field: "sale",
      headerName: "Mã khuyến mãi",
      flex: 0.5,
    },
    {
      field: "price",
      headerName: "Giá",
      renderCell: (params) => <SaleDis value={params.row} />,
      flex: 0.5,
    },
  ];
  const checkS = (value) => {
    if (value === "1") {
      return "Đang xử lý ";
    } else if (value === "2") {
      return "Đang vận chuyển";
    } else if (value === "3") {
      return "Hoàn thành";
    } else {
      return "Đã hủy";
    }
  };

  const handleSuccess = () => {
    const stt = StatusCheck(data.statusOrder);
    axios
      .post(`/api/v1/orders/updateStatus/${userId}`, [
        {
          statusOrder: stt,
          id: idO.id,
        },
      ])
      .then(function (response) {
        Swal.fire({
          title: "Thành công",
          icon: "success",
        });
        axios
          .get(`/api/v1/orders/getOrderById/${idO.id}`)
          .then((res) => {
            setData(res.data);
          })
          .catch((error) => console.log(error));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleError = () => {
    Swal.fire({
      title: "Điền lý do hủy",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      reverseButtons: "true",
      cancelButtonText: "Hủy",
      preConfirm: async (login) => {
        const stt = "0" + login;

        if (login !== "") {
          axios
            .post(`/api/v1/orders/updateStatus/${userId}`, [
              {
                statusOrder: stt,
                id: idO.id,
              },
            ])
            .then(function (response) {
              Swal.fire({
                title: "Thành công",
                icon: "success",
              });
              axios
                .get(`/api/v1/orders/getOrderById/${idO.id}`)
                .then((res) => {
                  setData(res.data);
                })
                .catch((error) => console.log(error));
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          Swal.fire({
            title: "Vui lòng điền lý do",
            icon: "error",
          });
        }
      },
    });
  };

  const BoxNav = () => {
    if (data.statusOrder.charAt(0) === "0") {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BoxBtn sx={{ display: "block", paddingLeft: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Lý do
            </Typography>
            <Typography>{data.statusOrder.substring(1)}</Typography>
          </BoxBtn>
        </Box>
      );
    } else if (data.statusOrder !== "3") {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BoxBtn gap={10}>
            <Button variant="contained" color="error" onClick={handleError}>
              Hủy đơn hàng
            </Button>
            <Button variant="contained" color="success" onClick={handleSuccess}>
              {data.statusOrder === "2" ? "Hoàn thành" : "Giao hàng"}
            </Button>
          </BoxBtn>
        </Box>
      );
    }
  };

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
            >{`Hóa đơn ${idO.id}`}</Typography>

            <Grid
              container
              sx={{
                justifyContent: "space-between",
                padding: 3,
              }}
            >
              <GridBox
                item
                md={3}
                sx={{
                  paddingLeft: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textDecoration: "underline" }}
                >
                  Thông tin khách hàng
                </Typography>
                <Typography variant="body1">
                  Họ và tên:
                  {" " + data.customer.lastName + " " + data.customer.firstName}
                </Typography>
                <Typography variant="body1">
                  Email: {data.customer.email}
                </Typography>
                <Typography variant="body1">
                  SDT: {data.customer.phone}
                </Typography>
                <Typography variant="body1">
                  Địa chỉ: {data.customer.address}
                </Typography>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Ghi chú
                  </Typography>
                  <Typography>{data.note || "Không có"}</Typography>
                </Box>
              </GridBox>

              {data.statusOrder !== "1" ? (
                <GridBox item md={3} sx={{ paddingLeft: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Nhân viên
                  </Typography>
                  <Typography variant="body1">
                    ID: {data.employee.id || "Id"}
                  </Typography>
                  <Typography variant="body1">
                    Tên:{" "}
                    {data.employee !== ""
                      ? data.employee.lastName + " " + data.employee.firstName
                      : "Tên"}
                  </Typography>
                  <Typography variant="body1">
                    SDT: {data.employee !== "" ? data.employee.phone : "Email"}
                  </Typography>
                  <Typography variant="body1">
                    Email:{" "}
                    {data.employee !== "" ? data.employee.email : "Email"}
                  </Typography>
                </GridBox>
              ) : null}
              <GridBox
                item
                md={3}
                sx={{
                  paddingLeft: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textDecoration: "underline" }}
                >
                  Thông tin đơn
                </Typography>
                <Stack direction={"row"}>
                  <Typography variant="body1"> Trạng thái: </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    {checkS(data.statusOrder)}
                  </Typography>
                </Stack>
                <Typography variant="body1">
                  Phương thức: {data.paymentType}
                </Typography>
                <Stack direction={"row"}>
                  <Typography variant="body1">Thanh toán: </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    {data.statusPayment === 1
                      ? " Đã thanh toán"
                      : "Chưa thanh toán"}
                  </Typography>
                </Stack>
                <Typography variant="body1">
                  Tổng hóa đơn:{" "}
                  {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </Typography>
                <Typography variant="body1">
                  Ngày lập: {ValueDate2(data.date)}
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
                rows={data.orderDetails.map((item) => ({
                  id: item.id,
                  name: item.product.productName,
                  quantity: item.quantity,
                  price: item.product.price,
                  sale: item.saleId || "Không có",
                  loHang: item.loHangId,
                }))}
                columns={columns}
                sx={{ flex: 1, backgroundColor: "white", height: "42vh" }}
                hideFooter
              />
            ) : (
              <></>
            )}
            <BoxNav />
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

export default InvoiceDetails;
