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
} from "@mui/material";
import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import Header from "../../Component/Header";
import Left from "../../Component/Left";
import { TextInputAd } from "../../Component/Style";
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
  const [loais, setLoais] = useState("");
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState("");
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
    // Hàm chuẩn hóa thông số kỹ thuật, loại bỏ trùng lặp
    const normalizeSpecifications = (specs) => {
      if (!specs || !Array.isArray(specs)) return [];
      
      // Sử dụng Map để loại bỏ trùng lặp dựa trên tên thông số
      const specsMap = new Map();
      specs.forEach(item => {
        if (item && item.specificationName) {
          specsMap.set(item.specificationName, item);
        }
      });
      
      return Array.from(specsMap.values());
    };

    // Hàm đồng bộ và làm sạch thông số kỹ thuật với server
    const syncSpecificationsWithServer = async (productId, specs) => {
      try {
        // Đảm bảo specs không null và đã được chuẩn hóa
        const normalizedSpecs = normalizeSpecifications(specs);
        
        console.log("Đồng bộ thông số kỹ thuật với server...");
        
        // Gọi API để cập nhật thông số
        const response = await axios.post(`/api/v1/productSpecifications/updateList/${productId}`, normalizedSpecs);
        
        console.log("Đồng bộ thành công:", response.data);
        return normalizedSpecs;
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

    axios
      .get(`/api/v1/products/getById/${id.id}`)
      .then(function (response) {
        console.log("Dữ liệu sản phẩm ban đầu:", response.data);
        setImage(response.data.imageProducts);
        setName(response.data.productName);
        setQuantity(response.data.quantity);
        setBrand(response.data.brand.id);
        setDescription(response.data.description);
        setPrice(response.data.price);
        setLoai(response.data.category.id);
        
        // Chuẩn hóa thông số kỹ thuật
        if (response.data.specifications && Array.isArray(response.data.specifications)) {
          const normalizedSpecs = normalizeSpecifications(response.data.specifications);
          console.log("Thông số kỹ thuật sau khi chuẩn hóa:", normalizedSpecs);
          
          // Kiểm tra và log nếu có trùng lặp
          if (normalizedSpecs.length !== response.data.specifications.length) {
            console.log(`Đã loại bỏ ${response.data.specifications.length - normalizedSpecs.length} thông số trùng lặp`);
            
            // Đồng bộ lại với server
            syncSpecificationsWithServer(id.id, normalizedSpecs).then(synced => {
              if (synced) {
                console.log("Đã làm sạch thông số trùng lặp trên server");
                setSpec(synced);
              } else {
                setSpec(normalizedSpecs);
              }
            });
          } else {
            setSpec(normalizedSpecs);
          }
        } else {
          setSpec([]);
        }

        // Tìm thông số kỹ thuật cho size và màu sắc
        if (response.data.specifications && Array.isArray(response.data.specifications)) {
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
  }, [id.id, generateVariantStock]); // Thêm generateVariantStock vào danh sách dependencies

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
    
    // Hàm chuẩn hóa thông số kỹ thuật
    const normalizeSpecifications = (specs) => {
      if (!specs || !Array.isArray(specs)) return [];
      
      // Nhóm thông số theo tên
      const specsMap = new Map();
      
      // Tạo thông số cho màu sắc
      if (colors.length > 0) {
        specsMap.set("Màu sắc", {
          specificationName: "Màu sắc",
          specificationValue: colors.join(", ")
        });
      }
      
      // Tạo thông số cho kích thước
      if (sizes.length > 0) {
        specsMap.set("Kích thước", {
          specificationName: "Kích thước",
          specificationValue: sizes.join(", ")
        });
      }
      
      // Thêm các thông số khác từ specs hiện tại
      specs.forEach(item => {
        if (item && item.specificationName) {
          // Không thêm lại nếu đã có Màu sắc hoặc Kích thước
          if (item.specificationName !== "Màu sắc" && item.specificationName !== "Kích thước") {
            specsMap.set(item.specificationName, item);
          }
        }
      });
      
      return Array.from(specsMap.values());
    };
    
    // Đồng bộ thông số với server
    const syncSpecificationsWithServer = async () => {
      try {
        // Chuẩn hóa thông số
        const normalizedSpecs = normalizeSpecifications(spec);
        
        console.log("Đồng bộ thông số kỹ thuật với server...");
        
        // Gọi API để cập nhật thông số
        const response = await axios.post(`/api/v1/productSpecifications/updateList/${id.id}`, normalizedSpecs);
        
        console.log("Đồng bộ thành công:", response.data);
        return normalizedSpecs;
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
        // Sau khi cập nhật thông tin cơ bản, đồng bộ thông số kỹ thuật
        syncSpecificationsWithServer().then(() => {
          Swal.fire({
            title: "Thành công",
            text: "Đã cập nhật thông tin sản phẩm",
            icon: "success",
          }).then(() => {
            navigate("/products");
          });
        });
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể cập nhật sản phẩm. Vui lòng thử lại sau.",
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
      {spec !== "" ? (
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
            gap={2}
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              height: "90vh",
            }}
          >
            <Box
              sx={{
                flex: 1,
                border: "1px solid black",
                borderRadius: 10,
                padding: 2,
                width: "100%",
                backgroundColor: "#E3EFFD",
              }}
            >
              <Typography variant="h4">Thông tin sản phẩm #{id.id}</Typography>
              <Stack
                direction="row"
                style={{
                  textAlign: "center",
                  marginTop: 30,
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 20,
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Button variant="contained" onClick={() => setModalDes(true)}>
                  Hình ảnh
                </Button>
                <Button variant="contained" onClick={() => setModalTk(true)}>
                  Thông số kỹ thuật
                </Button>
                <Button variant="contained" color="success" onClick={handleToggleSizeColorModal}>
                  Quản lý Size & Màu
                </Button>
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
                  <Typography sx={{ marginTop: 3, width: 100 }}>
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

                  <FormControl
                    fullWidth
                    sx={{ marginTop: 5, backgroundColor: "white" }}
                  >
                    <InputLabel id="demo-simple-select-label">Hãng</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={brand}
                      label="Age"
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
                  </FormControl>
                </Stack>
                <FormControl
                  fullWidth
                  sx={{ marginTop: 5, backgroundColor: "white" }}
                >
                  <InputLabel id="demo-simple-select-label">Loại</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={loai}
                    label="Age"
                    onChange={handleChange}
                  >
                    {loais !== ""
                      ? loais.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            {item.categoryName}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                </FormControl>

                <TextInputAd
                  label="Giá"
                  variant="outlined"
                  fullWidth
                  value={price || ""}
                  onChange={(e) => setPrice(e.target.value)}
                />

                <Stack
                  direction="row"
                  spacing={10}
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ width: 150 }}
                    onClick={() => navigate(-1)}
                  >
                    Hủy
                  </Button>
                  <Button
                    sx={{
                      mt: 5,
                      borderRadius: "7px",
                      width: 150,
                      backgroundColor: "#81c3f5",
                      ":hover": {
                        bgcolor: "#5ea2d7",
                        color: "white",
                      },
                    }}
                    onClick={handleSubmit}
                  >
                    Lưu thay đổi
                  </Button>
                </Stack>
              </form>
            </Box>
            <Box
              sx={{
                flex: 1,
                border: "1px solid black",
                borderRadius: 10,

                backgroundColor: "#E3EFFD",
                height: "90vh",
              }}
            >
              <Box
                sx={{
                  margin: 3,
                  backgroundColor: "white",
                  height: "80vh",
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={description || ''}
                  modules={modules}
                  style={{ height: 550 }}
                  onChange={(newContent) => {
                    console.log("Nội dung mới:", newContent);
                    setDescription(newContent);
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={() => {
                    console.log("Nội dung hiện tại:", description);
                    Swal.fire({
                      title: "Đã cập nhật nội dung",
                      text: "Nội dung đã được cập nhật, hãy nhấn Sửa để lưu",
                      icon: "info"
                    });
                  }}
                >
                  Cập nhật nội dung
                </Button>
              </Box>
            </Box>
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
