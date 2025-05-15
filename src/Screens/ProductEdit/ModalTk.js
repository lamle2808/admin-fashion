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
      <Box sx={[style, { width: 400, bgcolor: "white", p: 0 }]}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "600", textAlign: "center" }}>
            Mẫu mã
          </Typography>
        </Box>
        
        <Box sx={{ maxHeight: 500, overflow: "auto" }}>
          {groupedBySize && typeof groupedBySize === "object" ? (
            Object.entries(groupedBySize).map(([size, items], index) => (
              <Box key={size}>
                <Typography variant="subtitle1" sx={{ px: 3, py: 1.5, fontWeight: "500" }}>
                  Size: {size}
                </Typography>
                {items.map((item, subIndex) => (
                  <Stack direction="row" key={subIndex} sx={{ px: 3, py: 1 }}>
                    <Typography variant="body2" sx={{ width: 100, color: "#5f5f5f" }}>
                      Màu sắc:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "500" }}>
                      {item.color}
                    </Typography>
                  </Stack>
                ))}
                <Stack direction="row" sx={{ px: 3, py: 1, pb: 2 }}>
                  <Typography variant="body2" sx={{ width: 100, color: "#5f5f5f" }}>
                    Số lượng:
                  </Typography>
                  <TextField
                    size="small"
                    inputProps={{
                      style: { 
                        paddingTop: 4, 
                        paddingBottom: 4,
                      },
                    }}
                    sx={{ 
                      width: 200, 
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                        },
                      },
                    }}
                    value={items[0]?.count || ""}
                    onChange={(e) => handleTextFieldChange(size, 0, e.target.value)}
                  />
                </Stack>
              </Box>
            ))
          ) : null}
        </Box>
        
        <Box sx={{ p: 1, borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            sx={{ 
              py: 1, 
              width: 120, 
              bgcolor: "#e4252a", 
              textTransform: "none", 
              fontSize: "16px",
              "&:hover": { bgcolor: "#d01e23" },
            }}
            onClick={() => setModal(false)}
          >
            Đóng
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalTk;
