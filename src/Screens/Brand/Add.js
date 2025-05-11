import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import axios from "axios";

import { useState } from "react";
import Swal from "sweetalert2";
import { TextInputAd, FormButton } from "../../Component/Style";

function ModalBox({ setModal, modal, setTags }) {
  const [form, setForm] = useState({
    name: "",
    fullName: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    p: 4,
  };

  const toggleModal = () => {
    setModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    axios
      .post(`/api/v1/brands/saveOrUpdate`, form)
      .then(function (response) {
        setModal(false);
        setLoading(false);
        Swal.fire({
          title: "Thành công",
          text: "Thêm thương hiệu thành công",
          icon: "success",
          confirmButtonColor: "#2c6fbf"
        });
        
        // Refresh data
        axios
          .get("/api/v1/brands/getAllBrand")
          .then(function (response) {
            setTags(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể thêm thương hiệu",
          icon: "error",
        });
      });
  };

  const handleChangle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Modal
        open={modal}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{ 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center", 
              mb: 3 
            }}
          >
            <Typography 
              id="modal-modal-title" 
              variant="h5" 
              fontWeight="600" 
              color="#2c6fbf"
              sx={{
                position: 'relative',
                display: 'inline-block',
                mb: 1,
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
              Thêm thương hiệu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điền thông tin thương hiệu bên dưới
            </Typography>
          </Box>
          
          <Box>
            <form noValidate onSubmit={handleSubmit}>
              <TextInputAd
                label="Tên thương hiệu"
                variant="outlined"
                name="name"
                fullWidth
                required
                onChange={handleChangle}
              />
              <TextInputAd
                label="Tên công ty"
                variant="outlined"
                name="fullName"
                fullWidth
                onChange={handleChangle}
              />
              <TextInputAd
                label="Địa chỉ"
                variant="outlined"
                fullWidth
                name="address"
                onChange={handleChangle}
              />
              <TextInputAd
                label="Số điện thoại"
                variant="outlined"
                type="number"
                name="phone"
                fullWidth
                onChange={handleChangle}
              />

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "center",
                  mt: 3
                }}
              >
                <FormButton
                  variant="contained"
                  color="error"
                  onClick={toggleModal}
                >
                  Hủy
                </FormButton>
                <FormButton 
                  type="submit" 
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Thêm mới"}
                </FormButton>
              </Stack>
            </form>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalBox;
