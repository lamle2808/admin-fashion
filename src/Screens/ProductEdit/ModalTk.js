import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Modal from '@mui/material/Modal';
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 800,
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ModalTk = ({ modal, setModal, id, spec, setSpec, category }) => {
  console.log(spec);

  const handleClose = () => {
    setModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const importOrderDetail = spec.map((item) => {
      return {
        specificationName: item.specificationName,
        specificationValue: item.specificationValue,
      };
    });
    console.log(importOrderDetail);
    axios
      .post(`/api/v1/productSpecifications/updateList/${id}`, importOrderDetail)
      .then(function () {
        setModal(false);
        Swal.fire({
          title: "Thành công",
          icon: "success",
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleTextFieldChange = (index, value) => {
    const updatedSpec = [...spec];
    updatedSpec[index].specificationValue = value;
    setSpec(updatedSpec);
  };

  const toggleModal = () => {
    setModal(false);
  };
 
  return (
    <Modal open={modal} onClose={toggleModal}>
    <Box sx={[style, { width: 600 }]}>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Thông số kỹ thuật
      </Typography>
      <Box sx={{ overflow: "auto", height: 550, marginTop: 2 }}>
        {spec.map((item, index) => (
          <Stack
            direction={"row"}
            key={index}
            sx={{
              justifyContent: "space-between",
              backgroundColor: index % 2 === 0 ? "#f0f0f0" : "white",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Typography variant="body1" sx={{ width: 300 }}>
              {item.specificationName}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Chờ cập nhật"
              value={item.specificationValue || ""}
              onChange={(e) => handleTextFieldChange(index, e.target.value)}
            />
          </Stack>
        ))}
      </Box>
      <Stack
        direction="row"
        spacing={10}
        style={{
          justifyContent: "center",
          textAlign: "center",
          marginTop: 10,
        }}
      >
        <Button
          variant="contained"
          color="error"
          sx={{ width: 150 }}
          onClick={() => setModal(false)}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          sx={{ width: 150 }}
          onClick={handleSubmit}
        >
          Sửa
        </Button>
      </Stack>
    </Box>
  </Modal>
);
}

export default ModalTk;
