import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { TextInputAd, style } from "../../Component/Style";
import axios from "axios";

function ModalNcc({ setModal, modal }) {
  const [name, setName] = useState("");
  const [address, setAdress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const toggleModal = () => {
    setModal(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, address, email, phone);
    axios
    .post("/api/v1/suppliers/saveOrUpdate",{
      name, address, email, phone
    })
    .then(function (response) {
      console.log(response.data);
      setModal(false)
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return (
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
          <Typography
            id="modal-modal-title"
            variant="h6"
            sx={{ textAlign: "center" }}
          >
            Không tồn tại nhà cung cấp này, bạn có muốn thêm
          </Typography>
        </Box>
        <Box>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              label="Tên nhà sản xuất"
              variant="outlined"
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
            <TextInputAd
              label="Địa chỉ"
              variant="outlined"
              fullWidth
              onChange={(e) => setAdress(e.target.value)}
            />
            <TextInputAd
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              onChange={(e) => setPhone(e.target.value)}
            />

            <TextInputAd
              label="Email"
              variant="outlined"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />

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
                onClick={() => setModal(!modal)}
                sx={{ width: 150 }}
              >
                Hủy
              </Button>
              <Button type="submit" variant="contained" sx={{ width: 150 }}>
                Tạo
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalNcc;
