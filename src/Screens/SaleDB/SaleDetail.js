import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  Stack,
  Typography,
  CircularProgress,
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
import { useNavigate, useParams } from "react-router-dom";
import SplitArray from "./Item";
import { StylePaper, TextInputAd, FormButton } from "../../Component/Style";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SaleDetails = () => {
  const [show, setShow] = useState(true);
  const [select, setSelect] = useState("");
  const [select2, setSelect2] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const id = useParams();
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSaleDetails();
  }, [id.id]);

  const fetchSaleDetails = () => {
    setLoading(true);
    axios
      .get(`/api/v1/sales/getById/${id.id}`)
      .then(function (response) {
        setSelect(response.data.saleDetails);
        setDescription(response.data.description);
        setDiscount(response.data.discount);
        setEnd(dayjs(response.data.end));
        setStart(dayjs(response.data.start));
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể tải thông tin khuyến mãi",
          icon: "error",
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

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
        Swal.fire({
          title: "Thành công",
          text: "Đã cập nhật thông tin khuyến mãi",
          icon: "success",
          confirmButtonColor: "#2c6fbf"
        });
        setSubmitting(false);
      })
      .catch(function (error) {
        console.log(error);
        setSubmitting(false);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể cập nhật thông tin khuyến mãi",
          icon: "error",
        });
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
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/SaleDB")}
                sx={{
                  color: "#2c6fbf",
                  "&:hover": {
                    backgroundColor: "rgba(44, 111, 191, 0.1)",
                  },
                }}
              >
                Quay lại
              </Button>
              <Typography variant="h5" fontWeight="600" color="#2c6fbf">
                Chi tiết khuyến mãi #{id.id}
              </Typography>
            </Stack>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress />
              </Box>
            ) : (
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
                        value={discount}
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
                        disabled={submitting || check || discount === 0}
                        sx={{ minWidth: 180 }}
                      >
                        {submitting ? <CircularProgress size={24} /> : "Cập nhật khuyến mãi"}
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
                      Sản phẩm đang áp dụng khuyến mãi
                    </Typography>
                    {select && Array.isArray(select) && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Tổng cộng: {select.length} sản phẩm
                      </Typography>
                    )}
                  </Box>
                  
                  <Box 
                    sx={{ 
                      flexGrow: 1, 
                      overflowY: "auto",
                      p: 2
                    }}
                  >
                    {select && Array.isArray(select) && select.length > 0 ? (
                      <Box
                        sx={{
                          backgroundColor: "#f8fafc",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            backgroundColor: "#f1f9ff",
                            p: 1.5,
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <Box sx={{ width: "60%", fontWeight: 600, color: "#2c6fbf" }}>
                            <Typography>Tên sản phẩm</Typography>
                          </Box>
                          <Box sx={{ width: "20%", textAlign: "center", fontWeight: 600, color: "#2c6fbf" }}>
                            <Typography>Trạng thái</Typography>
                          </Box>
                          <Box sx={{ width: "20%", textAlign: "center", fontWeight: 600, color: "#2c6fbf" }}>
                            <Typography>Thao tác</Typography>
                          </Box>
                        </Stack>
                        
                        <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
                          {select.map((item, i) => (
                            <Box key={i}>
                              <SplitArray item={item} setSelect={setSelect} />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography color="text.secondary">
                          Chưa có sản phẩm nào được áp dụng khuyến mãi này
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ p: 2, borderTop: '1px solid #edf2f7' }}>
                    <Typography variant="subtitle2" mb={2}>
                      Thêm sản phẩm mới vào khuyến mãi:
                    </Typography>
                    <Table setSelect={setSelect2} select={select2} />
                  </Box>
                </StylePaper>
              </Stack>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default SaleDetails;
