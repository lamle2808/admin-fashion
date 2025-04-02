import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import { style } from "../../Component/Style";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
function ModalTest({ setModal, modal, iid, setOpen }) {
  const toggleModal = () => {
    setModal(false);
  };

  const delImg = () => {
    axios
      .delete(`/api/v1/imageProducts/delete/${iid}`)
      .then(function (response) {
        setModal(false);
        setOpen(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Modal open={modal} onClose={toggleModal}>
      <Box
        sx={[
          style,
          {
            textAlign: "center",
          },
        ]}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: "gray" }} />
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Bạn chắc chắn muốn xóa
        </Typography>
        <Stack
          direction="row"
          spacing={10}
          style={{
            justifyContent: "center",
            textAlign: "center",
            marginTop: 20,
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
          <Button variant="contained" sx={{ width: 150 }} onClick={delImg}>
            Đồng ý
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ModalTest;
