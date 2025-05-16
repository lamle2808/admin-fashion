import {
  Box,
  Button,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { style } from "../../Component/Style";
import axios from "axios";
import Swal from "sweetalert2";

function ModalStt({ setModal, modal, id }) {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [variants, setVariants] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [importDate, setImportDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(""); // Mặc định đang bán nếu có lô hàng

  // Tạo loadProductVariants bằng useCallback để có thể dùng làm dependency trong useEffect
  const loadProductVariants = useCallback(() => {
    setIsLoading(true);
    axios
      .get(`/api/v1/products/getById/${id}`)
      .then((response) => {
        const product = response.data;

        // Tìm thông số kỹ thuật size và màu
        const specs = product.specifications || [];

        const sizeSpec = specs.find(
          (spec) => spec.specificationName === "Kích thước"
        );
        const colorSpec = specs.find(
          (spec) => spec.specificationName === "Màu sắc"
        );

        let sizes = [];
        let colors = [];

        if (sizeSpec && sizeSpec.specificationValue) {
          sizes = sizeSpec.specificationValue.split(",").map((s) => s.trim());
        }

        if (colorSpec && colorSpec.specificationValue) {
          colors = colorSpec.specificationValue.split(",").map((c) => c.trim());
        }

        // Tạo danh sách biến thể từ size và màu
        if (sizes.length > 0 && colors.length > 0) {
          const productVariants = [];

          sizes.forEach((size) => {
            colors.forEach((color) => {
              productVariants.push({
                size,
                color,
                quantity: 0,
                price: product.price || 0,
                sku: `${id}-${size}-${color.replace(/\s+/g, "")}`,
              });
            });
          });

          setVariants(productVariants);
        } else {
          // Nếu không có size hoặc màu, tạo một biến thể mặc định
          setVariants([
            {
              size: "Mặc định",
              color: "Mặc định",
              quantity: 0,
              price: product.price || 0,
              sku: `${id}-default`,
            },
          ]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.",
          icon: "error",
        });
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (modal) {
      setIsLoading(true);
      // Lấy trạng thái hiện tại của sản phẩm
      axios
        .get(`/api/v1/products/getById/${id}`)
        .then((response) => {
          const product = response.data;
          console.log("Product data:", product);
          axios
            .get(`/api/v1/loHangs/getByProduct/${id}`)
            .then((response) => {
              setSuppliers(response.data);
            })
            .catch((error) => {
              console.error("Lỗi khi lấy thông tin sản phẩm:", error);
              setIsLoading(false);
            });

          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
          setIsLoading(false);
        });
    }
  }, [modal, id]);

  // Hàm thực hiện nhập kho

  const handleSetStatus = async (id) => {
    setIsLoading(true);
    try {
      await axios.post(`/api/v1/loHangs/saveOrUpdate`, {
        id: id,
        status: 1,
      });
      // Cập nhật trạng thái hiển thị

      setIsLoading(false);
      setModal(false);
      Swal.fire({
        title: "Thành công",
        text: "Đã mở bán sản phẩm",
        icon: "success",
      });
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể cập nhật trạng thái sản phẩm",
        icon: "error",
      });
    }
  };
  console.log(suppliers);

  return (
    <Modal open={modal} onClose={() => !isLoading && setModal(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 500,
            p: 2.5,
          }}
        >
          Trạng thái sản phẩm
        </Typography>

        <Box sx={{ px: 3 }}>
          <Typography>
            {suppliers.map((item, index) => (
              <Stack
                key={index}
                direction={"row"}
                sx={{
                  justifyContent: "space-between",
                  marginTop: "10px",
                  background: "lightgray",
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid gray",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h5">{item.id}</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleSetStatus(item.id)}
                >
                  Chọn
                </Button>
              </Stack>
            ))}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 3,
            p: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setModal(false)}
            sx={{
              borderRadius: 0,
              py: 1.5,
              width: "100%",
              fontSize: 15,
              textTransform: "none",
              fontWeight: 500,
              bgcolor: "#2196f3",
              "&:hover": { bgcolor: "#1976d2" },
            }}
          >
            ĐÓNG
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalStt;
