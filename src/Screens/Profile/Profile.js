import { 
  Avatar, 
  Box, 
  Divider, 
  Stack, 
  Typography, 
  Grid, 
  Chip,
  CircularProgress
} from "@mui/material";
import Header from "../../Component/Header";
import React, { useEffect, useState } from "react";
import Left from "../../Component/Left";
import axios from "axios";
import { StylePaper, TextInputAd } from "../../Component/Style";

// Icons
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';

function Profile() {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const key = localStorage.getItem("key");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/v1/employee/getByEmailOrPhone/${key}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [key]);

  // Hiển thị trạng thái tài khoản
  const AccountStatus = ({ status }) => {
    return (
      <Chip 
        label={status ? "Đang hoạt động" : "Tạm khóa"}
        sx={{ 
          backgroundColor: status ? "#e8f5e9" : "#ffebee",
          color: status ? "#2e7d32" : "#d32f2f",
          fontWeight: 600,
          borderRadius: '8px',
          '& .MuiChip-label': { px: 1.5 }
        }}
      />
    );
  };

  if (loading) {
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
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
                Hồ sơ người dùng
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Thông tin tài khoản và dữ liệu cá nhân
              </Typography>
            </Box>

            <StylePaper sx={{ mb: 3, p: 0, overflow: 'hidden' }}>
              <Box sx={{ 
                bgcolor: '#e3f2fd', 
                p: 3,
                borderBottom: '1px solid #e0e0e0'
              }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Avatar
                      alt={data?.firstName || "User"}
                      src={data?.avatar?.imageLink || ""}
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        bgcolor: '#c4c4c4',
                        border: '4px solid #fff',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      {data?.firstName?.charAt(0) || "R"}
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <Typography variant="h4" fontWeight={700} color="#2c6fbf" gutterBottom>
                      {data?.lastName} {data?.firstName}
                    </Typography>

                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AlternateEmailIcon sx={{ color: '#2c6fbf', mr: 1 }} />
                          <Typography variant="body1" color="text.secondary">
                            {data?.email || "Không có email"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ color: '#2c6fbf', mr: 1 }} />
                          <Typography variant="body1" color="text.secondary">
                            {data?.phone || "Không có số điện thoại"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AdminPanelSettingsIcon sx={{ color: '#2c6fbf', mr: 1 }} />
                          <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            Administrator
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

              <Box p={3}>
                <Typography variant="h5" fontWeight={600} color="#2c6fbf" mb={2}>
                  Thông tin tài khoản
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextInputAd
                      label="Họ và tên"
                      variant="outlined"
                      fullWidth
                      value={data?.lastName + " " + data?.firstName || ""}
                      InputProps={{
                        startAdornment: <BadgeIcon sx={{ mr: 1, color: '#757575' }} />,
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInputAd
                      label="Tên đăng nhập"
                      variant="outlined"
                      fullWidth
                      value={data.account?.email || ""}
                      InputProps={{
                        startAdornment: <AlternateEmailIcon sx={{ mr: 1, color: '#757575' }} />,
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInputAd
                      label="Số điện thoại"
                      variant="outlined"
                      fullWidth
                      value={data.phone || ""}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: '#757575' }} />,
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      height: '100%', 
                      p: 2, 
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px'
                    }}>
                      <Typography variant="body1" sx={{ mr: 2 }}>Trạng thái tài khoản:</Typography>
                      <AccountStatus status={data.account?.enable} />
                    </Box>
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Typography variant="h5" fontWeight={600} color="#2c6fbf" mb={2}>
                    Thông tin chi tiết
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <StylePaper sx={{ p: 2, height: '100%', borderLeft: '4px solid #2c6fbf' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          ID tài khoản
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="#2c6fbf">
                          {data.account?.id || "N/A"}
                        </Typography>
                      </StylePaper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StylePaper sx={{ p: 2, height: '100%', borderLeft: '4px solid #f57c00' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phân quyền
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color="#f57c00">
                          Administrator
                        </Typography>
                      </StylePaper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StylePaper sx={{ p: 2, height: '100%', borderLeft: '4px solid #2e7d32' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Trạng thái
                        </Typography>
                        <Typography variant="h6" fontWeight={600} color={data.account?.enable ? "#2e7d32" : "#d32f2f"}>
                          {data.account?.enable ? "Đang hoạt động" : "Tạm khóa"}
                        </Typography>
                      </StylePaper>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </StylePaper>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Profile;
