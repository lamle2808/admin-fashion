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
  const [currentStatus, setCurrentStatus] = useState(1); // Mặc định đang bán nếu có lô hàng
  const [batchCode, setBatchCode] = useState("");

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

  useEffect(() => {
    if (modal) {
      setIsLoading(true);
      // Lấy trạng thái hiện tại của sản phẩm
      axios.get(`/api/v1/products/getById/${id}`)
        .then(response => {
          const product = response.data;
          console.log("Product data:", product);
          
          // Kiểm tra nếu có lô hàng thì sản phẩm đang bán
          if (product.loHang) {
            setCurrentStatus(1); // Đang bán
            setBatchCode(product.loHang.id);
          } else {
            setCurrentStatus(0); // Chưa mở bán
          }
          
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
          setIsLoading(false);
        });
    }
  }, [modal, id]);

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

  const handleSetStatus = async () => {
    setIsLoading(true);
    try {
      // Lấy mã lô hàng mới
      const res = await axios.get('/api/v1/loHangs/randomId');
      const newBatchCode = res.data;
      // Tạo object lô hàng mới
      const loHang = {
        id: newBatchCode,
        status: 1,
        product: { id: id },
      };
      await axios.post('/api/v1/loHangs/saveOrUpdate', loHang);
      
      // Cập nhật trạng thái hiển thị
      setCurrentStatus(1);
      setBatchCode(newBatchCode);
      
      setIsLoading(false);
      Swal.fire({
        title: 'Thành công',
        text: 'Đã mở bán sản phẩm',
        icon: 'success',
      });
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        title: 'Lỗi',
        text: 'Không thể cập nhật trạng thái sản phẩm',
        icon: 'error',
      });
    }
  };

  return (
    <Modal 
      open={modal} 
      onClose={() => !isLoading && setModal(false)}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 1
        }}
      >
        <Typography 
          variant="h6"
          sx={{ 
            textAlign: "center",
            fontSize: 16,
            fontWeight: 500,
            p: 2.5
          }}
        >
          Trạng thái sản phẩm
        </Typography>
        
        <Box sx={{ px: 3 }}>
          <Typography 
            variant="body1"
            sx={{ 
              textAlign: "center",
              fontSize: 15
            }}
          >
            Trạng thái hiện tại: Đang bán
          </Typography>
          
          <Typography 
            variant="body2"
            sx={{ 
              textAlign: "center", 
              fontSize: 14, 
              color: "text.secondary", 
              mt: 1
            }}
          >
            Mã lô hàng: {batchCode || "LH5936"}
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            width: "100%", 
            display: "flex", 
            justifyContent: "center", 
            mt: 3, 
            p: 2 
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
