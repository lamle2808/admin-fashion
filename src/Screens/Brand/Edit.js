import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import axios from "axios";

import Swal from "sweetalert2";
import { TextInputAd } from "../../Component/Style";

function ModalEdit({ setModal, modal, setTags, id, setId }) {
  // const [form, setForm] = useState(id);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(id);
    axios
      .post(`/api/v1/brands/saveOrUpdate`, id)
      .then(function (response) {
        console.log(response.data);
        setModal(false);
        Swal.fire("Thành công", "Tạo thành công", "success");
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
        console.log(error);
      });
  };

  const handleChangle = (e) => {
    setId({ ...id, [e.target.name]: e.target.value });
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
              Thêm thương hiệu
            </Typography>
          </Box>
          <Box>
            <form noValidate onSubmit={handleSubmit}>
              <TextInputAd
                label="Tên thẻ"
                variant="outlined"
                name="name"
                fullWidth
                value={id.name}
                onChange={handleChangle}
              />
              <TextInputAd
                label="Tên công ty"
                variant="outlined"
                name="fullName"
                fullWidth
                value={id.fullName}
                onChange={handleChangle}
              />
              <TextInputAd
                label="Địa chỉ"
                variant="outlined"
                fullWidth
                name="address"
                value={id.address}
                onChange={handleChangle}
              />
              <TextInputAd
                label="Số điện thoại"
                variant="outlined"
                type="number"
                name="phone"
                fullWidth
                value={id.phone}
                onChange={handleChangle}
              />

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
                <Button type="submit" variant="contained" sx={{ width: 150 }}>
                  Tạo
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalEdit;
