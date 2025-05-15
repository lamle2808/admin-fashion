import {
  Box,
  Button,
  InputBase,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { FormButton, StylePaper } from "../../Component/Style";
import Table from "./Table";
import axios from "axios";
import Swal from "sweetalert2";
import TableChoose from "./TableChoose";
import ModalUser from "./ModalUser";
import SearchIcon from "@mui/icons-material/Search";

const CreateBill = () => {
  const [show, setShow] = useState(true);
  const [select, setSelect] = useState("");
  const [customer, setCustomer] = useState("");
  const [customerD, setCustomerD] = useState("");
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const id = localStorage.getItem("id");

  const handleFind = () => {
    if (customer.trim() !== "") {
      setLoading(true);
      axios
        .get(`/api/v1/customer/getByPhoneOrEmail/${customer}`)
        .then(function (response) {
          console.log("Dữ liệu khách hàng:", response.data);
          setCustomerD(response.data);
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(false);
          if (error.response?.status === 400) {
            setOpen(true);
          } else {
            Swal.fire("Lỗi", "Lỗi khi tìm kiếm khách hàng", "error");
          }
        });
    } else {
      Swal.fire("Lỗi", "Vui lòng điền thông tin khách hàng", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerD || !customerD.id) {
      Swal.fire(
        "Lỗi",
        "Vui lòng tìm khách hàng trước khi tạo hóa đơn",
        "error"
      );
      return;
    }

    if (!select || select.length === 0) {
      Swal.fire("Lỗi", "Vui lòng chọn ít nhất một sản phẩm", "error");
      return;
    }

    // Kiểm tra tính hợp lệ của dữ liệu sản phẩm
    let hasInvalidProduct = false;
    select.forEach((item) => {
      if (!item.product || !item.product.id || !item.quantity) {
        hasInvalidProduct = true;
      }
    });

    if (hasInvalidProduct) {
      Swal.fire("Lỗi", "Có sản phẩm không hợp lệ trong đơn hàng", "error");
      return;
    }
    console.log(select);
    setLoading(true);
    const orderData = {
      note,
      customer: {
        id: customerD.id,
      },
      paymentType: "Mua ở cửa hàng",
      statusPayment: 1,
      statusOrder: "3",
      employee: { id: id },
      orderDetails: select.map((item) => ({
        quantity: item.quantity,
        product: {
          id: item.product.id,
        },
      })),
    };

    console.log("Dữ liệu gửi đi:", orderData);

    // axios
    //   .post(`/api/v1/orders/createNow`, orderData)
    //   .then(function (response) {
    //     setCustomer("");
    //     setCustomerD("");
    //     setSelect("");
    //     setNote("");
    //     setLoading(false);
    //     Swal.fire({
    //       title: "Thành công",
    //       text: "Đã tạo hóa đơn thành công",
    //       icon: "success",
    //     });
    //   })
    //   .catch(function (error) {
    //     setLoading(false);
    //     console.error("Lỗi tạo hóa đơn:", error);
    //     Swal.fire({
    //       title: "Lỗi",
    //       text: error.response?.data?.message || "Hết hàng trong lô",
    //       icon: "error",
    //     });
    //   });
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%", height: "100%" }}>
      <ModalUser setModal={setOpen} modal={open} />
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%" }}>
          <Header setShow={setShow} show={show} text="Thêm hóa đơn" />
          <Box
            sx={{
              paddingLeft: 3,
              paddingRight: 3,
              paddingTop: 2,
            }}
          >
            <Stack direction={"row"} spacing={5}>
              <StylePaper
                sx={{
                  flex: 1,
                  padding: 3,
                  borderRadius: 3,
                  backgroundColor: "#F8FAFC",
                  height: "fit-content",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color="#2c6fbf"
                  mb={3}
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      width: "60px",
                      height: "3px",
                      background: "linear-gradient(90deg, #81C3FF, #2c6fbf)",
                      borderRadius: "10px",
                    },
                  }}
                >
                  Thông tin hóa đơn
                </Typography>

                <form noValidate onSubmit={handleSubmit} autoComplete="true">
                  {/* Khung tìm kiếm khách hàng */}
                  <Stack
                    direction={"row"}
                    spacing={2}
                    sx={{
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <TextField
                      placeholder="Nhập số điện thoại hoặc email"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="primary" sx={{ opacity: 0.6 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                    <FormButton
                      variant="contained"
                      onClick={handleFind}
                      disabled={loading || !customer}
                      sx={{ minWidth: "80px" }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Tìm"
                      )}
                    </FormButton>
                  </Stack>

                  {/* Thông tin khách hàng */}
                  <StylePaper
                    sx={{
                      padding: 2,
                      borderRadius: 3,
                      backgroundColor: "white",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="#2c6fbf"
                      mb={2}
                    >
                      Thông tin khách hàng
                    </Typography>

                    {!customerD ? (
                      <Alert severity="info" sx={{ mb: 1 }}>
                        Vui lòng tìm kiếm khách hàng trước
                      </Alert>
                    ) : (
                      <>
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                          <span
                            style={{
                              fontWeight: 600,
                              minWidth: "80px",
                              display: "inline-block",
                            }}
                          >
                            Họ tên:
                          </span>
                          {`${customerD.lastName || ""} ${
                            customerD.firstName || ""
                          }`}
                        </Typography>

                        <Stack direction="row" spacing={4} sx={{ mb: 1.5 }}>
                          <Typography variant="body1">
                            <span
                              style={{
                                fontWeight: 600,
                                minWidth: "80px",
                                display: "inline-block",
                              }}
                            >
                              Email:
                            </span>
                            {customerD.email || ""}
                          </Typography>

                          <Typography variant="body1">
                            <span
                              style={{
                                fontWeight: 600,
                                minWidth: "60px",
                                display: "inline-block",
                              }}
                            >
                              SĐT:
                            </span>
                            {customerD.phone || ""}
                          </Typography>
                        </Stack>

                        <Typography variant="body1">
                          <span
                            style={{
                              fontWeight: 600,
                              minWidth: "80px",
                              display: "inline-block",
                            }}
                          >
                            Địa chỉ:
                          </span>
                          {customerD.address || ""}
                        </Typography>
                      </>
                    )}
                  </StylePaper>

                  {/* Bảng sản phẩm đã chọn */}
                  {select !== "" ? (
                    <Box sx={{ marginBottom: 3 }}>
                      <TableChoose setSelect={setSelect} select={select} />
                    </Box>
                  ) : null}

                  {/* Ghi chú */}
                  <TextField
                    fullWidth
                    multiline
                    placeholder="Ghi chú...."
                    variant="outlined"
                    minRows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />

                  {/* Nút tạo hóa đơn */}
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                      justifyContent: "center",
                    }}
                  >
                    <FormButton
                      type="submit"
                      disabled={
                        loading ||
                        !customerD ||
                        !select ||
                        (Array.isArray(select) && select.length === 0)
                      }
                      sx={{ minWidth: "150px" }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Tạo hóa đơn"
                      )}
                    </FormButton>
                  </Stack>
                </form>
              </StylePaper>

              {/* Khung danh sách sản phẩm */}
              <Box sx={{ flex: 1.5 }}>
                <Table setSelect={setSelect} select={select} />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default CreateBill;
