import { Box, Button, InputBase, Stack, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { NoteDiv } from "../../Component/Style";
import Table from "./Table";
import axios from "axios";
import Swal from "sweetalert2";
import TableChoose from "./TableChoose";
import ModalUser from "./ModalUser";

const CreateBill = () => {
  const [show, setShow] = useState(true);
  const [select, setSelect] = useState("");
  const [customer, setCustomer] = useState(" ");
  const [customerD, setCustomerD] = useState("");
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const id = localStorage.getItem("id");

  const handleFind = () => {
    if (customer !== "") {
      axios
        .get(`/api/v1/customer/getByPhoneOrEmail/${customer}`)
        .then(function (response) {
          console.log(response.data);
          setCustomerD(response.data);
        })
        .catch(function (error) {
          if (error.response.status === 400) {
            setOpen(true);
          } else {
            Swal.fire("Lỗi", "Lỗi", "error");
          }
        });
    } else {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

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
    console.log(orderData);
    axios
      .post(`/api/v1/orders/createNow`, orderData)
      .then(function (response) {
        setCustomer("");
        setCustomerD("");
        setSelect("");
        setNote("");
        Swal.fire({
          title: "Thành công",
          icon: "success",
        });
      })
      .catch(function (error) {
        Swal.fire({
          title: "Lỗi",
          text: "Hết hàng trong lô",
          icon: "error",
        });
      });
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
              paddingLeft: 2,
              paddingRight: 2,
            }}
          >
            <Stack direction={"row"} spacing={5}>
              <Box
                sx={{
                  flex: 1,
                  border: "1px solid black",
                  padding: 2,
                  borderRadius: 5,
                  backgroundColor: "#E3EFFD",
                }}
              >
                <form noValidate onSubmit={handleSubmit} autoComplete="true">
                  <Stack
                    direction={"row"}
                    spacing={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <NoteDiv>
                      <InputBase
                        sx={{ ml: 2, width: "90%" }}
                        fullWidth
                        placeholder="Thông tin khách hàng"
                        onChange={(e) => setCustomer(e.target.value)}
                      />
                    </NoteDiv>
                    <Button
                      variant="contained"
                      sx={{ width: 120, height: 42 }}
                      onClick={handleFind}
                    >
                      Tìm
                    </Button>
                  </Stack>

                  <Stack
                    sx={{
                      marginTop: 2,
                      gap: 1,
                      border: "1px solid black",
                      padding: "10px 10px 10px 30px",
                      borderRadius: 5,
                      backgroundColor: "white",
                    }}
                  >
                    <Typography variant="body1">
                      Họ tên:
                      {customerD.lastName || ""} {customerD.firstName || ""}
                    </Typography>
                    <Stack direction="row" gap={5}>
                      <Typography variant="body1">
                        Email: {customerD.email || ""}
                      </Typography>
                      <Typography variant="body1">
                        SDT: {customerD.phone}
                      </Typography>
                    </Stack>
                    <Typography>Địa chỉ: {customerD.address || ""}</Typography>
                  </Stack>

                  {select !== "" ? (
                    <Box sx={{ marginTop: 2 }}>
                      <TableChoose setSelect={setSelect} select={select} />
                    </Box>
                  ) : (
                    <></>
                  )}
                  <Box sx={{ marginTop: 2 }}>
                    <NoteDiv>
                      <InputBase
                        sx={{
                          ml: 2,
                          width: "90%",
                        }}
                        fullWidth
                        placeholder="Ghi chú ...."
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </NoteDiv>
                  </Box>
                  <Stack
                    direction="row"
                    spacing={10}
                    style={{
                      justifyContent: "center",
                      textAlign: "center",
                      marginTop: 20,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: 150 }}
                    >
                      Tạo
                    </Button>
                  </Stack>
                </form>
              </Box>
              <Box sx={{ flex: 1.5, marginTop: 2 }}>
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
