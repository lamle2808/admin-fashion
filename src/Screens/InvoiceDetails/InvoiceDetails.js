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
import { StylePaper, ValueDate2 } from "../../Component/Style";
import { BoxBtn, GridBox, InvoicePaper, SaleDis } from "./Style";
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
            (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
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
              sx={{ fontWeight: "bold", color: "#e44d4d", marginBottom: 1 }}
            >
              Lý do hủy đơn
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              {data.statusOrder.substring(1)}
            </Typography>
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
          <BoxBtn gap={3}>
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
        <InvoicePaper
          sx={{
            mx: "auto",
            width: "97%",
            p: 3,
          }}
        >
          <Box>
            <Typography variant="h4">{`Hóa đơn #${idO.id}`}</Typography>

            <Grid
              container
              spacing={3}
              sx={{
                justifyContent: "space-between",
                padding: 3,
              }}
            >
              <GridBox
                item
                md={3.8}
                sx={{
                  paddingLeft: 2,
                }}
              >
                <Typography
                  variant="h6"
                >
                  Thông tin khách hàng
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Họ và tên:</span>
                  {" " + (data.customer?.lastName || "") + " " + (data.customer?.firstName || "")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Email:</span> {data.customer?.email || ""}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>SDT:</span> {data.customer?.phone || ""}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Địa chỉ:</span> {data.customer?.address || ""}
                </Typography>
                <Box>
                  {data.statusOrder.charAt(0) === "0" ? (
                    <Typography
                      color="error"
                      sx={{
                        marginTop: 1,
                        fontWeight: "bold",
                      }}
                    >
                      Đã hủy
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        marginTop: 1,
                        fontWeight: "bold",
                        color: data.statusOrder === "3" ? "green" : "orange",
                      }}
                    >
                      {checkS(data.statusOrder)}
                    </Typography>
                  )}
                </Box>
              </GridBox>
              <GridBox
                item
                md={4}
                sx={{
                  paddingLeft: 2,
                }}
              >
                <Typography
                  variant="h6"
                >
                  Thông tin đơn hàng
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Ngày tạo:</span> {ValueDate2(data.createTime || new Date())}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Trạng thái thanh toán:</span>{" "}
                  {data.statusPayment === 1 ? "Đã thanh toán" : "Chưa thanh toán"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Phương thức thanh toán:</span>{" "}
                  {data.paymentType || ""}
                </Typography>
                {data.updateTime != null && data.statusOrder !== "0" ? (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <span style={{ fontWeight: 600 }}>Cập nhật lúc:</span>{" "}
                    {ValueDate2(data.updateTime)}
                  </Typography>
                ) : (
                  ""
                )}
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Ghi chú:</span> {data.note}
                </Typography>
              </GridBox>
              <GridBox
                item
                md={3.8}
                sx={{
                  paddingLeft: 2,
                }}
              >
                <Typography
                  variant="h6"
                >
                  Thông tin tổng đơn
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Tổng số lượng sản phẩm:</span>{" "}
                  {data.orderDetails?.length || 0}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 600 }}>Tổng tiền:</span>{" "}
                  {sum
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                  VND
                </Typography>
              </GridBox>
            </Grid>
            <StylePaper sx={{ mt: 2 }}>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={data.orderDetails?.map((item) => ({
                    id: item.id || 0,
                    name: item.product?.productName || "Không xác định",
                    loHang: item.loHang?.name || "Không có",
                    quantity: item.quantity || 0,
                    sale: item.product?.sale !== null ? item.product?.sale : "Không có",
                    price: item.product?.price || 0,
                  })) || []}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection={false}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                />
              </Box>
            </StylePaper>
          </Box>
          <BoxNav />
        </InvoicePaper>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
  };
  return (
    <>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%" }}>
          <Header setShow={setShow} show={show} text="Chi tiết hóa đơn" />
          <Box
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 2,
            }}
          >
            {checkData()}
          </Box>
        </Box>
      </Stack>
    </>
  );
}

export default InvoiceDetails;
