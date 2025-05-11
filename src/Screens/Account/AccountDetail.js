import { Box, Button, Stack, Typography, CircularProgress } from "@mui/material";
import React from "react";
import { useState } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { TextInputAd, StylePaper, FormButton } from "../../Component/Style";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AccountDetail = () => {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [birth, setBirht] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const id = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, [id.id]);

  const fetchUserData = () => {
    setLoading(true);
    axios
      .get(`/api/v1/customer/getByPhoneOrEmail/${id.id}`)
      .then((res) => {
        setData(res.data);
        if (res.data.dateOfBirth) {
          setBirht(format(new Date(res.data.dateOfBirth), "dd-MM-yyyy"));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể tải thông tin tài khoản",
          icon: "error",
        });
      });
  };

  const handleChangle = () => {
    if (!data.account) return;
    
    setSubmitting(true);
    const newStatus = data.account.enable === false;
    
    axios
      .post(`/api/v1/accounts/update`, {
        email: data.account.email,
        enable: newStatus,
      })
      .then((res) => {
        axios
          .get(`/api/v1/customer/getByPhoneOrEmail/${id.id}`)
          .then((res) => {
            setData(res.data);
            setSubmitting(false);
            Swal.fire({
              title: "Thành công",
              text: `Đã ${newStatus ? "mở khóa" : "khóa"} tài khoản thành công`,
              icon: "success",
              confirmButtonColor: "#2c6fbf"
            });
          })
          .catch((error) => {
            console.log(error);
            setSubmitting(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setSubmitting(false);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể thay đổi trạng thái tài khoản",
          icon: "error",
        });
      });
  };

  if (loading) {
    return (
      <Box sx={{ justifyContent: "center", minHeight: "100%", height: "100%" }}>
        <Stack direction="row">
          {show && <Left />}
          <Box sx={{ width: "100%" }}>
            <Header setShow={setShow} show={show} text="Chi tiết tài khoản" />
            <Box
              bgcolor={"#EEF5FD"}
              sx={{
                height: '91vh',
                paddingLeft: 3,
                paddingRight: 3,
                paddingTop: 2,
                paddingBottom: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <CircularProgress />
            </Box>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%", height: "100%" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%" }}>
          <Header setShow={setShow} show={show} text="Chi tiết tài khoản" />
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
                onClick={() => navigate("/Account")}
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
                Thông tin tài khoản: {data.lastName} {data.firstName}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3}>
              <StylePaper 
                sx={{
                  flex: 1,
                  padding: 3,
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <PersonIcon color="primary" />
                  <Typography 
                    variant="h6" 
                    fontWeight="600" 
                    color="#2c6fbf"
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
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
                    Thông tin cá nhân
                  </Typography>
                </Stack>
                
                <TextInputAd
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  value={(data?.lastName || "") + " " + (data?.firstName || "")}
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
                  value={birth || "Không có thông tin"}
                  disabled
                />
                <TextInputAd
                  label="Vai trò"
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
                  value={data.address || "Không có thông tin"}
                  disabled
                />
                <TextInputAd
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={data.email || "Không có thông tin"}
                  disabled
                />
                <TextInputAd
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  value={data.phone || "Không có thông tin"}
                  disabled
                />
              </StylePaper>
              
              {data.account !== null ? (
                <StylePaper 
                  sx={{
                    flex: 1,
                    padding: 3,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <AccountCircleIcon color="primary" />
                    <Typography 
                      variant="h6" 
                      fontWeight="600" 
                      color="#2c6fbf"
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
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
                      Thông tin tài khoản
                    </Typography>
                  </Stack>
                  
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
                    disabled
                  />
                  
                  <Stack direction="row" spacing={2} alignItems="center" mt={4}>
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
                      sx={{
                        "& .MuiInputBase-input": {
                          color: data.account?.enable === true ? "#66BB6A" : "#ef5350",
                          fontWeight: "bold"
                        }
                      }}
                    />
                    
                    <FormButton
                      variant="contained"
                      color={data.account?.enable === true ? "error" : "success"}
                      onClick={handleChangle}
                      disabled={submitting}
                      sx={{ height: 56, minWidth: 180, mt: 3.75 }}
                    >
                      {submitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        data.account?.enable === true ? "Khóa tài khoản" : "Mở khóa tài khoản"
                      )}
                    </FormButton>
                  </Stack>
                  
                  <Box sx={{ mt: 3, p: 2, bgcolor: "#f9f9f9", borderRadius: 2, border: "1px solid #edf2f7" }}>
                    <Typography variant="body2" color="text.secondary">
                      {data.account?.enable === true 
                        ? "Khi khóa tài khoản, người dùng sẽ không thể đăng nhập vào hệ thống."
                        : "Mở khóa sẽ cho phép người dùng đăng nhập và sử dụng dịch vụ bình thường."
                      }
                    </Typography>
                  </Box>
                </StylePaper>
              ) : (
                <StylePaper 
                  sx={{
                    flex: 1,
                    padding: 3,
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Stack alignItems="center" spacing={2}>
                    <AccountCircleIcon color="disabled" sx={{ fontSize: 60 }} />
                    <Typography variant="h6" color="text.secondary" align="center">
                      Người dùng chưa có tài khoản
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Khách hàng này chưa đăng ký tài khoản trong hệ thống.
                    </Typography>
                  </Stack>
                </StylePaper>
              )}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default AccountDetail;
