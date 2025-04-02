import {
  Box,
  Button,
  Modal,
  IconButton,
  ImageList,
  ImageListItem,
  LinearProgress,
  Alert,
  Stack,
  Collapse,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styleProduct, VisuallyHiddenInput } from "../../Component/Style";

import React from "react";
import axios from "axios";

import { useState } from "react";
import ModalTest from "./ModalTest";
import { useEffect } from "react";

function ModalDes({ setModal, modal, imageP, id, setImage }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState(false);
  const [iid, setIid] = useState("");
  const toggleModal = () => {
    setModal(false);
  };
  useEffect(() => {
    if (open === true) {
      axios
        .get(`/api/v1/products/getById/${id}`)
        .then(function (response) {
          setImage(response.data.imageProducts);
        })
        .catch(function (error) {
          console.log(error);
        });
      const timeoutId = setTimeout(() => {
        setOpen(false);
      }, 3000);

      // Cleanup the timeout to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [open, id, setImage]);
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    // Xử lý tệp đã chọn ở đây

    setLoading(true);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("multipartFile", selectedFile);
      axios
        .post(`/api/v1/imageProducts/saveOrUpdate/${id}`, formData)
        .then(function (response) {
          setLoading(false);
          setOpen(true);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const delImg = (e) => {
    setTest(true);
    setIid(e);
  };

  return (
    <Modal open={modal} onClose={toggleModal}>
      <Box
        sx={[
          styleProduct,
          {
            height: 600,
            overflow: "auto",
            backgroundColor: "#E3EFFD",
            zIndex: 2,
          },
        ]}
      >
        <ModalTest
          modal={test}
          setModal={setTest}
          iid={iid}
          setOpen={setOpen}
        />
        <Box>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onChange={handleFileSelect}
              sx={{ width: 200 }}
            >
              Upload file
              <VisuallyHiddenInput type="file" />
            </Button>
            <Collapse in={open}>
              <Alert
                sx={{ width: 300 }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CancelIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                Thành công
              </Alert>
            </Collapse>
          </Stack>
          {loading ? (
            <LinearProgress sx={{ marginTop: 2 }} />
          ) : (
            <Box sx={{ height: 20 }}></Box>
          )}
          <ImageList sx={{ flex: 1, height: 450 }} cols={3} rowHeight={200}>
            {Array.from(imageP).map((item, i) => (
              <Box key={i}>
                <ImageListItem
                  sx={{
                    cursor: "pointer",
                    border: "1px solid black",
                  }}
                >
                  <IconButton
                    sx={{ position: "absolute" }}
                    onClick={() => delImg(item.id)}
                  >
                    <CancelIcon color="secondary" />
                  </IconButton>
                  <img
                    style={{ height: 100 }}
                    onClick={() => window.open(item.imageLink, "_blank")}
                    srcSet={`${item.imageLink}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.imageLink}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              </Box>
            ))}
          </ImageList>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalDes;
