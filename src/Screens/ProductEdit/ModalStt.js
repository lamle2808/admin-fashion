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
  const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0]);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Tạo loadProductVariants bằng useCallback để có thể dùng làm dependency trong useEffect
  const loadProductVariants = useCallback(() => {
    setIsLoading(true);
    axios
      .get(`/api/v1/products/getById/${id}`)
      .then((response) => {
        const product = response.data;
        
        // Tìm thông số kỹ thuật size và màu
        const specs = product.specifications || [];
        
        const sizeSpec = specs.find(spec => spec.specificationName === "Kích thước");
        const colorSpec = specs.find(spec => spec.specificationName === "Màu sắc");
        
        let sizes = [];
        let colors = [];
        
        if (sizeSpec && sizeSpec.specificationValue) {
          sizes = sizeSpec.specificationValue.split(',').map(s => s.trim());
        }
        
        if (colorSpec && colorSpec.specificationValue) {
          colors = colorSpec.specificationValue.split(',').map(c => c.trim());
        }
        
        // Tạo danh sách biến thể từ size và màu
        if (sizes.length > 0 && colors.length > 0) {
          const productVariants = [];
          
          sizes.forEach(size => {
            colors.forEach(color => {
              productVariants.push({
                size,
                color,
                quantity: 0,
                price: product.price || 0,
                sku: `${id}-${size}-${color.replace(/\s+/g, '')}`,
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
            }
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
      // Lấy danh sách nhà cung cấp
      setIsLoading(true);
      Promise.all([
        axios.get("/api/v1/suppliers/getAll"),
        // Các API khác nếu cần
      ])
        .then(([suppliersResponse]) => {
          setSuppliers(suppliersResponse.data);
          // Lấy thông tin sản phẩm và biến thể
          loadProductVariants();
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu:", error);
          Swal.fire({
            title: "Lỗi",
            text: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
            icon: "error",
          });
          setIsLoading(false);
        });
    }
  }, [modal, loadProductVariants]);

  // Hàm cập nhật số lượng nhập cho biến thể
  const handleQuantityChange = (index, value) => {
    const parsedValue = parseInt(value) || 0;
    const updatedVariants = [...variants];
    updatedVariants[index].quantity = parsedValue;
    setVariants(updatedVariants);
    
    // Cập nhật tổng số lượng
    const newTotal = updatedVariants.reduce((sum, variant) => sum + variant.quantity, 0);
    setTotalQuantity(newTotal);
  };

  // Hàm cập nhật giá nhập cho biến thể
  const handlePriceChange = (index, value) => {
    const parsedValue = parseFloat(value) || 0;
    const updatedVariants = [...variants];
    updatedVariants[index].price = parsedValue;
    setVariants(updatedVariants);
  };

  // Hàm thực hiện nhập kho
  const handleImport = () => {
    if (!selectedSupplier) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng chọn nhà cung cấp",
        icon: "error",
      });
      return;
    }

    if (!invoiceNumber) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng nhập số hóa đơn nhập hàng",
        icon: "error",
      });
      return;
    }

    const totalImportQuantity = variants.reduce((sum, variant) => sum + variant.quantity, 0);
    if (totalImportQuantity <= 0) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng nhập số lượng cho ít nhất một biến thể",
        icon: "error",
      });
      return;
    }

    setIsImporting(true);

    // Dữ liệu nhập kho
    const importData = {
      productId: id,
      supplierId: selectedSupplier,
      invoiceNumber: invoiceNumber,
      importDate: importDate,
      variants: variants.filter(v => v.quantity > 0).map(v => ({
        size: v.size,
        color: v.color,
        quantity: v.quantity,
        price: v.price,
        sku: v.sku
      })),
      totalQuantity: totalImportQuantity
    };

    console.log("Dữ liệu gửi đi:", importData);

    // Gọi API nhập kho
    axios
      .post("/api/v1/import-orders/create", importData)
      .then((response) => {
        console.log("Kết quả nhập kho:", response.data);
        setIsImporting(false);
        Swal.fire({
          title: "Thành công",
          text: "Đã nhập kho thành công",
          icon: "success",
        });
        setModal(false);
      })
      .catch((error) => {
        setIsImporting(false);
        console.error("Lỗi khi nhập kho:", error);
        let errorMessage = "Không thể nhập kho. Vui lòng thử lại sau.";
        
        if (error.response) {
          console.error("Chi tiết lỗi:", error.response.data);
          if (error.response.data && typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          }
        }
        
        Swal.fire({
          title: "Lỗi",
          text: errorMessage,
          icon: "error",
        });
      });
  };

  return (
    <Modal open={modal} onClose={() => !isImporting && setModal(false)}>
      <Box sx={[style, { width: 800, maxHeight: "90vh", overflow: "auto" }]}>
        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
          Nhập kho sản phẩm #{id}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Thông tin nhập kho */}
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Nhà cung cấp</InputLabel>
                <Select
                  value={selectedSupplier}
                  label="Nhà cung cấp"
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  disabled={isImporting}
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Số hóa đơn"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                fullWidth
                disabled={isImporting}
              />

              <TextField
                label="Ngày nhập"
                type="date"
                value={importDate}
                onChange={(e) => setImportDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={isImporting}
              />
            </Stack>

            {/* Bảng biến thể nhập kho */}
            <Typography variant="h6">Biến thể sản phẩm</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Màu sắc</TableCell>
                    <TableCell>Mã SKU</TableCell>
                    <TableCell>Số lượng nhập</TableCell>
                    <TableCell>Giá nhập (VNĐ)</TableCell>
                    <TableCell>Thành tiền (VNĐ)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {variants.map((variant, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>{variant.color}</TableCell>
                      <TableCell>{variant.sku}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={variant.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          inputProps={{ min: 0 }}
                          disabled={isImporting}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={variant.price}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          inputProps={{ min: 0 }}
                          disabled={isImporting}
                          sx={{ width: 120 }}
                        />
                      </TableCell>
                      <TableCell>
                        {(variant.quantity * variant.price).toLocaleString('vi-VN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Tổng số lượng và tổng tiền */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6">
                Tổng số lượng: {totalQuantity}
              </Typography>
              <Typography variant="h6">
                Tổng tiền: {variants.reduce((sum, v) => sum + v.quantity * v.price, 0).toLocaleString('vi-VN')} VNĐ
              </Typography>
            </Box>

            {/* Nút lưu */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setModal(false)}
                disabled={isImporting}
                sx={{ minWidth: 120 }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleImport}
                disabled={isImporting}
                sx={{ minWidth: 120 }}
              >
                {isImporting ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Đang lưu...
                  </>
                ) : (
                  "Nhập kho"
                )}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Modal>
  );
}

export default ModalStt;
