import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

import { useState } from "react";
import { style } from "../../Component/Style";
import axios from "axios";
import Swal from "sweetalert2";

function ModalNcc({ modal, setModal, setNcc, setNccD }) {
  const [name, setName] = useState("");
  const [address, setAdress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    address: false,
    phone: false,
    email: false
  });

  const toggleModal = () => {
    setModal(false);
  };

  const validateForm = () => {
    const newErrors = {
      name: !name.trim(),
      address: !address.trim(),
      phone: !phone.trim() || !/^[0-9]{10,11}$/.test(phone),
      email: !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng điền đầy đủ thông tin và đúng định dạng",
        icon: "error",
      });
      return;
    }

    setLoading(true);
    
    axios
      .post("/api/v1/suppliers/saveOrUpdate", {
        name,
        address, 
        email, 
        phone
      })
      .then(function (response) {
        console.log(response.data);
        
        // Cập nhật thông tin nhà cung cấp ở component cha
        if (setNccD && typeof setNccD === 'function') {
          setNccD(response.data);
        }
        
        // Cập nhật thông tin tìm kiếm với email mới
        if (setNcc && typeof setNcc === 'function') {
          setNcc(email);
        }
        
        // Đóng modal
        setModal(false);
        
        Swal.fire({
          title: "Thành công",
          text: "Đã thêm nhà cung cấp mới",
          icon: "success",
        });
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể thêm nhà cung cấp. Vui lòng thử lại.",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const modalStyle = {
    ...style,
    width: 500,
    maxWidth: '90%',
    p: 0,
    overflow: 'hidden'
  };

  return (
    <Modal
      open={modal}
      onClose={toggleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={modalStyle}>
        <Box sx={{ 
          bgcolor: '#f5f5f5', 
          p: 2, 
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            sx={{ fontWeight: 'bold' }}
          >
            Thêm nhà cung cấp mới
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Tên nhà cung cấp"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  helperText={errors.name ? "Vui lòng nhập tên nhà cung cấp" : ""}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  value={address}
                  onChange={(e) => setAdress(e.target.value)}
                  error={errors.address}
                  helperText={errors.address ? "Vui lòng nhập địa chỉ" : ""}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  helperText={errors.phone ? "Vui lòng nhập số điện thoại hợp lệ (10-11 số)" : ""}
                  required
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  helperText={errors.email ? "Vui lòng nhập email hợp lệ" : ""}
                  required
                  type="email"
                />
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              mt: 4 
            }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={toggleModal}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Thêm nhà cung cấp"}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
}

export default ModalNcc;
