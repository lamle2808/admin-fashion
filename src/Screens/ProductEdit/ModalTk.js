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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Modal from '@mui/material/Modal';
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
  // State cho các thông số kỹ thuật
  const [uniqueSpecs, setUniqueSpecs] = useState([]);
  const [groupedSpecs, setGroupedSpecs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // State cho thông tin thêm mới
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newSpecInputVisible, setNewSpecInputVisible] = useState(false);
  
  // State cho thêm giá trị cho size và color
  const [newSizeValue, setNewSizeValue] = useState("");
  const [newColorValue, setNewColorValue] = useState("");

  // Khởi tạo và xử lý thông số kỹ thuật
  useEffect(() => {
    if (spec && Array.isArray(spec)) {
      // Loại bỏ các thông số trùng lặp bằng cách sử dụng Map
      const uniqueSpecsMap = new Map();
      
      // Nhóm các thông số đặc biệt (size và color)
      const grouped = {};

      // Xử lý thông số ban đầu
      spec.forEach((item) => {
        if (item && item.specificationName) {
          // Xử lý riêng kích thước và màu sắc
          if (['Kích thước', 'Màu sắc'].includes(item.specificationName)) {
            if (!grouped[item.specificationName]) {
              grouped[item.specificationName] = new Set();
            }
            
            // Nếu giá trị chứa dấu phẩy, tách thành các giá trị riêng
            if (item.specificationValue && item.specificationValue.includes(',')) {
              item.specificationValue.split(',').forEach(val => {
                if (val.trim()) grouped[item.specificationName].add(val.trim());
              });
            } else if (item.specificationValue) {
              grouped[item.specificationName].add(item.specificationValue);
            }
          } else {
            // Với các trường thông thường, sử dụng Map để loại bỏ trùng lặp
            uniqueSpecsMap.set(item.specificationName, item);
          }
        }
      });

      // Chuyển đổi từ Map sang Array cho các thông số thông thường
      setUniqueSpecs(Array.from(uniqueSpecsMap.values()));
      
      // Chuyển đổi từ Set sang Array cho các trường đặc biệt
      const processedGrouped = {};
      Object.keys(grouped).forEach(key => {
        processedGrouped[key] = Array.from(grouped[key]);
      });
      setGroupedSpecs(processedGrouped);
    } else {
      setUniqueSpecs([]);
      setGroupedSpecs({});
    }
  }, [spec]);

  const handleClose = () => {
    setModal(false);
  };

  // Xử lý khi thay đổi giá trị thông số
  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...uniqueSpecs];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value,
    };
    setUniqueSpecs(updatedSpecs);
  };

  // Xóa thông số kỹ thuật
  const handleDeleteSpecification = (index) => {
    const updatedSpecs = [...uniqueSpecs];
    updatedSpecs.splice(index, 1);
    setUniqueSpecs(updatedSpecs);
  };

  // Thêm thông số kỹ thuật mới
  const handleAddSpecification = () => {
    if (newName && newValue) {
      // Kiểm tra nếu đây là thông số đặc biệt (kích thước hoặc màu sắc)
      if (['Kích thước', 'Màu sắc'].includes(newName)) {
        // Cập nhật trường đặc biệt
        const updatedGrouped = { ...groupedSpecs };
        if (!updatedGrouped[newName]) {
          updatedGrouped[newName] = [];
        }
        updatedGrouped[newName].push(newValue);
        setGroupedSpecs(updatedGrouped);
      } else {
        // Kiểm tra xem thông số này đã tồn tại chưa
        const existingSpecIndex = uniqueSpecs.findIndex(
          (spec) => spec.specificationName.toLowerCase() === newName.toLowerCase()
        );
        
        if (existingSpecIndex >= 0) {
          // Cập nhật thông số đã tồn tại
          const updatedSpecs = [...uniqueSpecs];
          updatedSpecs[existingSpecIndex].specificationValue = newValue;
          setUniqueSpecs(updatedSpecs);
        } else {
          // Thêm thông số mới
          setUniqueSpecs([
            ...uniqueSpecs,
            {
              specificationName: newName,
              specificationValue: newValue,
            },
          ]);
        }
      }
      
      // Reset form
      setNewName("");
      setNewValue("");
      setNewSpecInputVisible(false);
    }
  };

  // Thêm giá trị mới cho kích thước
  const handleAddSize = () => {
    if (newSizeValue.trim()) {
      const updatedGrouped = { ...groupedSpecs };
      if (!updatedGrouped['Kích thước']) {
        updatedGrouped['Kích thước'] = [];
      }
      // Kiểm tra nếu giá trị đã tồn tại
      if (!updatedGrouped['Kích thước'].includes(newSizeValue.trim())) {
        updatedGrouped['Kích thước'].push(newSizeValue.trim());
        setGroupedSpecs(updatedGrouped);
      }
      setNewSizeValue("");
    }
  };

  // Thêm giá trị mới cho màu sắc
  const handleAddColor = () => {
    if (newColorValue.trim()) {
      const updatedGrouped = { ...groupedSpecs };
      if (!updatedGrouped['Màu sắc']) {
        updatedGrouped['Màu sắc'] = [];
      }
      // Kiểm tra nếu giá trị đã tồn tại
      if (!updatedGrouped['Màu sắc'].includes(newColorValue.trim())) {
        updatedGrouped['Màu sắc'].push(newColorValue.trim());
        setGroupedSpecs(updatedGrouped);
      }
      setNewColorValue("");
    }
  };

  // Xóa giá trị khỏi trường đặc biệt
  const handleDeleteSpecialValue = (type, value) => {
    if (groupedSpecs[type]) {
      const updatedGrouped = { ...groupedSpecs };
      updatedGrouped[type] = updatedGrouped[type].filter(val => val !== value);
      setGroupedSpecs(updatedGrouped);
    }
  };

  // Lưu thông số kỹ thuật
  const handleSaveSpecifications = () => {
    setIsLoading(true);
    
    // Kết hợp các thông số thông thường và đặc biệt
    const allSpecs = [...uniqueSpecs];
    
    // Thêm các trường đặc biệt
    Object.entries(groupedSpecs).forEach(([name, values]) => {
      if (values && values.length > 0) {
        // Loại bỏ thông số cũ nếu đã tồn tại
        const existingIndex = allSpecs.findIndex(spec => spec.specificationName === name);
        if (existingIndex >= 0) {
          allSpecs.splice(existingIndex, 1);
        }
        
        // Thêm thông số mới
        allSpecs.push({
          specificationName: name,
          specificationValue: values.join(', ')
        });
      }
    });
    
    console.log("Thông số sẽ lưu:", allSpecs);
    
    // Gọi API để xóa hết thông số cũ trước rồi thêm mới hoàn toàn
    // Cách này đơn giản và đảm bảo không có thông số trùng lặp
    axios
      .delete(`/api/v1/productSpecifications/deleteAll/${id}`)
      .then(() => {
        // Sau khi xóa thành công, thêm thông số mới
        return axios.post(`/api/v1/productSpecifications/updateList/${id}`, allSpecs);
      })
      .then((response) => {
        console.log("Thông số kỹ thuật đã cập nhật:", response.data);
        
        // Cập nhật state trong component cha với thông số mới
        setSpec(allSpecs);
        setIsLoading(false);
        
        // Đóng modal
        setModal(false);
        Swal.fire({
          title: "Thành công",
          text: "Đã cập nhật thông số kỹ thuật",
          icon: "success",
        }).then(() => {
          // Reload trang sau khi cập nhật thành công để hiển thị đúng
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật thông số:", error);
        setIsLoading(false);
        
        let errorMessage = "Không thể cập nhật thông số kỹ thuật. Vui lòng thử lại sau.";
        if (error.response && error.response.data) {
          errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : "Lỗi máy chủ khi cập nhật thông số kỹ thuật";
        }
        
        Swal.fire({
          title: "Lỗi",
          text: errorMessage,
          icon: "error",
        });
      });
  };

  return (
    <Modal
      open={modal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Thông số kỹ thuật
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>Đang xử lý...</Typography>
          </Box>
        ) : (
          <Box>
            {/* Hiển thị các trường đặc biệt */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Các trường đặc biệt
              </Typography>
              
              {/* Kích thước */}
              <Box mb={3}>
                <Typography variant="body1" sx={{ mb: 1 }}>Kích thước:</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                  {(groupedSpecs['Kích thước'] || []).map((size, index) => (
                    <Chip
                      key={`size-${index}`}
                      label={size}
                      onDelete={() => handleDeleteSpecialValue('Kích thước', size)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    label="Thêm kích thước"
                    value={newSizeValue}
                    onChange={(e) => setNewSizeValue(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddSize}
                    disabled={!newSizeValue.trim()}
                  >
                    Thêm
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Màu sắc */}
              <Box mb={2}>
                <Typography variant="body1" sx={{ mb: 1 }}>Màu sắc:</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                  {(groupedSpecs['Màu sắc'] || []).map((color, index) => (
                    <Chip
                      key={`color-${index}`}
                      label={color}
                      onDelete={() => handleDeleteSpecialValue('Màu sắc', color)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box display="flex" gap={1}>
                  <TextField
                    label="Thêm màu sắc"
                    value={newColorValue}
                    onChange={(e) => setNewColorValue(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddColor}
                    disabled={!newColorValue.trim()}
                    color="secondary"
                  >
                    Thêm
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Hiển thị các thông số kỹ thuật thông thường */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Thông số kỹ thuật khác
              </Typography>
              
              {uniqueSpecs.map((spec, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Tên thông số"
                      value={spec.specificationName}
                      onChange={(e) => handleSpecificationChange(index, "specificationName", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Giá trị"
                      value={spec.specificationValue}
                      onChange={(e) => handleSpecificationChange(index, "specificationValue", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={1} display="flex" alignItems="center">
                    <IconButton onClick={() => handleDeleteSpecification(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              {/* Form thêm thông số mới */}
              {newSpecInputVisible ? (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Tên thông số"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Giá trị"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={1} display="flex" alignItems="center">
                    <IconButton onClick={handleAddSpecification} color="success">
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setNewSpecInputVisible(true)}
                  sx={{ mt: 1 }}
                >
                  Thêm thông số
                </Button>
              )}
            </Paper>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleClose}>
                Hủy
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSaveSpecifications}
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : "Lưu thông số"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalTk;
