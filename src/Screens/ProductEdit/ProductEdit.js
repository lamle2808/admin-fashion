import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import Header from "../../Component/Header";
import Left from "../../Component/Left";
import { TextInputAd, StylePaper, StyledFormControl, FormButton } from "../../Component/Style";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ModalDes from "./ModalDes";
import ModalTk from "./ModalTk";
import Quill from "quill";
import ImageResize from "quill-image-resize";
import ModalStt from "./ModalStt";
import ModalSizeColor from "./ModalSizeColor";

Quill.register("modules/imageResize", ImageResize);

function ProductEdit() {
  const [show, setShow] = useState(false);
  const [imageP, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loai, setLoai] = useState("");
  const [loais, setLoais] = useState([]);
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [spec, setSpec] = useState("");
  const [checkQ, setCheckQ] = useState(false);
  const [modalDes, setModalDes] = useState(false);
  const [modalTk, setModalTk] = useState(false);
  const [modalStt, setModalStt] = useState(false);
  const [choose, setChoose] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [variantDialog, setVariantDialog] = useState(false);
  const [variantStock, setVariantStock] = useState([]);
  const [openSizeColorModal, setOpenSizeColorModal] = useState(false);
  const id = useParams();
  const navigate = useNavigate();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // Tạo hàm generateVariantStock bằng useCallback để sử dụng trong useEffect
  const generateVariantStock = useCallback((sizeList, colorList) => {
    if (sizeList.length === 0 || colorList.length === 0) {
      setVariantStock([]);
      return;
    }
    
    // Tạo danh sách biến thể dựa trên tổ hợp size và màu
    const variants = [];
    
    sizeList.forEach(size => {
      colorList.forEach(color => {
        variants.push({
          size,
          color,
          sku: `${id.id}-${size}-${color.replace(/\s+/g, '')}`
        });
      });
    });
    
    // Cập nhật danh sách tồn kho biến thể
    setVariantStock(variants);
  }, [id.id]);

  useEffect(() => {
    axios
      .get(`/api/v1/loHangs/getByProduct/${id.id}`)
      .then(function (response) {
        response.data.map((item) => {
          if (item.status === 1) {
            setChoose(item.id);
          }
          return "";
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get("/api/v1/brands/getAllBrand")
      .then(function (response) {
        setBrands(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get("/api/v1/category/getAll")
      .then(function (response) {
        setLoais(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Tải lại thông tin sản phẩm
    loadProductData();
  }, [id.id, generateVariantStock]);

  // Hàm tải thông tin sản phẩm
  const loadProductData = () => {
    axios
      .get(`/api/v1/products/getById/${id.id}`)
      .then(function (response) {
        console.log("Dữ liệu sản phẩm ban đầu:", response.data);
        setImage(response.data.imageProducts || []);
        setName(response.data.productName || "");
        setQuantity(response.data.quantity || "");
        setBrand(response.data.brand?.id || "");
        setDescription(response.data.description || "");
        setPrice(response.data.price || "");
        setLoai(response.data.category?.id || "");
        
        // Lấy thông số kỹ thuật từ backend
        if (response.data.specifications && Array.isArray(response.data.specifications)) {
          setSpec(response.data.specifications);
          
          // Tìm thông số kỹ thuật cho size và màu sắc
          const sizeSpec = response.data.specifications.find(
            spec => spec.specificationName === "Kích thước"
          );
          
          const colorSpec = response.data.specifications.find(
            spec => spec.specificationName === "Màu sắc"
          );
          
          // Phân tích giá trị size và màu từ thông số kỹ thuật
          if (sizeSpec && sizeSpec.specificationValue) {
            setSizes(sizeSpec.specificationValue.split(',').map(s => s.trim()));
          }
          
          if (colorSpec && colorSpec.specificationValue) {
            setColors(colorSpec.specificationValue.split(',').map(c => c.trim()));
          }
          
          // Tạo bảng tồn kho biến thể dựa trên size và màu
          generateVariantStock(
            sizeSpec ? sizeSpec.specificationValue.split(',').map(s => s.trim()) : [],
            colorSpec ? colorSpec.specificationValue.split(',').map(c => c.trim()) : []
          );
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Hàm thêm size mới
  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      const updatedSizes = [...sizes, newSize];
      setSizes(updatedSizes);
      setNewSize("");
      
      // Cập nhật bảng tồn kho biến thể
      generateVariantStock(updatedSizes, colors);
    }
  };

  // Hàm thêm màu mới
  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      const updatedColors = [...colors, newColor];
      setColors(updatedColors);
      setNewColor("");
      
      // Cập nhật bảng tồn kho biến thể
      generateVariantStock(sizes, updatedColors);
    }
  };

  // Hàm xóa size
  const handleDeleteSize = (sizeToDelete) => {
    const updatedSizes = sizes.filter(size => size !== sizeToDelete);
    setSizes(updatedSizes);
    
    // Cập nhật bảng tồn kho biến thể
    generateVariantStock(updatedSizes, colors);
  };

  // Hàm xóa màu
  const handleDeleteColor = (colorToDelete) => {
    const updatedColors = colors.filter(color => color !== colorToDelete);
    setColors(updatedColors);
    
    // Cập nhật bảng tồn kho biến thể
    generateVariantStock(sizes, updatedColors);
  };

  // Hàm cập nhật số lượng tồn kho cho biến thể
  const handleStockChange = (index, newValue) => {
    const updatedStock = [...variantStock];
    updatedStock[index].stock = parseInt(newValue) || 0;
    setVariantStock(updatedStock);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Hiển thị thông tin đang gửi lên server để debug
    console.log("Dữ liệu gửi lên server:", {
      id: id.id,
      productName: name,
      brand: { id: brand },
      description: description,
      price: price,
      category: { id: loai },
    });
    
    // Đồng bộ thông số với server
    const syncSpecificationsWithServer = async () => {
      try {
        console.log("Đồng bộ thông số kỹ thuật với server...");
        
        // Gọi API để cập nhật thông số
        const response = await axios.post(`/api/v1/productSpecifications/updateList/${id.id}`, spec);
        
        console.log("Đồng bộ thành công:", response.data);
        return spec;
      } catch (error) {
        console.error("Lỗi khi đồng bộ thông số kỹ thuật:", error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể cập nhật thông số kỹ thuật. Vui lòng thử lại sau.",
          icon: "error",
        });
        return null;
      }
    };
    
    // Cập nhật sản phẩm lên server
    axios
      .post("/api/v1/products/saveOrUpdate", {
        id: id.id,
        productName: name,
        brand: {
          id: brand,
        },
        description: description,
        price: price,
        category: {
          id: loai,
        },
      })
      .then(function (response) {
        console.log("Cập nhật thông tin cơ bản thành công:", response.data);
        // Sau khi cập nhật thông tin cơ bản, đồng bộ thông số kỹ thuật
        return syncSpecificationsWithServer();
      })
      .then(() => {
        Swal.fire({
          title: "Thành công",
          text: "Đã cập nhật thông tin sản phẩm",
          icon: "success",
        }).then(() => {
          // Tải lại dữ liệu sản phẩm sau khi cập nhật thành công
          loadProductData();
          try {
            // Không chuyển hướng, chỉ hiển thị thông báo
            console.log("Đã cập nhật sản phẩm thành công");
          } catch (error) {
            console.error("Lỗi sau khi cập nhật:", error);
          }
        });
      })
      .catch(function (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        
        // Kiểm tra lỗi cụ thể
        if (error.response) {
          console.error("Chi tiết lỗi:", error.response.data);
          console.error("Mã lỗi:", error.response.status);
        }
        
        Swal.fire({
          title: "Lỗi",
          text: error.response?.data?.message || "Không thể cập nhật sản phẩm. Vui lòng thử lại sau.",
          icon: "error",
        });
      });
  };

  const checkQuantity = (e) => {
    if (e < 0) {
      setCheckQ(true);
    } else {
      setCheckQ(false);
      setQuantity(e);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "category") {
      Swal.fire({
        title: "Xác nhận thay đổi danh mục",
        text: "Thay đổi danh mục sẽ cập nhật các thông số kỹ thuật. Bạn có muốn tiếp tục?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoai(value);
          console.log("Đã cập nhật loại sản phẩm thành:", value);
          
          // Lấy thông số kỹ thuật từ server dựa trên danh mục mới
          axios
            .get(`/api/v1/categories/getById/${value}`)
            .then((response) => {
              const specifications = response.data.specifications || [];
              
              // Chức năng tổ chức thông số thành nhóm
              const groupSpecsByType = (specs) => {
                const grouped = {};
                const specMap = new Map();
                
                specs.forEach(spec => {
                  if (['Kích thước', 'Màu sắc'].includes(spec.specificationName)) {
                    if (!grouped[spec.specificationName]) {
                      grouped[spec.specificationName] = new Set();
                    }
                    // Nếu là trường đặc biệt, tách các giá trị đã được join bằng dấu phẩy
                    if (spec.specificationValue && spec.specificationValue.includes(',')) {
                      spec.specificationValue.split(',').forEach(val => {
                        if (val.trim()) grouped[spec.specificationName].add(val.trim());
                      });
                    } else if (spec.specificationValue) {
                      grouped[spec.specificationName].add(spec.specificationValue);
                    }
                  } else {
                    // Với các trường thông thường, sử dụng Map để lấy giá trị mới nhất
                    specMap.set(spec.specificationName, spec);
                  }
                });
                
                // Chuyển đổi từ Set sang mảng và tạo các thông số mới
                Object.entries(grouped).forEach(([name, values]) => {
                  const valuesArray = Array.from(values);
                  if (valuesArray.length > 0) {
                    specMap.set(name, {
                      specificationName: name,
                      specificationValue: valuesArray.join(', ')
                    });
                  }
                });
                
                return Array.from(specMap.values());
              };
              
              // Giữ lại các thông số size và màu sắc hiện có (nếu có)
              if (spec && Array.isArray(spec)) {
                // Kết hợp thông số hiện có với thông số mới
                const combinedSpecs = [...spec, ...specifications];
                setSpec(groupSpecsByType(combinedSpecs));
              } else {
                setSpec(groupSpecsByType(specifications));
              }
              
              // Log để debug
              console.log("Đã cập nhật thông số kỹ thuật theo danh mục mới");
            })
            .catch((error) => {
              console.error("Lỗi khi lấy thông số kỹ thuật:", error);
              if (error.response) {
                console.error("Chi tiết lỗi:", error.response.data);
              }
            });
        }
      });
    } else {
      // Cập nhật các trường khác
      if (name === "brand") {
        setBrand(value);
      } else if (name === "price") {
        setPrice(value);
      }
      // Thêm các trường khác nếu cần
    }
  };
  
  const handleChange2 = (event) => {
    setBrand(event.target.value);
  };

  const modules = {
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      displaySize: true, // Hiển thị kích thước của hình ảnh
    },
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
    ],
  };

  const handleToggleSizeColorModal = () => {
    setOpenSizeColorModal(!openSizeColorModal);
  };

  const handleDeleteProduct = () => {
    Swal.fire({
      title: 'Bạn có chắc muốn xoá sản phẩm này?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/v1/products/delete_product/${id.id}`);
          Swal.fire('Đã xoá!', 'Sản phẩm đã được xoá thành công.', 'success').then(() => {
            navigate('/Product');
          });
        } catch (error) {
          Swal.fire('Lỗi', 'Không thể xoá sản phẩm', 'error');
        }
      }
    });
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%" }}>
      <ModalDes
        modal={modalDes}
        setModal={setModalDes}
        imageP={imageP}
        setImage={setImage}
        id={id.id}
      />
      <ModalStt modal={modalStt} setModal={setModalStt} id={id.id} />
      {spec !== "" && spec !== null ? (
        <ModalTk
          modal={modalTk}
          setModal={setModalTk}
          spec={spec}
          id={id.id}
          setSpec={setSpec}
        />
      ) : (
        <></>
      )}

      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%", minWidth: "70%" }}>
          <Header setShow={setShow} show={show} />
          <Stack
            direction={"row"}
            gap={3}
            sx={{
              paddingLeft: 3,
              paddingRight: 3,
              height: "90vh",
            }}
          >
            <StylePaper
              sx={{
                flex: 1,
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                backgroundColor: "#F8FAFC",
                height: "90vh",
                overflow: "auto"
              }}
            >
              <Typography variant="h4" fontWeight="600" color="#2c6fbf" mb={3}
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  "&:after": {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '60px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #81C3FF, #2c6fbf)',
                    borderRadius: '10px'
                  }
                }}
              >
                Thông tin sản phẩm #{id.id}
              </Typography>
              <Stack
                direction="row"
                sx={{
                  textAlign: "center",
                  marginTop: 2,
                  marginBottom: 3,
                  backgroundColor: "white",
                  padding: 2,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-around",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  "& > button": {
                    transition: "all 0.3s ease",
                    flexGrow: 1,
                    mx: 1,
                    "&:hover": {
                      flexGrow: 1.1,
                    }
                  }
                }}
              >
                <FormButton 
                  variant="contained" 
                  onClick={() => setModalDes(true)}
                >
                  Hình ảnh
                </FormButton>
                <FormButton 
                  variant="contained" 
                  onClick={() => setModalTk(true)}
                >
                  Thông số kỹ thuật
                </FormButton>
                <FormButton 
                  variant="contained" 
                  color="success" 
                  onClick={() => setModalStt(true)}
                >
                  Set tình trạng lô hàng
                </FormButton>
              </Stack>
              <form noValidate onSubmit={handleSubmit}>
                <TextInputAd
                  label="Tên sản phẩm"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Stack
                  direction="row"
                  sx={{
                    gap: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ marginTop: 3, width: 100, fontWeight: 500 }}>
                    Đang bán
                  </Typography>

                  <TextInputAd
                    label="Lô hàng"
                    variant="outlined"
                    disabled
                    fullWidth
                    value={choose || "Chưa bán"}
                  />
                </Stack>
                <Stack
                  direction="row"
                  sx={{
                    gap: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TextInputAd
                    label="Số lượng"
                    variant="outlined"
                    disabled
                    type="number"
                    value={quantity}
                    error={checkQ}
                    sx={{ width: 300, marginTop: 5 }}
                    onChange={(e) => checkQuantity(e.target.value)}
                  />

                  <StyledFormControl
                    fullWidth
                  >
                    <InputLabel id="brand-select-label">Hãng</InputLabel>
                    <Select
                      labelId="brand-select-label"
                      id="brand-select"
                      value={brand}
                      label="Hãng"
                      onChange={handleChange2}
                      MenuProps={MenuProps}
                    >
                      {brands !== ""
                        ? brands.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))
                        : null}
                    </Select>
                  </StyledFormControl>
                </Stack>
                <StyledFormControl
                  fullWidth
                >
                  <InputLabel id="category-select-label">Loại</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={loai}
                    label="Loại"
                    onChange={handleChange}
                    inputProps={{ name: "category" }}
                  >
                    {loais !== ""
                      ? loais.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.categoryName}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                </StyledFormControl>

                <TextInputAd
                  label="Giá"
                  variant="outlined"
                  fullWidth
                  value={price || ""}
                  onChange={(e) => setPrice(e.target.value)}
                  InputProps={{
                    endAdornment: <Typography sx={{ pr: 1, opacity: 0.7 }}>VND</Typography>
                  }}
                />

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "center",
                    textAlign: "center",
                    marginTop: 4,
                    marginBottom: 2
                  }}
                >
                  <FormButton
                    color="error"
                    onClick={() => navigate(-1)}
                  >
                    Hủy
                  </FormButton>
                  <FormButton
                    onClick={handleSubmit}
                  >
                    Lưu thay đổi
                  </FormButton>
                  <FormButton
                    color="error"
                    onClick={handleDeleteProduct}
                  >
                    Xoá sản phẩm
                  </FormButton>
                </Stack>
              </form>
            </StylePaper>
            <StylePaper
              sx={{
                flex: 1,
                padding: 0,
                borderRadius: 4,
                backgroundColor: "#F8FAFC",
                height: "90vh",
                overflow: "hidden",
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h5" fontWeight="600" color="#2c6fbf" p={3} pb={1}
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  "&:after": {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 24,
                    width: '40px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #81C3FF, #2c6fbf)',
                    borderRadius: '10px'
                  }
                }}
              >
                Mô tả sản phẩm
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  m: 2,
                  mt: 0,
                  backgroundColor: "white",
                  borderRadius: 2,
                  overflow: "hidden",
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={description || ''}
                  modules={modules}
                  style={{ 
                    height: "calc(100% - 60px)", 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}
                  onChange={(newContent) => {
                   
                    setDescription(newContent);
                  }}
                />
                <FormButton 
                  sx={{ m: 2, alignSelf: 'flex-start' }}
                  variant="contained" 
                  color="primary"
                  onClick={() => {
               
                    Swal.fire({
                      title: "Đã cập nhật nội dung",
                      text: "Nội dung đã được cập nhật, hãy nhấn Sửa để lưu",
                      icon: "info"
                    });
                  }}
                >
                  Cập nhật nội dung
                </FormButton>
              </Box>
            </StylePaper>
          </Stack>
        </Box>
      </Stack>

      <ModalSizeColor 
        open={openSizeColorModal} 
        handleClose={handleToggleSizeColorModal}
        productId={id.id}
        productName={name}
      />
    </Box>
  );
}

export default ProductEdit;
