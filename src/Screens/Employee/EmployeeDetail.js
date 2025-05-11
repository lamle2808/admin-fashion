import { Box, Button, Stack, Typography, CircularProgress, Divider, Grid } from "@mui/material";
import React from "react";
import { useState } from "react";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { FormButton, StylePaper, TextInputAd } from "../../Component/Style";

import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import ModalBox from "./Modal";

const EmployeeDetail = () => {
  const [show, setShow] = useState(true);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState("");
  const [birth, setBirht] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const id = useParams();
  const roleAcc = localStorage.getItem("asd");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/v1/employee/getByEmailOrPhone/${id.id}`)
      .then((res) => {
        setData(res.data);
        const roledata = res.data.account.roles;
        setRole(roledata.map((item) => item.id));
        setBirht(format(new Date(res.data.dateOfBirth), "dd-MM-yyyy"));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id.id]);

  const handleChangle = () => {
    if (data.account.enable === false) {
      axios
        .post(`/api/v1/accounts/update`, {
          email: data.account.email,
          enable: true,
        })
        .then((res) => {
          axios
            .get(`/api/v1/employee/getByEmailOrPhone/${id.id}`)
            .then((res) => {
              setData(res.data);
              Swal.fire({
                title: "Thành công",
                text: "Đã kích hoạt tài khoản",
                icon: "success",
              });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post(`/api/v1/accounts/update`, {
          email: data.account.email,
          enable: false,
        })
        .then((res) => {
          axios
            .get(`/api/v1/employee/getByEmailOrPhone/${id.id}`)
            .then((res) => {
              setData(res.data);
              Swal.fire({
                title: "Thành công",
                text: "Đã khóa tài khoản",
                icon: "success",
              });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }
  };

  if (loading) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%", height: "100%" }}>
      {data !== "" ? (
        <ModalBox
          setModal={setModal}
          modal={modal}
          roleData={role}
          id={data.account.id}
        />
      ) : null}
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%" }}>
          <Header setShow={setShow} show={show} text="" />
          <Box
            sx={{
              padding: 3,
              backgroundColor: "#EEF5FD",
              minHeight: "91vh",
            }}
          >
            <Box mb={3}>
              <Typography variant="h4" fontWeight={600} color="#2c6fbf">
                Thông tin nhân viên
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Quản lý thông tin chi tiết của nhân viên
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StylePaper sx={{ padding: 3, height: '100%' }}>
                  <Typography variant="h5" fontWeight={600} color="#2c6fbf" mb={2}>
                    Thông tin cá nhân
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <TextInputAd
                      label="Họ và tên"
                      variant="outlined"
                      fullWidth
                      value={data?.lastName + " " + data?.firstName}
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
                      value={birth}
                      disabled
                    />
                    <TextInputAd
                      label="Địa chỉ"
                      variant="outlined"
                      fullWidth
                      value={data.address || ""}
                      disabled
                    />
                    <TextInputAd
                      label="Email"
                      variant="outlined"
                      fullWidth
                      value={data.email || ""}
                      disabled
                    />
                    <TextInputAd
                      label="Số điện thoại"
                      variant="outlined"
                      fullWidth
                      value={data.phone || ""}
                      disabled
                    />
                  </Box>
                </StylePaper>
              </Grid>
              
              {data.account !== null && (
                <Grid item xs={12} md={6}>
                  <StylePaper sx={{ padding: 3, height: '100%' }}>
                    <Typography variant="h5" fontWeight={600} color="#2c6fbf" mb={2}>
                      Thông tin tài khoản
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ display: 'grid', gap: 2 }}>
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
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" ml={1} mb={1}>
                          Vai trò
                        </Typography>
                        <Stack direction="row" gap={1} sx={{ marginBottom: 2 }}>
                          {data.account?.roles.map((item) => (
                            <Box 
                              key={item.id}
                              sx={{ 
                                backgroundColor: '#e3f2fd',
                                color: '#2c6fbf',
                                borderRadius: '16px',
                                padding: '6px 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                border: '1px solid #81C3FF',
                              }}
                            >
                              {item.name.replace("ROLE_", "")}
                            </Box>
                          ))}
                        </Stack>
                        
                        {roleAcc === "123" && (
                          <FormButton
                            variant="contained"
                            onClick={() => setModal(true)}
                            sx={{ mt: 1 }}
                          >
                            Thay đổi vai trò
                          </FormButton>
                        )}
                      </Box>
                      
                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary" ml={1} mb={1}>
                          Trạng thái tài khoản
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              backgroundColor: data.account?.enable ? '#e8f5e9' : '#ffebee',
                              color: data.account?.enable ? '#2e7d32' : '#d32f2f',
                              borderRadius: '16px',
                              padding: '6px 16px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              border: `1px solid ${data.account?.enable ? '#66bb6a' : '#ef5350'}`,
                            }}
                          >
                            {data.account?.enable ? "Đang hoạt động" : "Tạm khóa"}
                          </Box>
                          
                          <FormButton
                            variant="contained"
                            color={data.account?.enable ? "error" : "success"}
                            onClick={handleChangle}
                          >
                            {data.account?.enable ? "Khóa tài khoản" : "Kích hoạt"}
                          </FormButton>
                        </Stack>
                      </Box>
                    </Box>
                  </StylePaper>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default EmployeeDetail;
