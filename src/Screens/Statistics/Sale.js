import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import Header from "../../Component/Header";
import React, { useEffect, useState } from "react";
import Left from "../../Component/Left";
import axios from "axios";
import { EventTracker } from "@devexpress/dx-react-chart";
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function SaleStatistics() {
  const [show, setShow] = useState(true);
  const [dataIm, setDataIm] = useState("");
  const [monthI, setMonthI] = useState(new Date().getMonth() + 1);
  const [yearI, setYearI] = useState(new Date().getFullYear());
  const [dataaa, setData] = useState([]);
  const [start, setStart] = useState(dayjs());
  const [total, setTotal] = useState("");

  const handleMonthI = (e) => {
    setMonthI(e.target.value);
  };
  const handleYeaI = (e) => {
    setYearI(e.target.value);
  };

  useEffect(() => {
    axios
      .get(
        `/api/v1/shoppingCarts/thong_ke_product_sale_by_moth/${
          monthI + "-" + yearI
        }`
      )
      .then((res) => {
        setDataIm(res.data);
        setData(res.data.productTKS);
      })
      .catch((error) => {
        if (error.response.data === "not found!!") {
          setDataIm("sd");
        }
      });
    console.log(start);
    axios
      .get(
        `/api/v1/shoppingCarts/thong_ke_tt_date/${start.format("YYYY-MM-DD")}`
      )
      .then((res) => {
        setTotal(res.data);
      })
      .catch((error) => {
        if (error.response.data === "not found!!") {
          setTotal("not found");
        }
      });
  }, [monthI, yearI, start]);

  const dataImport = (data, loai, mon, yea) => {
    if (data !== "") {
      return (
        <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: 5 }}>
          <Stack direction={"row"} gap={5}>
            <FormControl fullWidth sx={{ backgroundColor: "white" }}>
              <InputLabel id="demo-simple-select-label">Tháng</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mon}
                label="Age"
                onChange={(e) => handleMonthI(e, loai)}
              >
                {Array.from(Array(12)).map((_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ backgroundColor: "white" }}>
              <InputLabel id="demo-simple-select-label">Năm</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={yea}
                label="Age"
                onChange={(e) => handleYeaI(e, loai)}
              >
                {Array.from(Array(5)).map((_, i) => (
                  <MenuItem key={i} value={2023 - i}>
                    {2023 - i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">
              Tổng số sản phẩm bán được: {dataIm.tongSP}
            </Typography>
          </Box>
          {data !== "sd" ? (
            <Chart data={dataaa} height={400}>
              <ArgumentAxis />
              <ValueAxis />
              <BarSeries valueField="sl" argumentField="type" />
              <Title text={`Danh sách ${loai} các loại hàng năm ${yearI}`} />
              <EventTracker />
              <Tooltip />
            </Chart>
          ) : (
            <Box
              sx={{
                height: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h3" sx={{ textAlign: "center" }}>
                Không có dữ liệu
              </Typography>
            </Box>
          )}
        </Box>
      );
    } else {
      return <CircularProgress />;
    }
  };

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
            <Box sx={{ padding: "5px 5px 5px" }}>
              <Typography variant="h4">Thống kê dữ liệu</Typography>
            </Box>
            <Stack
              direction={"row"}
              gap={5}
              sx={{
                padding: 5,
                backgroundColor: "white",
                marginBottom: 5,
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ width: 270 }}>
                Tổng hóa đơn theo ngày
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  sx={{ width: 200 }}
                  label="Ngày"
                  value={start}
                  openTo="year"
                  inputFormat="DD/MM/YYYY"
                  views={["year", "month", "day"]}
                  minDate={dayjs("2023-01-01")}
                  onChange={(newValue) => {
                    setStart(newValue);
                  }}
                />
              </LocalizationProvider>
              <Typography variant="h5" sx={{ width: 300 }}>
                {total === "not found" ? "Không có dữ liệu" : total} VND
              </Typography>
            </Stack>
            {dataImport(dataIm, "bán", monthI, yearI)}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default SaleStatistics;
