import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import Header from "../../Component/Header";
import React, { useEffect, useState } from "react";
import Left from "../../Component/Left";
import axios from "axios";
import { EventTracker, Scale, ValueScale } from "@devexpress/dx-react-chart";
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Label,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FormButton, StylePaper, StyledFormControl, TextInputAd } from "../../Component/Style";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InsightsIcon from '@mui/icons-material/Insights';
import InventoryIcon from '@mui/icons-material/Inventory';

function SaleStatistics() {
  const [show, setShow] = useState(true);
  const [dataIm, setDataIm] = useState("");
  const [monthI, setMonthI] = useState(new Date().getMonth() + 1);
  const [yearI, setYearI] = useState(new Date().getFullYear());
  const [dataaa, setData] = useState([]);
  const [start, setStart] = useState(dayjs());
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDaily, setLoadingDaily] = useState(true);

  const handleMonthI = (e) => {
    setMonthI(e.target.value);
  };
  
  const handleYeaI = (e) => {
    setYearI(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `/api/v1/shoppingCarts/thong_ke_product_sale_by_moth/${
          monthI + "-" + yearI
        }`
      )
      .then((res) => {
        setDataIm(res.data);
        // Đảm bảo dữ liệu số lượng là số nguyên
        if (res.data.productTKS && Array.isArray(res.data.productTKS)) {
          const processedData = res.data.productTKS.map(item => ({
            ...item,
            sl: parseInt(item.sl, 10) || 0, // Chuyển đổi thành số nguyên, mặc định là 0
            type: item.type || "Không xác định" // Đảm bảo loại hàng luôn có tên
          }));
          setData(processedData);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.data === "not found!!") {
          setDataIm("sd");
        }
        setLoading(false);
      });
    
    setLoadingDaily(true);
    axios
      .get(
        `/api/v1/shoppingCarts/thong_ke_tt_date/${start.format("YYYY-MM-DD")}`
      )
      .then((res) => {
        setTotal(res.data);
        setLoadingDaily(false);
      })
      .catch((error) => {
        if (error.response?.data === "not found!!") {
          setTotal("not found");
        }
        setLoadingDaily(false);
      });
  }, [monthI, yearI, start]);

  // Định dạng số tiền thành chuỗi có dấu phân cách
  const formatCurrency = (amount) => {
    if (amount === "not found" || !amount) return "0";
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const CustomAxisLabel = props => {
    const { text, ...restProps } = props;
    return (
      <ValueAxis.Label
        {...restProps}
        text={Math.round(Number(text))}
      />
    );
  };

  // Component tooltip tùy chỉnh
  const CustomTooltipContent = props => {
    const { targetItem, text, ...restProps } = props;
    
    let displayText = text;
    if (targetItem && targetItem.series === 'Số lượng') {
      displayText = Math.round(Number(text));
    }
    
    return (
      <Tooltip.Content
        {...restProps}
        text={displayText}
        style={{ fontWeight: 'bold' }}
      />
    );
  };

  const DailyStatistic = () => {
    return (
      <StylePaper sx={{ padding: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={600} color="#2c6fbf" mb={2}>
          Thống kê doanh thu theo ngày
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon sx={{ color: '#2c6fbf', fontSize: '2rem', mr: 2 }} />
              <Typography variant="h6" fontWeight={500}>
                Tổng doanh thu ngày
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                sx={{ width: "100%" }}
                label="Chọn ngày cần xem"
                value={start}
                openTo="day"
                inputFormat="DD/MM/YYYY"
                views={["year", "month", "day"]}
                minDate={dayjs("2020-01-01")}
                onChange={(newValue) => {
                  setStart(newValue);
                }}
                renderInput={(params) => (
                  <TextInputAd {...params} fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                height: '100%',
                padding: '12px 20px',
                backgroundColor: loadingDaily ? '#f5f5f5' : (total === "not found" ? '#ffebee' : '#e8f5e9'),
                borderRadius: '8px',
                borderLeft: `4px solid ${loadingDaily ? '#9e9e9e' : (total === "not found" ? '#ef5350' : '#4caf50')}`,
              }}
            >
              {loadingDaily ? (
                <CircularProgress size={24} sx={{ mr: 2 }} />
              ) : (
                <InsightsIcon sx={{ 
                  color: total === "not found" ? '#ef5350' : '#4caf50', 
                  fontSize: '2rem', 
                  mr: 2 
                }} />
              )}
              <Typography 
                variant="h6" 
                fontWeight={600} 
                color={loadingDaily ? 'text.secondary' : (total === "not found" ? '#d32f2f' : '#2e7d32')}
              >
                {loadingDaily 
                  ? "Đang tải..." 
                  : (total === "not found" 
                    ? "Không có doanh thu" 
                    : `${formatCurrency(total)} VNĐ`)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </StylePaper>
    );
  };

  const MonthlyStatistic = () => {
    if (loading) {
      return (
        <StylePaper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            padding: 3,
          }}
        >
          <CircularProgress />
        </StylePaper>
      );
    }
    
    if (dataIm === "") {
      return (
        <StylePaper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            padding: 3,
          }}
        >
          <Typography variant="h5" color="text.secondary">
            Không thể tải dữ liệu thống kê
          </Typography>
        </StylePaper>
      );
    }

    // Tìm giá trị lớn nhất để đảm bảo trục Y đủ cao
    const maxValue = dataaa.length > 0 
      ? Math.max(...dataaa.map(item => item.sl)) + 1 
      : 10;

    return (
      <StylePaper sx={{ padding: 3 }}>
        <Typography variant="h5" fontWeight={600} color="#2c6fbf" mb={2}>
          Thống kê bán hàng theo tháng
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <StyledFormControl fullWidth>
              <InputLabel id="month-select-label">Tháng</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={monthI}
                label="Tháng"
                onChange={handleMonthI}
              >
                {Array.from(Array(12)).map((_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    Tháng {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledFormControl fullWidth>
              <InputLabel id="year-select-label">Năm</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={yearI}
                label="Năm"
                onChange={handleYeaI}
              >
                {Array.from(Array(5)).map((_, i) => (
                  <MenuItem key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                padding: "0 20px",
                marginTop: { xs: 0, md: "30px" },
                borderLeft: "4px solid #2c6fbf",
              }}
            >
              <InventoryIcon sx={{ color: "#2c6fbf", mr: 2, fontSize: "2rem" }} />
              <Typography variant="h6" fontWeight={600} color="#2c6fbf">
                Tổng số sản phẩm bán ra: {dataIm.tongSP || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {dataIm !== "sd" ? (
          <Box sx={{ backgroundColor: "#f9fafb", p: 2, borderRadius: 2, mt: 2 }}>
            <Chart data={dataaa} height={400}>
              <ValueScale name="sl" modifyDomain={() => [0, maxValue]} />
              <ArgumentAxis />
              <ValueAxis 
                labelComponent={CustomAxisLabel}
                showGrid={true}
                showLine={true}
                showTicks={true}
              />
              <BarSeries 
                valueField="sl" 
                argumentField="type" 
                color="#2c6fbf"
                name="Số lượng"
                scaleName="sl"
              />
              <Title 
                text={`Thống kê số lượng bán các loại hàng - Tháng ${monthI}/${yearI}`} 
                textComponent={({ text, ...restProps }) => (
                  <Typography variant="h6" {...restProps}>
                    {text}
                  </Typography>
                )}
              />
              <EventTracker />
              <Tooltip contentComponent={CustomTooltipContent} />
              <Animation />
            </Chart>
          </Box>
        ) : (
          <Box
            sx={{
              height: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f9fafb",
              borderRadius: 2,
              mt: 2,
            }}
          >
            <Typography variant="h5" sx={{ textAlign: "center" }} color="text.secondary">
              Không có dữ liệu thống kê cho thời gian đã chọn
            </Typography>
          </Box>
        )}
      </StylePaper>
    );
  };

  return (
    <Box sx={{ justifyContent: "center" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%", minWidth: "70%" }}>
          <Header show={show} setShow={setShow} />
          <Box
            bgcolor={"#EEF5FD"}
            sx={{
              height: "91vh",
              padding: 3,
              overflowY: "auto",
            }}
          >
            <Box mb={3}>
              <Typography variant="h4" fontWeight={600} color="#2c6fbf">
                Thống kê bán hàng
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Xem doanh thu theo ngày và thống kê sản phẩm bán ra
              </Typography>
            </Box>
            
            {DailyStatistic()}
            {MonthlyStatistic()}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default SaleStatistics;
