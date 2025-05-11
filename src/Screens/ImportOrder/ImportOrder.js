import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Paper,
  Select,
  Stack,
  Typography,
  MenuItem,
  InputBase,
  Grid,
  TextField,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import Header from "../../Component/Header";
import Left from "../../Component/Left";
import { v4 as uuidv4 } from "uuid";
import { NoteDiv, TextInputAd } from "../../Component/Style";
import ModalNcc from "./ModalNcc";
import ImportTable from "./Table";
import axios from "axios";
import TableProduct from "./TableProduct";
import Swal from "sweetalert2";
import { Phanloai } from "../../Component/data";
import { useRef } from "react";

const ImportOrder = () => {
  const [show, setShow] = useState(true);
  const [checkQ, setCheckQ] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [ncc, setNcc] = useState("");
  const [nccD, setNccD] = useState("");
  const [products, setProducts] = useState([]);
  const [priceImport, setPriceImport] = useState("");
  const [price, setPrice] = useState("");
  const [checkP, setCheckP] = useState(false);
  const [checkPI, setCheckPI] = useState(false);
  const [loai, setLoai] = useState("");
  const [loais, setLoais] = useState("");
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [productId, setProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const userId = localStorage.getItem("id");
  const formRef = useRef(null);

  // Lấy danh sách loại và thương hiệu
  useEffect(() => {
    axios
      .get("/api/v1/category/getAll")
      .then(function (response) {
        setLoais(response.data);
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

    // Lấy danh sách sản phẩm
    axios
      .get("/api/v1/products/getAll")
      .then(function (response) {
        setProductsList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // Xử lý khi chọn sản phẩm
  const handleProductSelect = (productId) => {
    // Nếu chọn sản phẩm mới, reset form
    if (productId !== product) {
      setQuantity("");
      setPriceImport("");
      setPrice("");
    }

    setProduct(productId);

    // Lấy thông tin chi tiết sản phẩm
    axios
      .get(`/api/v1/products/getById/${productId}`)
      .then(function (response) {
        const productData = response.data;
        setSelectedProduct(productData);
        console.log(productData);

        // Lấy giá bán hiện tại
        setPrice(productData.price);
        setLoai(productData.category.id);
        setBrand(productData.brand.id);
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể lấy thông tin sản phẩm",
          icon: "error",
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra nếu không có nhà cung cấp
    if (!nccD) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng chọn nhà cung cấp",
        icon: "error",
      });
      return;
    }

    // Kiểm tra nếu không có sản phẩm nào được nhập
    if (products.length === 0) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng thêm ít nhất một sản phẩm vào phiếu nhập",
        icon: "error",
      });
      return;
    }

    // Tạo chi tiết phiếu nhập
    const importOrderDetail = products.map((item) => {
      if (item.id.length > 30) {
        // Sản phẩm mới (chưa có trong hệ thống)
        return {
          importPrice: item.importPrice,
          loHang: {
            product: {
              quantity: item.quantity,
              price: item.price,
              productName: item.name,
              category: {
                id: item.loai,
              },
              brand: {
                id: item.hang,
              },
              specifications: {
                size: item.size,
                color: item.color,
                count: item.quantity,
              },
            },
          },
        };
      } else {
        // Sản phẩm đã có trong hệ thống
        return {
          importPrice: item.importPrice,
          loHang: {
            product: {
              size: item.size,
              color: item.color,
              count: item.quantity,
            },
          },
        };
      }
    });
    console.log(importOrderDetail);
    // Gửi phiếu nhập đến server
    // axios
    //   .post(`/api/v1/importOrders/saveOrUpdate`, {
    //     supplier: {
    //       id: nccD.id,
    //     },
    //     employee: {
    //       id: userId,
    //     },
    //     importOrderDetail: importOrderDetail,
    //   })
    //   .then(function (response) {
    //     console.log("Phiếu nhập đã được tạo:", response.data);
    //     formRef.current.reset();
    //     setNccD("");
    //     setNcc("");
    //     setProducts([]);
    //     setSelectedProduct(null);

    //     setQuantity("");
    //     setPriceImport("");
    //     setPrice("");

    //     Swal.fire({
    //       title: "Thành công",
    //       text: "Đã tạo phiếu nhập hàng thành công",
    //       icon: "success",
    //     });
    //   })
    //   .catch(function (error) {
    //     console.log("Lỗi khi tạo phiếu nhập:", error);
    //     Swal.fire({
    //       title: "Lỗi",
    //       text:
    //         error.response && error.response.data
    //           ? error.response.data
    //           : "Không thể tạo phiếu nhập. Vui lòng thử lại.",
    //       icon: "error",
    //     });
    //   });
  };

  // Tìm kiếm nhà cung cấp
  const handleFind = () => {
    if (ncc !== "") {
      // Hiển thị loading hoặc thông báo đang tìm kiếm
      Swal.fire({
        title: "Đang xử lý",
        text: "Đang tìm kiếm nhà cung cấp...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      axios
        .get(`/api/v1/suppliers/getByEmailOrPhone/${ncc}`)
        .then(function (response) {
          if (response.data !== `${ncc} not found!!`) {
            setNccD(response.data);
            console.log(response.data);
            Swal.close();
          } else {
            Swal.close();
            // Sử dụng dialog để hỏi người dùng có muốn thêm nhà cung cấp mới không
            Swal.fire({
              title: "Không tìm thấy",
              text: "Không tìm thấy nhà cung cấp với thông tin này. Bạn có muốn thêm mới không?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Thêm mới",
              cancelButtonText: "Hủy",
            }).then((result) => {
              if (result.isConfirmed) {
                setOpen(true);
              }
            });
            setNccD("");
          }
        })
        .catch(function (error) {
          console.log(error);
          Swal.fire({
            title: "Lỗi",
            text: "Không thể tìm kiếm nhà cung cấp. Vui lòng thử lại.",
            icon: "error",
          });
        });
    } else {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng nhập thông tin nhà cung cấp",
        icon: "error",
      });
    }
  };

  // Kiểm tra số lượng
  const checkQuantity = (e) => {
    if (e < 0) {
      setCheckQ(true);
    } else {
      setCheckQ(false);
      setQuantity(e);
    }
  };

  // Kiểm tra giá nhập
  const checkPriceI = (e) => {
    if (e < 0) {
      setCheckPI(true);
    } else {
      setCheckPI(false);
      setPriceImport(e);
    }
  };

  // Kiểm tra giá bán
  const checkPrice = (e) => {
    if (e < 0) {
      setCheckP(true);
    } else {
      setCheckP(false);
      setPrice(e);
    }
  };

  // Thêm sản phẩm vào danh sách phiếu nhập
  const handleAdd = (e) => {
    e.preventDefault();

    // Kiểm tra nếu là sản phẩm đã có trong hệ thống
    if (product && product !== "new") {
      if (!quantity || !priceImport || !price) {
        Swal.fire({
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin sản phẩm (số lượng, giá nhập, giá bán)",
          icon: "error",
        });
        return;
      }

      if (quantity <= 0) {
        Swal.fire({
          title: "Lỗi",
          text: "Số lượng phải lớn hơn 0",
          icon: "error",
        });
        return;
      }

      // Kiểm tra sản phẩm với cùng kích thước và màu sắc đã tồn tại chưa

      // Thêm sản phẩm mới
      setProducts((prev) => [
        ...prev,
        {
          id: product,
          name: selectedProduct.productName,
          quantity: Number(quantity),
          importPrice: Number(priceImport),
          price: Number(price),
          color: color,
          size: size,
          loai: loai,
          hang: brand,
        },
      ]);

      // Reset form
      setQuantity("");
      setPriceImport("");
    }
    // Kiểm tra nếu là sản phẩm mới
    else if (product === "new") {
      if (
        !quantity ||
        !priceImport ||
        !price ||
        !loai ||
        !brand ||
        !productId
      ) {
        Swal.fire({
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin sản phẩm mới",
          icon: "error",
        });
        return;
      }

      // Thêm sản phẩm mới
      setProducts((prev) => [
        ...prev,
        {
          id: uuidv4(),
          name: productId,
          quantity: Number(quantity),
          importPrice: Number(priceImport),
          price: Number(price),
          loai: loai,
          hang: brand,
          color: color,
          size: size,
        },
      ]);

      // Reset form
      setProductId("");
      setQuantity("");
      setPriceImport("");
      setPrice("");
    } else {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng chọn sản phẩm",
        icon: "error",
      });
    }
  };

  // Xóa tất cả thông tin đã nhập
  const handleWhite = () => {
    setProducts("");
    setPrice("");
    setPriceImport("");
    setQuantity("");
    setProduct("");
    setProductId("");
    setLoai("");
    setBrand("");
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Box>{show && <Left />}</Box>

      <Box
        sx={{
          flexGrow: 1,
          p: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Header show={show} setShow={setShow} text="Phiếu nhập hàng" />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            bgcolor: "#f5f5f5",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={5} lg={4}>
              <form ref={formRef}>
                <Stack spacing={3}>
                  {/* Thông tin nhà cung cấp */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mb: 2, fontWeight: "bold" }}
                    >
                      Thông tin nhà cung cấp
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={9}>
                          <TextField
                            fullWidth
                            label="Email hoặc SĐT nhà cung cấp"
                            variant="outlined"
                            size="small"
                            value={ncc}
                            onChange={(e) => setNcc(e.target.value)}
                            placeholder="Nhập email hoặc số điện thoại để tìm kiếm"
                            InputProps={{
                              sx: { borderRadius: 1 },
                            }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Button
                            variant="contained"
                            onClick={handleFind}
                            disabled={!ncc.trim()}
                            fullWidth
                            sx={{ height: "100%", borderRadius: 1 }}
                          >
                            Tìm kiếm
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>

                    {nccD ? (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: "#f5f5f5",
                          borderColor: "#2196f3",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {nccD.name}
                          </Typography>
                          <Chip
                            label="Đã chọn"
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <strong>Email:</strong>&nbsp;{nccD.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <strong>SĐT:</strong>&nbsp;{nccD.phone}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <strong>Địa chỉ:</strong>&nbsp;{nccD.address}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          p: 2,
                          bgcolor: "#f9f9f9",
                          borderRadius: 1,
                          border: "1px dashed #ccc",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Nhập email hoặc số điện thoại để tìm nhà cung cấp
                        </Typography>
                      </Box>
                    )}
                  </Paper>

                  {/* Thông tin sản phẩm nhập */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mb: 2, fontWeight: "bold" }}
                    >
                      Thông tin sản phẩm nhập
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Chọn sản phẩm</InputLabel>
                      <Select
                        value={product}
                        label="Chọn sản phẩm"
                        onChange={(e) => handleProductSelect(e.target.value)}
                      >
                        <MenuItem value="new">
                          <em>Thêm sản phẩm mới</em>
                        </MenuItem>
                        <Divider />
                        {productsList &&
                          productsList.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              {item.productName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    {product === "new" ? (
                      // Form thêm sản phẩm mới
                      <>
                        <TextField
                          fullWidth
                          label="Tên sản phẩm mới"
                          variant="outlined"
                          size="small"
                          value={productId}
                          onChange={(e) => setProductId(e.target.value)}
                          sx={{ mb: 2 }}
                        />

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Loại sản phẩm</InputLabel>
                              <Select
                                value={loai}
                                label="Loại sản phẩm"
                                onChange={(e) => setLoai(e.target.value)}
                              >
                                {loais &&
                                  loais.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>
                                      {item.categoryName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Thương hiệu</InputLabel>
                              <Select
                                value={brand}
                                label="Thương hiệu"
                                onChange={(e) => setBrand(e.target.value)}
                              >
                                {brands &&
                                  brands.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>
                                      {item.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </>
                    ) : product ? (
                      // Form nhập hàng cho sản phẩm đã có
                      <>
                        {selectedProduct && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              <strong>Thông tin sản phẩm:</strong>{" "}
                              {selectedProduct.productName}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Loại:</strong>{" "}
                              {selectedProduct.category?.categoryName}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Thương hiệu:</strong>{" "}
                              {selectedProduct.brand?.name}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Giá bán hiện tại:</strong>{" "}
                              {selectedProduct.price?.toLocaleString()} VNĐ
                            </Typography>
                            <Typography variant="body2">
                              <strong>Tình trạng lô hàng:</strong>{" "}
                              {selectedProduct.status === 1
                                ? "Đang bán"
                                : "Chưa mở bán"}
                            </Typography>
                          </Box>
                        )}
                      </>
                    ) : null}

                    {/* Số lượng và giá */}
                    {(product === "new" || product) && (
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Số lượng"
                            variant="outlined"
                            size="small"
                            value={quantity}
                            onChange={(e) =>
                              checkQuantity(Number(e.target.value))
                            }
                            error={checkQ}
                            helperText={checkQ ? "Số lượng không hợp lệ" : ""}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            type="text"
                            label="Size"
                            variant="outlined"
                            size="small"
                            value={size}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Chỉ cho nhập chữ cái (a-z hoặc A-Z)
                              if (/^[a-zA-Z]*$/.test(value)) {
                                setSize(value);
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            type="text"
                            label="Màu sắc"
                            variant="outlined"
                            size="small"
                            value={color}
                            onChange={(e) => {
                              setColor(e.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Giá nhập"
                            variant="outlined"
                            size="small"
                            value={priceImport}
                            onChange={(e) =>
                              checkPriceI(Number(e.target.value))
                            }
                            error={checkPI}
                            helperText={checkPI ? "Giá nhập không hợp lệ" : ""}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Giá bán"
                            variant="outlined"
                            size="small"
                            value={price}
                            onChange={(e) => checkPrice(Number(e.target.value))}
                            error={checkP}
                            helperText={checkP ? "Giá bán không hợp lệ" : ""}
                          />
                        </Grid>
                      </Grid>
                    )}

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleWhite}
                      >
                        Xóa trắng
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAdd}
                        disabled={!product || checkQ || checkP || checkPI}
                      >
                        Thêm vào phiếu nhập
                      </Button>
                    </Box>
                  </Paper>
                </Stack>
              </form>
            </Grid>

            <Grid item xs={12} md={7} lg={8}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ mb: 2, fontWeight: "bold" }}
                >
                  Danh sách sản phẩm trong phiếu nhập
                </Typography>

                <Box sx={{ flexGrow: 1, overflow: "hidden", minHeight: 200 }}>
                  {products && products.length > 0 ? (
                    <TableContainer sx={{ maxHeight: 440, mb: 3 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell align="right">Số lượng</TableCell>
                            <TableCell align="right">Màu sắc</TableCell>
                            <TableCell align="right">Size</TableCell>
                            <TableCell align="right">Giá nhập</TableCell>
                            <TableCell align="right">Giá bán</TableCell>
                            <TableCell align="right">Thành tiền</TableCell>
                            <TableCell>Hành động</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {products.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell align="right">
                                {item.quantity}
                              </TableCell>
                              <TableCell>{item.color}</TableCell>
                              <TableCell>{item.size}</TableCell>
                              <TableCell align="right">
                                {item.importPrice?.toLocaleString()} VNĐ
                              </TableCell>
                              <TableCell align="right">
                                {item.price?.toLocaleString()} VNĐ
                              </TableCell>
                              <TableCell align="right">
                                {(
                                  item.quantity * item.importPrice
                                )?.toLocaleString()}{" "}
                                VNĐ
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setProducts(
                                      products.filter((_, i) => i !== index)
                                    );
                                  }}
                                >
                                  Xóa
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 200,
                        bgcolor: "#f9f9f9",
                        borderRadius: 1,
                        border: "1px dashed #ccc",
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        Chưa có sản phẩm nào trong phiếu nhập
                      </Typography>
                    </Box>
                  )}
                </Box>

                {products && products.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="h6">
                      Tổng tiền:{" "}
                      {products
                        .reduce(
                          (total, item) =>
                            total + item.quantity * item.importPrice,
                          0
                        )
                        .toLocaleString()}{" "}
                      VNĐ
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleSubmit}
                      disabled={!nccD || products.length === 0}
                    >
                      Tạo phiếu nhập
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <ModalNcc
        modal={open}
        setModal={setOpen}
        setNcc={setNcc}
        setNccD={setNccD}
      />
    </Box>
  );
};

export default ImportOrder;
