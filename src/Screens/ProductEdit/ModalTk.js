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
  const groupedBySize = spec.reduce((acc, item) => {
      if (!acc[item.size]) {
        acc[item.size] = [];
      }
      acc[item.size].push({ color: item.color, count: item.count });
      return acc;
    }, {});
  console.log(groupedBySize);

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
        {groupedBySize && typeof groupedBySize === "object" ? (
          Object.entries(groupedBySize).map(([size, items], index) => (
            <Box key={size} sx={{ marginBottom: 2 }}>
              <Typography variant="h6">Size: {size}</Typography>
              {items.map((item, subIndex) => (
                <Stack
                  direction="row"
                  key={subIndex}
                  sx={{
                    justifyContent: "space-between",                 
                    alignItems: "center",
                    padding: 2,
                  }}
                >
                  <Typography variant="body1" sx={{ width: 300 }}>
                    {item.color}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Chờ cập nhật"
                    value={item.count}
                    onChange={(e) => handleTextFieldChange(size, subIndex, e.target.value)}
                  />
                </Stack>
              ))}
            </Box>
          ))
        ) : null}
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
          Đóng
        </Button>
      </Stack>
    </Box>
  </Modal>
);
}

export default ModalTk;
