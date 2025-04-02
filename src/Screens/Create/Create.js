import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { TextInputAd } from "../../Component/Style";
import ModalBox from "./Modal";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";

function CreateEm() {
  const [show, setShow] = useState(true);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    address: "",
    email: "",
  });

  const [birth, setBirth] = useState(dayjs());

  const handleChangle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const [value, setValue] = useState("1");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClick = () => {
    axios
      .post("/api/v1/employee/createOrUpdate", data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%", height: "100%" }}>
      <ModalBox setModal={setModal} modal={modal} roleData={[]} />
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
                <Stack direction={"row"} gap={5}>
                  <TextInputAd
                    label="Họ"
                    variant="outlined"
                    fullWidth
                    value={data?.lastName}
                    onChange={handleChangle}
                    name="lastName"
                  />
                  <TextInputAd
                    label="Tên"
                    variant="outlined"
                    name="firstName"
                    fullWidth
                    value={data?.firstName}
                    onChange={handleChangle}
                  />
                </Stack>

                <FormControl sx={{ marginTop: 3 }}>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Giới tính
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Nữ"
                    name="radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                  >
                    <Stack direction={"row"}>
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Nữ"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Nam"
                      />
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <Box style={{ marginTop: 20, backgroundColor: "white" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      sx={{ width: "100%" }}
                      label="Ngày sinh"
                      value={birth}
                      openTo="year"
                      fullWidth
                      inputFormat="DD/MM/YYYY"
                      views={["year", "month", "day"]}
                      minDate={dayjs("2023-01-01")}
                      onChange={(newValue) => {
                        setBirth(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <TextInputAd
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  name="address"
                  value={data.address || ""}
                  onChange={handleChangle}
                />
                <TextInputAd
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={data.email || ""}
                  onChange={handleChangle}
                />
                <TextInputAd
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  name="phone"
                  type="number"
                  value={data.phone || ""}
                  onChange={handleChangle}
                />
                <Stack
                  direction="row"
                  spacing={10}
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                    marginTop: 30,
                  }}
                >
                  <Button
                    type="submit"
                    onClick={handleClick}
                    variant="contained"
                    sx={{ width: 150 }}
                  >
                    Tạo
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default CreateEm;
