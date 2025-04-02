import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import Header from "../../Component/Header";
import React, { useEffect, useState } from "react";
import Left from "../../Component/Left";
import axios from "axios";
import { TextInputAd } from "../../Component/Style";

function Profile() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const key = localStorage.getItem("key");
  useEffect(() => {
    axios
      .get(`/api/v1/employee/getByEmailOrPhone/${key}`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  }, [key]);

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
            <Stack
              direction={"row"}
              sx={{ padding: 2, paddingLeft: 10 }}
              gap={20}
            >
              <Avatar
                alt="Remy Sharp"
                src={data?.avatar?.imageLink || ""}
                sx={{ width: 150, height: 150 }}
              />
              <Box sx={{ backgroundColor: "white", width: "50%", padding: 2 }}>
                <Typography variant="h3">
                  {data?.lastName + " " + data?.firstName}
                </Typography>
                <Typography
                  sx={{ marginTop: 2, color: "#1ecbe1", cursor: "pointer" }}
                  variant="h5"
                >
                  {data?.email}
                </Typography>
                <Typography sx={{ marginTop: 2 }} variant="h5">
                  Administrator
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ backgroundColor: "white", width: "80%", padding: 2 }}>
                <Typography sx={{ marginTop: 2 }} variant="h4">
                  Account id {data.account?.id || ""}
                </Typography>
                <Divider sx={{ border: "1px solid black" }} />

                <TextInputAd
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  value={data.lastName + " " + data.firstName}
                  disabled
                />
                <TextInputAd
                  label="Tên đăng nhập"
                  variant="outlined"
                  fullWidth
                  value={data.account?.email || ""}
                />
                <TextInputAd
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  value={data.phone || ""}
                />
                <TextInputAd
                  label="Trạng thái"
                  variant="outlined"
                  fullWidth
                  value={
                    data.account?.enable === true
                      ? "Đang hoạt động"
                      : "Tạm khóa"
                  }
                  disabled
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Profile;
