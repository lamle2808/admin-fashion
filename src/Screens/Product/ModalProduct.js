import { Box, Modal, Stack, Typography } from "@mui/material";
import { styleProduct } from "../../Component/Style";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function ModalProduct({ setModal, modal, value }) {
  const [data, setData] = useState("");
  const toggleModal = () => {
    setModal(false);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8521/api/v1/products/getById/${value}`)
      .then(function (response) {
        setData(response.data);
        console.log(response.data.specifications);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [value]);

  return (
    <Modal
      open={modal}
      onClose={toggleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleProduct}>
        <Stack direction={"row"}>
          <Box sx={{ flex: 1 }}>
            {data.imageProducts?.map((item) => (
              <Box
                key={item.id}
                component="img"
                onClick={() => window.open(item.imageLink, "_blank")}
                sx={{
                  height: 200,
                  cursor: "pointer",
                }}
                alt="logo"
                src={item.imageLink}
              />
            ))}
            <Typography variant="subtitle1">ID: {data.id}</Typography>
            <Typography variant="subtitle1">Tên: {data.productName}</Typography>
            <Typography variant="subtitle1">
              Số lượng: {data.quantity}
            </Typography>
            <Typography variant="subtitle1">
              Thương hiệu: {data.brand?.name}
            </Typography>
            <Typography variant="subtitle1">
              Loại: {data.category?.categoryName}
            </Typography>
            <Typography variant="subtitle1">Giá: {data.price}</Typography>
          </Box>

          <Box sx={{ height: 400, overflow: "auto", flex: 1 }}>
            <Typography variant="h5">Thông số kỹ thuật</Typography>
            {data.specifications !== null ? (
              <>
                {data.specifications?.map((item, index) => (
                  <Stack
                    key={index}
                    direction={"row"}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f0f0f0" : "white",
                      padding: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ width: 200 }}>
                      {item.specificationName}
                    </Typography>
                    <Typography variant="subtitle1">
                      {item.specificationValue || "Đang chờ cập nhật"}
                    </Typography>
                  </Stack>
                ))}
              </>
            ) : null}
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ModalProduct;
