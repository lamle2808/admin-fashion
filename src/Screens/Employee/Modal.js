import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { FormButton, StylePaper } from "../../Component/Style";

function ModalBox({ setModal, modal, roleData, id }) {
  const [selectedRoles, setSelectedRoles] = useState(roleData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModal = () => {
    setModal(false);
  };

  const rolesData = [
    { id: 3, name: "ROLE_ADMIN", description: "Quản trị viên - Quyền cao nhất trong hệ thống" },
    { id: 2, name: "ROLE_EMPLOYEE", description: "Nhân viên - Quyền quản lý cơ bản" },
    { id: 1, name: "ROLE_CUSTOMER", description: "Khách hàng - Quyền người dùng cơ bản" },
  ];

  // Event handler for checkbox change
  const handleChange = (event) => {
    const roleId = parseInt(event.target.value, 10);

    // Check if the role ID is already in the array, and update accordingly
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleClick = () => {
    if (selectedRoles.length === 0) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng chọn ít nhất một vai trò",
        icon: "error",
      });
      return;
    }
    
    setIsSubmitting(true);
    const rolesDataToSubmit = selectedRoles.map((item) => ({ id: item }));
    
    axios
      .post(`/api/v1/accounts/addOrRemoveRoleToAccount/${id}`, rolesDataToSubmit)
      .then(function (response) {
        toggleModal();
        Swal.fire({
          title: "Thành công",
          text: "Đã cập nhật vai trò cho tài khoản",
          icon: "success",
        });
        setIsSubmitting(false);
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể cập nhật vai trò. Vui lòng thử lại sau",
          icon: "error",
        });
        setIsSubmitting(false);
      });
  };

  return (
    <Modal
      open={modal}
      onClose={toggleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <StylePaper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          padding: 3,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h5" fontWeight={600} color="#2c6fbf" textAlign="center" mb={1}>
          Cập nhật vai trò tài khoản
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
          Chọn vai trò phù hợp với người dùng này
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <FormGroup sx={{ mb: 3 }}>
          {rolesData.map((role) => (
            <Box
              key={role.id}
              sx={{
                mb: 1.5,
                p: 1.5,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                backgroundColor: selectedRoles.includes(role.id) ? "#f5faff" : "white",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#81C3FF",
                  backgroundColor: "#f5faff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onChange={handleChange}
                    value={role.id}
                    sx={{
                      color: "#81C3FF",
                      "&.Mui-checked": {
                        color: "#2c6fbf",
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {role.name.replace("ROLE_", "")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role.description}
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%' }}
              />
            </Box>
          ))}
        </FormGroup>
        
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "center",
          }}
        >
          <FormButton
            variant="contained"
            color="error"
            onClick={toggleModal}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </FormButton>
          <FormButton
            variant="contained"
            onClick={handleClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
          </FormButton>
        </Stack>
      </StylePaper>
    </Modal>
  );
}

export default ModalBox;
