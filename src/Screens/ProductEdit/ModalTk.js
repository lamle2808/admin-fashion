import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import React from "react";
import { style } from "../../Component/Style";
import axios from "axios";
import Swal from "sweetalert2";
function ModalTk({ setModal, modal, spec, id, setSpec }) {
  const toggleModal = () => {
    setModal(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // const importOrderDetail = spec.map((item) => {
    //   return {
    //     specificationName: item.specificationName,
    //     specificationValue: item.specificationValue,
    //   };
    // });
    // console.log(importOrderDetail);
    // axios
    //   .post(`/api/v1/productSpecifications/updateList/${id}`, importOrderDetail)
    //   .then(function () {
    //     setModal(false);
    //     Swal.fire({
    //       title: "Thành công",
    //       icon: "success",
    //     });
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };
  const handleTextFieldChange = (index, value) => {
    const updatedSpec = [...spec];
    updatedSpec[index].specificationValue = value;
    setSpec(updatedSpec);
  };
  return (
    <Modal open={modal} onClose={toggleModal}>
      <Box sx={[style, { width: 600 }]}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Thông số kỹ thuật
        </Typography>
        <Box sx={{ overflow: "auto", height: 550, marginTop: 2 }}>
          {/* {spec.map((item, index) => (
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
          ))} */}
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
