import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Table from "./Table";
import axios from "axios";
import Swal from "sweetalert2";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const Sale = () => {
  const [show, setShow] = useState(true);
  const [check, setCheck] = useState(false);
  const [select, setSelect] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs());

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(discount);
    if (discount !== 0 && select !== "") {
      axios
        .post(`/api/v1/sales/saveOrUpdate`, {
          description: description,
          start: start.format("YYYY-MM-DD"),
          end: end.format("YYYY-MM-DD"),

          discount: discount,
          type: "%",
          saleDetails: select,
        })
        .then(function (response) {
          Swal.fire({
            title: "Thành công",
            icon: "success",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng nhập thông tin phù hợp",
        icon: "error",
      });
    }
  };

  const handleDis = (e) => {
    const discountValue = parseInt(e, 10);

    // Kiểm tra nếu giá trị nằm trong khoảng từ 1 đến 99
    if (!isNaN(discountValue) && discountValue > 0 && discountValue < 100) {
      setDiscount(discountValue);
      setCheck(false);
    } else {
      setDiscount(0);
      setCheck(true);
    }
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%", height: "100%" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%" }}>
          <Header setShow={setShow} show={show} text="Khuyến mãi" />
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
                  textAlign: "center",
                }}
              >
                <Typography variant="h5">Thông tin khuyến mãi</Typography>
                <form noValidate onSubmit={handleSubmit}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ marginTop: 2 }}
                  >
                    <OutlinedInput
                      fullWidth
                      error={check}
                      placeholder="Giảm giá"
                      id="outlined-adornment-weight"
                      type="number"
                      onChange={(e) => handleDis(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">%</InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                    />
                  </FormControl>
                  <TextField
                    id="standard-multiline-static"
                    label="Mô tả"
                    multiline
                    rows={4}
                    sx={{ marginTop: 2 }}
                    fullWidth
                    variant="outlined"
                    placeholder="Mô tả khuyến mãi"
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Box style={{ marginTop: 20 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        sx={{ width: "100%" }}
                        label="Ngày bắt đầu"
                        value={start}
                        openTo="year"
                        fullWidth
                        inputFormat="DD/MM/YYYY"
                        views={["year", "month", "day"]}
                        minDate={dayjs("2023-01-01")}
                        onChange={(newValue) => {
                          setStart(newValue);
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box style={{ marginTop: 20 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        sx={{ width: "100%" }}
                        label="Ngày kết thúc"
                        value={end}
                        openTo="year"
                        fullWidth
                        inputFormat="DD/MM/YYYY"
                        views={["year", "month", "day"]}
                        minDate={dayjs("2023-01-01")}
                        onChange={(newValue) => {
                          setEnd(newValue);
                        }}
                      />
                    </LocalizationProvider>
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

export default Sale;
