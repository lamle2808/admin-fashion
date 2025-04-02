import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { TextInputAd } from "../../Component/Style";

import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const AccountDetail = () => {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [birth, setBirht] = useState("");
  const id = useParams();
  useEffect(() => {
    axios
      .get(`/api/v1/customer/getByPhoneOrEmail/${id.id}`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setBirht(format(new Date(res.data.dateOfBirth), "dd-MM-yyyy"));
      })
      .catch((error) => console.log(error));
  }, [id.id]);
  const handleChangle = () => {
    if (data.account.enable === false) {
      axios
        .post(`/api/v1/accounts/update`, {
          email: data.account.email,
          enable: true,
        })
        .then((res) => {
          axios
            .get(`/api/v1/customer/getByPhoneOrEmail/${id.id}`)
            .then((res) => {
              setData(res.data);
            })
            .catch((error) => console.log(error));
          Swal.fire({
            title: "Thành công",
            icon: "success",
          });
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post(`/api/v1/accounts/update`, {
          email: data.account.email,
          enable: false,
        })
        .then((res) => {
          axios
            .get(`/api/v1/customer/getByPhoneOrEmail/${id.id}`)
            .then((res) => {
              setData(res.data);
            })
            .catch((error) => console.log(error));
          Swal.fire({
            title: "Thành công",
            icon: "success",
          });
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%", height: "100%" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%" }}>
          <Header setShow={setShow} show={show} text="" />
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
                <Typography variant="h5">Thông tin cá nhân</Typography>
                <TextInputAd
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  value={data?.lastName + " " + data?.firstName}
                  disabled
                />
                <TextInputAd
                  label="Giới tính"
                  variant="outlined"
                  fullWidth
                  value={data.sex === 1 ? "Nam" : "Nữ"}
                  disabled
                />
                <TextInputAd
                  label="Ngày sinh"
                  variant="outlined"
                  fullWidth
                  value={birth}
                  disabled
                />
                <TextInputAd
                  label="Role"
                  variant="outlined"
                  fullWidth
                  value={
                    data.customerType === "customer"
                      ? "Khách hàng"
                      : "Khách vãng lai"
                  }
                  disabled
                />
                <TextInputAd
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  value={data.address || ""}
                  disabled
                />
                <TextInputAd
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={data.email || ""}
                  disabled
                />
                <TextInputAd
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  value={data.phone || ""}
                  disabled
                />
              </Box>
              {data.account !== null ? (
                <Box
                  sx={{
                    flex: 1,
                    border: "1px solid black",
                    padding: 2,
                    borderRadius: 5,
                    backgroundColor: "#E3EFFD",
                  }}
                >
                  <Typography variant="h5">Thông tin tài khoản</Typography>
                  <TextInputAd
                    label="ID"
                    variant="outlined"
                    fullWidth
                    value={data.account?.id || ""}
                    disabled
                  />
                  <TextInputAd
                    label="Tên đăng nhập"
                    variant="outlined"
                    fullWidth
                    value={data.account?.email || ""}
                  />
                  <Stack
                    direction={"row"}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <TextInputAd
                      label="Trạng thái"
                      variant="outlined"
                      sx={{ width: 400 }}
                      value={
                        data.account?.enable === true
                          ? "Đang hoạt động"
                          : "Tạm khóa"
                      }
                      disabled
                    />
                    <Button
                      variant="contained"
                      sx={{ height: 55, marginTop: 4 }}
                      onClick={handleChangle}
                    >
                      Đổi trạng thái
                    </Button>
                  </Stack>
                </Box>
              ) : null}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default AccountDetail;
