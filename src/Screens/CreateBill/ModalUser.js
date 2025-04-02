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
import Swal from "sweetalert2";
function ModalUser({ setModal, modal }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [dc, setDc] = useState("");

  const toggleModal = () => {
    setModal(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (last !== "" && first !== "") {
      axios
        .post(`/api/v1/customer/createKHVL`, {
          firstName: first,
          lastName: last,
          customerType: "Khách hàng vãng lai",
          phone: sdt,
          email,
          address: dc,
        })
        .then(function (response) {
          setFirst("");
          setLast("");
          setSdt("");
          setEmail("");
          setDc("");
          setModal(false);

          Swal.fire({
            title: "Thành công",
            icon: "success",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      Swal.fire({
        title: "Vui lòng điền thông tin",
        icon: "error",
      });
    }
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
          <Typography id="modal-modal-title" variant="h6">
            Khách hàng mới, vui lòng thêm thông tin
          </Typography>
        </Box>
        <Box>
          <form noValidate onSubmit={handleSubmit}>
            <Stack direction={"row"} gap={3}>
              <TextField
                label="Họ"
                variant="outlined"
                fullWidth
                value={first}
                onChange={(e) => setFirst(e.target.value)}
              />
              <TextField
                label="Tên"
                variant="outlined"
                fullWidth
                value={last}
                onChange={(e) => setLast(e.target.value)}
              />
            </Stack>
            <TextInputAd
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInputAd
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              type="number"
              value={sdt}
              onChange={(e) => setSdt(e.target.value)}
            />
            <TextInputAd
              label="Địa chỉ"
              variant="outlined"
              fullWidth
              value={dc}
              onChange={(e) => setDc(e.target.value)}
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

export default ModalUser;
