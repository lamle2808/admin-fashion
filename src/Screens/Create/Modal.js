import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";

import { useState } from "react";
import Swal from "sweetalert2";

function ModalBox({ setModal, modal, roleData, id }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.default",
    border: "2px solid gray",
    boxShadow: 24,
    color: "text.primary",
    p: 4,
  };

  const toggleModal = () => {
    setModal(false);
  };

  // Event handler for checkbox change
  const rolesData = [
    { id: 3, name: "ROLE_ADMIN" },
    { id: 2, name: "ROLE_EMPLOYEE" },
    { id: 1, name: "ROLE_CUSTOMER" },
  ];

  // State to track the selected roles

  // Event handler for checkbox change
  const [selectedRoles, setSelectedRoles] = useState(roleData); // Pre-select 'ROLE_CUSTOMER'

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
    const rolesDataasd = selectedRoles.map((item) => ({ id: item }));
    console.log(rolesDataasd);
    axios
      .post(`/api/v1/accounts/addOrRemoveRoleToAccount/${id}`, rolesDataasd)
      .then(function (response) {
        toggleModal();
        Swal.fire({
          title: "Thành công",
          icon: "success",
        });
      })
      .catch(function (error) {
        console.log(error);
      });
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
            sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
          >
            <Typography id="modal-modal-title" variant="h4">
              Sửa vai trò
            </Typography>
          </Box>
          <Box>
            <FormGroup>
              {rolesData.map((role) => (
                <FormControlLabel
                  key={role.id}
                  control={
                    <Checkbox
                      checked={selectedRoles.includes(role.id)}
                      onChange={handleChange}
                      value={role.id}
                    />
                  }
                  label={role.name}
                />
              ))}
            </FormGroup>
          </Box>
          <Stack
            direction="row"
            spacing={10}
            style={{
              justifyContent: "center",
              textAlign: "center",
              marginTop: 30,
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => setModal(!modal)}
              sx={{ width: 150 }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: 150 }}
              onClick={handleClick}
            >
              Tạo
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalBox;
