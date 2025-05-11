import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Table from "./Table";
import axios from "axios";
import Swal from "sweetalert2";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { StylePaper, FormButton, TextInputAd } from "../../Component/Style";

const Sale = () => {
  const [show, setShow] = useState(true);
  const [check, setCheck] = useState(false);
  const [select, setSelect] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (discount !== 0 && select !== "") {
      setLoading(true);
      
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
            text: "Đã tạo khuyến mãi mới",
            icon: "success",
            confirmButtonColor: "#2c6fbf"
          });
          setLoading(false);
          // Reset form
          setDescription("");
          setDiscount(0);
          setSelect("");
        })
        .catch(function (error) {
          console.log(error);
          setLoading(false);
          Swal.fire({
            title: "Lỗi",
            text: "Không thể tạo khuyến mãi",
            icon: "error",
          });
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
            bgcolor={"#EEF5FD"}
            sx={{
              height: '91vh',
              paddingLeft: 3,
              paddingRight: 3,
              paddingTop: 2,
              paddingBottom: 3,
              overflowY: 'auto'
            }}
          >
            <Typography variant="h5" fontWeight="600" color="#2c6fbf" mb={3}>
              Tạo khuyến mãi mới
            </Typography>
            
            <Stack direction="row" spacing={3}>
              <StylePaper 
                sx={{
                  flex: 1,
                  padding: 3,
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight="600" 
                  color="#2c6fbf"
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    mb: 3,
                    "&:after": {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '60px',
                      height: '3px',
                      background: 'linear-gradient(90deg, #81C3FF, #2c6fbf)',
                      borderRadius: '10px'
                    }
                  }}
                >
                  Thông tin khuyến mãi
                </Typography>
                
                <form noValidate onSubmit={handleSubmit}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextInputAd
                      error={check}
                      label="Giảm giá (%)"
                      variant="outlined"
                      type="number"
                      value={discount || ""}
                      onChange={(e) => handleDis(e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      sx={{ mt: 0 }}
                    />
                    {check && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        Giá trị phải nằm trong khoảng 1-99
                      </Typography>
                    )}
                  </FormControl>
                  
                  <TextInputAd
                    label="Mô tả"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    placeholder="Mô tả chi tiết về chương trình khuyến mãi này"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mt: 2, mb: 2 }}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2}>
                      <DesktopDatePicker
                        label="Ngày bắt đầu"
                        value={start}
                        inputFormat="DD/MM/YYYY"
                        onChange={(newValue) => setStart(newValue)}
                        renderInput={(params) => (
                          <TextInputAd {...params} sx={{ mt: 2 }} />
                        )}
                      />
                      
                      <DesktopDatePicker
                        label="Ngày kết thúc"
                        value={end}
                        inputFormat="DD/MM/YYYY"
                        onChange={(newValue) => setEnd(newValue)}
                        renderInput={(params) => (
                          <TextInputAd {...params} sx={{ mt: 2 }} />
                        )}
                      />
                    </Stack>
                  </LocalizationProvider>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <FormButton
                      type="submit"
                      variant="contained"
                      disabled={loading || check || discount === 0 || select === ""}
                      sx={{ minWidth: 180 }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Tạo khuyến mãi"}
                    </FormButton>
                  </Box>
                </form>
              </StylePaper>
              
              <StylePaper
                sx={{
                  flex: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid #edf2f7' }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="600" 
                    color="#2c6fbf"
                  >
                    Chọn sản phẩm áp dụng khuyến mãi
                  </Typography>
                  {select && select.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Đã chọn {select.length} sản phẩm
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flexGrow: 1, height: '65vh' }}>
                  <Table setSelect={setSelect} select={select} />
                </Box>
              </StylePaper>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Sale;
