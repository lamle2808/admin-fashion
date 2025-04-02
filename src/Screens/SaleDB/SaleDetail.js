import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Table from "./Table";
import axios from "axios";
import Swal from "sweetalert2";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import SplitArray from "./Item";

const SaleDetails = () => {
  const [show, setShow] = useState(true);
  const [select, setSelect] = useState("");
  const [select2, setSelect2] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs());
  const id = useParams();
  const [check, setCheck] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/v1/sales/getById/${id.id}`)
      .then(function (response) {
        console.log(response.data.saleDetails);
        setSelect(response.data.saleDetails);

        setDescription(response.data.description);
        setDiscount(response.data.discount);
        setEnd(dayjs(response.data.end));
        setStart(dayjs(response.data.start));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newasd = select2 !== "" ? select.concat(select2) : select;

    axios
      .post(`/api/v1/sales/updateSale`, {
        id: id.id,
        description: description,
        start: start.format("YYYY-MM-DD"),
        end: end.format("YYYY-MM-DD"),
        discount: discount,
        type: "%",
        saleDetails: newasd,
      })
      .then(function (response) {
        console.log(response.data);
        Swal.fire({
          title: "Thành công",
          icon: "success",
        });
      })
      .catch(function (error) {
        console.log(error);
      });
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
          <Header setShow={setShow} show={show} text="Thông tin Khuyến mãi" />
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
                <form noValidate onSubmit={handleSubmit}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ marginTop: 2 }}
                  >
                    <OutlinedInput
                      fullWidth
                      error={check}
                      sx={{ backgroundColor: "white" }}
                      placeholder="Giảm giá"
                      id="outlined-adornment-weight"
                      value={discount}
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
                    sx={{ marginTop: 2, backgroundColor: "white" }}
                    value={description}
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Stack direction={"row"} gap={2} style={{ marginTop: 20 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        sx={{ width: "100%", backgroundColor: "white" }}
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

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        sx={{ width: "100%", backgroundColor: "white" }}
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
                  </Stack>

                  <Stack
                    direction={"row"}
                    sx={{
                      backgroundColor: "white",
                      width: "96%",
                      paddingRight: 1,
                      paddingLeft: 1,
                      borderTopRightRadius: 20,
                      marginTop: 2,
                      borderTopLeftRadius: 20,
                    }}
                  >
                    <Box
                      sx={{
                        width: 230,
                        textAlign: "center",
                      }}
                    >
                      <Typography>Tên</Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 150,
                        textAlign: "center",
                      }}
                    >
                      <Typography>Đóng/Mở</Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 70,
                        textAlign: "center",
                      }}
                    >
                      <Typography>Sửa</Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Divider />
                  <Box
                    sx={{
                      height: 240,
                      overflow: "auto",
                      width: "96%",
                      backgroundColor: "white",
                      padding: 1,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  >
                    {select !== "" ? (
                      select.map((item, i) => (
                        <Box key={i}>
                          <SplitArray item={item} setSelect={setSelect} />
                        </Box>
                      ))
                    ) : (
                      <></>
                    )}
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
                      Sửa
                    </Button>
                  </Stack>
                </form>
              </Box>
              <Box sx={{ flex: 1.5, marginTop: 2 }}>
                {select !== "" ? (
                  <Table
                    setSelect={setSelect2}
                    select={select}
                    select2={select2}
                  />
                ) : null}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default SaleDetails;
