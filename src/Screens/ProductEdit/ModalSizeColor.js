import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import Swal from "sweetalert2";

function ModalSizeColor({ open, handleClose, productId, productName }) {
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && productId) {
      fetchProductVariants();
    }
  }, [open, productId]);

  const fetchProductVariants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/products/getById/${productId}`);
      const productData = response.data;
      
      // Trích xuất sizes và colors từ specifications
      const specs = productData.specifications || [];
      let extractedSizes = [];
      let extractedColors = [];
      
      specs.forEach(spec => {
        if (spec.specificationName === "Kích thước" && spec.specificationValue) {
          extractedSizes = spec.specificationValue.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (spec.specificationName === "Màu sắc" && spec.specificationValue) {
          extractedColors = spec.specificationValue.split(',').map(c => c.trim()).filter(Boolean);
        }
      });
      
      setSizes(extractedSizes);
      setColors(extractedColors);
      
      // Tạo danh sách variants từ tổ hợp size và color
      const variantList = [];
      extractedSizes.forEach(size => {
        extractedColors.forEach(color => {
          variantList.push({
            size,
            color,
            sku: `${productId}-${size}-${color}`.replace(/\s+/g, '-')
          });
        });
      });
      
      setVariants(variantList);
    } catch (error) {
      console.error("Error fetching product variants:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể tải thông tin sản phẩm",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    
    // Kiểm tra nếu size đã tồn tại
    if (sizes.includes(newSize.trim())) {
      Swal.fire({
        title: "Cảnh báo",
        text: "Kích thước này đã tồn tại",
        icon: "warning"
      });
      return;
    }
    
    // Thêm size mới và cập nhật variants
    const updatedSizes = [...sizes, newSize.trim()];
    setSizes(updatedSizes);
    
    // Tạo variants mới cho size vừa thêm
    const newVariants = [...variants];
    colors.forEach(color => {
      newVariants.push({
        size: newSize.trim(),
        color,
        sku: `${productId}-${newSize.trim()}-${color}`.replace(/\s+/g, '-')
      });
    });
    
    setVariants(newVariants);
    setNewSize("");
  };

  const handleAddColor = () => {
    if (!newColor.trim()) return;
    
    // Kiểm tra nếu màu đã tồn tại
    if (colors.includes(newColor.trim())) {
      Swal.fire({
        title: "Cảnh báo",
        text: "Màu sắc này đã tồn tại",
        icon: "warning"
      });
      return;
    }
    
    // Thêm màu mới và cập nhật variants
    const updatedColors = [...colors, newColor.trim()];
    setColors(updatedColors);
    
    // Tạo variants mới cho màu vừa thêm
    const newVariants = [...variants];
    sizes.forEach(size => {
      newVariants.push({
        size,
        color: newColor.trim(),
        sku: `${productId}-${size}-${newColor.trim()}`.replace(/\s+/g, '-')
      });
    });
    
    setVariants(newVariants);
    setNewColor("");
  };

  const handleDeleteSize = (sizeToDelete) => {
    // Xóa size và cập nhật variants
    setSizes(sizes.filter(size => size !== sizeToDelete));
    setVariants(variants.filter(variant => variant.size !== sizeToDelete));
  };

  const handleDeleteColor = (colorToDelete) => {
    // Xóa màu và cập nhật variants
    setColors(colors.filter(color => color !== colorToDelete));
    setVariants(variants.filter(variant => variant.color !== colorToDelete));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Cập nhật thông số kỹ thuật của sản phẩm
      await axios.post(`/api/v1/products/updateSpecifications/${productId}`, {
        specifications: [
          {
            specificationName: "Kích thước",
            specificationValue: sizes.join(", ")
          },
          {
            specificationName: "Màu sắc",
            specificationValue: colors.join(", ")
          }
        ]
      });
      
      Swal.fire({
        title: "Thành công",
        text: "Đã cập nhật size và màu sắc cho sản phẩm",
        icon: "success"
      });
      
      handleClose();
    } catch (error) {
      console.error("Error saving size and color:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể cập nhật thông tin sản phẩm",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        px: 3,
        py: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Quản lý Size và Màu sắc - {productName}
        </Typography>
        <IconButton onClick={handleClose} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Quản lý kích thước */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Kích thước
              </Typography>
              
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  size="small"
                  label="Kích thước mới"
                  variant="outlined"
                  fullWidth
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                />
                <Button 
                  variant="contained" 
                  sx={{ ml: 1, minWidth: 'auto', px: 2 }}
                  onClick={handleAddSize}
                >
                  <AddIcon />
                </Button>
              </Box>
              
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1,
                minHeight: 100,
                maxHeight: 300,
                overflow: 'auto'
              }}>
                {sizes.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {sizes.map((size, index) => (
                      <Chip
                        key={index}
                        label={size}
                        onDelete={() => handleDeleteSize(size)}
                        sx={{ m: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" align="center">
                    Chưa có kích thước nào
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
          
          {/* Quản lý màu sắc */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Màu sắc
              </Typography>
              
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  size="small"
                  label="Màu sắc mới"
                  variant="outlined"
                  fullWidth
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                />
                <Button 
                  variant="contained" 
                  sx={{ ml: 1, minWidth: 'auto', px: 2 }}
                  onClick={handleAddColor}
                >
                  <AddIcon />
                </Button>
              </Box>
              
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1,
                minHeight: 100,
                maxHeight: 300,
                overflow: 'auto'
              }}>
                {colors.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {colors.map((color, index) => (
                      <Chip
                        key={index}
                        label={color}
                        onDelete={() => handleDeleteColor(color)}
                        sx={{ m: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" align="center">
                    Chưa có màu sắc nào
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
          
          {/* Danh sách biến thể */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Biến thể sản phẩm
              </Typography>
              
              <TableContainer sx={{ mt: 2, maxHeight: 300 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width={60}>#</TableCell>
                      <TableCell>Kích thước</TableCell>
                      <TableCell>Màu sắc</TableCell>
                      <TableCell>Mã SKU</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variants.length > 0 ? (
                      variants.map((variant, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{variant.size}</TableCell>
                          <TableCell>{variant.color}</TableCell>
                          <TableCell>{variant.sku}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary">
                            Chưa có biến thể nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  * Biến thể sẽ được tạo tự động từ tổ hợp kích thước và màu sắc
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  * Quản lý số lượng hàng tồn kho được thực hiện qua phần Nhập hàng
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalSizeColor; 