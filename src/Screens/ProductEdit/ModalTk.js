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
import Modal from "@mui/material/Modal";
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
    if (e) e.preventDefault();

    // Chuyển đổi dữ liệu thành định dạng API cần
    const specifications = [];

    // Thêm thông số về kích thước
    const sizes = Object.keys(groupedBySize);
    if (sizes.length > 0) {
      specifications.push({
        specificationName: "Kích thước",
        specificationValue: sizes.join(", "),
      });
    }

    // Thêm thông số về màu sắc
    const colors = new Set();
    Object.values(groupedBySize).forEach((items) => {
      items.forEach((item) => colors.add(item.color));
    });

    if (colors.size > 0) {
      specifications.push({
        specificationName: "Màu sắc",
        specificationValue: Array.from(colors).join(", "),
      });
    }

    // Thêm các thông số kỹ thuật khác từ spec gốc (nếu có)
    spec.forEach((item) => {
      if (
        item.specificationName !== "Kích thước" &&
        item.specificationName !== "Màu sắc"
      ) {
        specifications.push({
          specificationName: item.specificationName,
          specificationValue: item.specificationValue,
        });
      }
    });

    // Cập nhật thông tin tồn kho cho từng màu sắc và kích thước
    const variants = [];
    Object.entries(groupedBySize).forEach(([size, items]) => {
      items.forEach((item) => {
        variants.push({
          size: size,
          color: item.color,
          count: item.count || 0,
        });
      });
    });

    console.log("Specifications:", specifications);
    console.log("Variants:", variants);

    // Gửi cả hai bộ dữ liệu
    const payload = {
      specifications: specifications,
      variants: variants,
    };

    axios
      .post(`/api/v1/products/updateSpecifications/${id}`, payload)
      .then(function (response) {
        console.log("Kết quả cập nhật:", response.data);
        setModal(false);
        Swal.fire({
          title: "Thành công",
          text: "Đã cập nhật thông số kỹ thuật và số lượng",
          icon: "success",
        });
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
          icon: "error",
        });
      });
  };

  // Cập nhật hàm để thay đổi số lượng cho từng màu riêng biệt
  const handleCountChange = (sizeIndex, colorIndex, value) => {
    const updatedSpec = [...spec];
    // Tìm vị trí trong mảng spec ban đầu
    let foundIndex = -1;
    let currentSizeCount = 0;
    let currentColorCount = 0;

    for (let i = 0; i < updatedSpec.length; i++) {
      if (updatedSpec[i].size === Object.keys(groupedBySize)[sizeIndex]) {
        currentSizeCount++;
        if (currentSizeCount === colorIndex + 1) {
          foundIndex = i;
          break;
        }
      }
    }

    if (foundIndex !== -1) {
      updatedSpec[foundIndex].count = value;
      setSpec(updatedSpec);
    }
  };

  const toggleModal = () => {
    setModal(false);
  };

  return (
    <Modal open={modal} onClose={toggleModal}>
      <Box sx={[style, { width: 400, bgcolor: "white", p: 0 }]}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "600", textAlign: "center" }}
          >
            Mẫu mã
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 500, overflow: "auto" }}>
          {groupedBySize && typeof groupedBySize === "object" ? (
            <>
              {Object.entries(groupedBySize).map(([size, items], sizeIndex) => (
                <Box key={size}>
                  <Typography
                    variant="subtitle1"
                    sx={{ px: 3, py: 1.5, fontWeight: "500" }}
                  >
                    Size: {size}
                  </Typography>
                  {items.map((item, colorIndex) => (
                    <Box key={colorIndex} sx={{ px: 3, py: 1, mb: 2 }}>
                      <Stack direction="row" sx={{ mb: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ width: 100, color: "#5f5f5f" }}
                        >
                          Màu sắc:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "500" }}>
                          {item.color}
                        </Typography>
                      </Stack>
                      <Stack direction="row">
                        <Typography
                          variant="body2"
                          sx={{ width: 100, color: "#5f5f5f" }}
                        >
                          Số lượng:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            width: 100,
                            color: "black",
                          }}
                        >
                          {item.count || ""}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              ))}

              <Box sx={{ px: 3, py: 2, borderTop: "1px solid #e0e0e0", mt: 2 }}>
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "600", mr: 2 }}
                  >
                    Tổng số lượng:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "600", color: "#1976d2" }}
                  >
                    {Object.values(groupedBySize)
                      .flat()
                      .reduce(
                        (sum, item) => sum + (parseInt(item.count) || 0),
                        0
                      )}
                  </Typography>
                </Stack>
              </Box>
            </>
          ) : null}
        </Box>

        <Box
          sx={{
            p: 1,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
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
};

export default ModalTk;
