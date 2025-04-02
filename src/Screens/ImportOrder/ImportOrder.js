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
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import Header from "../../Component/Header";
import Left from "../../Component/Left";
import { v4 as uuidv4 } from "uuid";
import { NoteDiv, TextInputAd } from "../../Component/Style";
import ModalNcc from "./ModalNcc";
import Table from "./Table";
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
  const [products, setProducts] = useState("");
  const [priceImport, setPriceImport] = useState("");
  const [price, setPrice] = useState("");
  const [checkP, setCheckP] = useState(false);
  const [checkPI, setCheckPI] = useState(false);
  const [loai, setLoai] = useState("");
  const [loais, setLoais] = useState("");
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState("");
  const [productId, setProductId] = useState("");
  const userId = localStorage.getItem("id");
  const formRef = useRef(null);
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
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    const importOrderDetail = products.map((item) => {
      if (item.id.length > 30) {
        return {
          importPrice: item.importPrice,
          quantity: item.quantity,
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
              specifications: Phanloai(item.loai),
            },
          },
        };
      } else {
        return {
          importPrice: item.importPrice,
          quantity: item.quantity,
          loHang: {
            product: {
              quantity: item.quantity,
              id: item.id,
            },
          },
        };
      }
    });
    // console.log(importOrderDetail);
    if (product !== "" || ncc !== "") {
      axios
        .post(`/api/v1/importOrders/saveOrUpdate`, {
          supplier: {
            id: nccD.id,
          },
          employee: {
            id: userId,
          },
          importOrderDetail: importOrderDetail,
        })
        .then(function (response) {
          console.log(response.data);
          formRef.current.reset();
          setNccD("");
          setNcc("");
          setProducts("");

          Swal.fire({
            title: "Thành công",
            icon: "success",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      Swal.fire({
        title: "Vui lòng nhập đầy đủ thông tin",

        icon: "error",
      });
    }
  };

  const handleFind = () => {
    if (ncc !== "") {
      axios
        .get(`/api/v1/suppliers/getByEmailOrPhone/${ncc}`)
        .then(function (response) {
          if (response.data !== `${ncc} not found!!`) {
            setNccD(response.data);
            console.log(response.data);
          } else {
            setOpen(!open);
            setNccD("");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      Swal.fire({
        title: "Vui lòng nhập thông tin",
        icon: "error",
      });
    }
  };

  const checkQuantity = (e) => {
    if (e < 0) {
      setCheckQ(true);
    } else {
      setCheckQ(false);
      setQuantity(e);
    }
  };

  const checkPriceI = (e) => {
    if (e < 0) {
      setCheckPI(true);
    } else {
      setCheckPI(false);
      setPriceImport(e);
    }
  };
  const checkPrice = (e) => {
    if (e < 0) {
      setCheckP(true);
    } else {
      setCheckP(false);
      setPrice(e);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (
      product !== "" &&
      quantity !== "" &&
      priceImport !== "" &&
      loai !== "" &&
      brand !== "" &&
      price !== "" &&
      quantity > 0
    ) {
      setProducts((prev) => {
        const newJob = [
          ...prev,
          {
            id: productId || uuidv4(),
            name: product,
            price: price,
            quantity: quantity,
            importPrice: priceImport,
            loai: loai,
            hang: brand,
          },
        ];
        return newJob;
      });
      setProductId("");
      setProduct("");
      setQuantity("");
      setPrice("");
      setPriceImport("");
    } else {
      Swal.fire({
        title: "Vui lòng nhập đầy đủ",
        icon: "error",
      });
    }
  };

  const handleWhite = () => {
    setProductId("");
    setProduct("");
    setQuantity("");
    setPrice("");
    setPriceImport("");
    setLoai("");
    setBrand("");
  };

  const handleChange = (event) => {
    setLoai(event.target.value);
  };
  const handleChange2 = (event) => {
    setBrand(event.target.value);
  };

  return (
    <Box sx={{ backgroundColor: "white" }}>
      <ModalNcc setModal={setOpen} modal={open} />
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%", minWidth: "70%" }}>
          <Header setShow={setShow} show={show} text="Thêm phiếu nhập" />
          <Box
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
            }}
          >
            <Stack direction={"row"} spacing={5}>
              <Box
                sx={{
                  flex: 1,

                  padding: "20px 20px 0 20px",
                  border: "1px solid black",
                  borderRadius: 5,
                  backgroundColor: "#E3EFFD",
                }}
              >
                <form
                  noValidate
                  ref={formRef}
                  onSubmit={handleSubmit}
                  autoComplete="true"
                >
                  <Stack
                    direction={"row"}
                    spacing={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <NoteDiv>
                      <InputBase
                        sx={{ ml: 2, width: "95%" }}
                        fullWidth
                        placeholder="Thông tin nhà cung cấp"
                        onChange={(e) => setNcc(e.target.value)}
                      />
                    </NoteDiv>
                    <Button
                      variant="contained"
                      sx={{ width: 120, height: 40 }}
                      onClick={handleFind}
                    >
                      Tìm
                    </Button>
                  </Stack>

                  <Stack
                    sx={{
                      gap: 1,
                      marginTop: 3,
                      border: "1px solid black",
                      padding: "10px 10px 10px 30px",
                      borderRadius: 5,
                      backgroundColor: "white",
                    }}
                  >
                    <Typography variant="body1">
                      Tên: {nccD.name || ""}
                    </Typography>
                    <Stack direction="row" gap={5}>
                      <Typography variant="body1">
                        Email: {nccD.email || ""}
                      </Typography>
                      <Typography variant="body1">
                        SDT: {nccD.phone || ""}
                      </Typography>
                    </Stack>
                    <Typography>Địa chỉ: {nccD.address || ""}</Typography>
                  </Stack>

                  <Table products={products} setProducts={setProducts} />

                  <Stack
                    direction="row"
                    spacing={10}
                    style={{
                      justifyContent: "center",
                      textAlign: "center",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: 150 }}
                    >
                      Tạo
                    </Button>
                  </Stack>
                </form>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Paper
                  sx={{
                    padding: 2,
                    border: "1px solid black",
                    borderRadius: 5,
                    backgroundColor: "#E3EFFD",
                  }}
                >
                  <form noValidate onSubmit={handleAdd}>
                    <TextInputAd
                      label="Tên sản phẩm"
                      variant="outlined"
                      sx={{ marginTop: 0 }}
                      fullWidth
                      value={product}
                      size="small"
                      onChange={(e) => setProduct(e.target.value)}
                    />
                    <Stack direction={"row"} gap={2} sx={{ marginTop: 4 }}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ backgroundColor: "white" }}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Loại
                        </InputLabel>
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

                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ backgroundColor: "white" }}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Hãng
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={brand}
                          label="Age"
                          onChange={handleChange2}
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
                    <TextInputAd
                      label="Số lượng"
                      variant="outlined"
                      type="number"
                      error={checkQ}
                      value={quantity}
                      fullWidth
                      size="small"
                      onChange={(e) => checkQuantity(e.target.value)}
                    />

                    <TextInputAd
                      label="Giá nhập"
                      variant="outlined"
                      fullWidth
                      error={checkPI}
                      type="number"
                      value={priceImport}
                      size="small"
                      onChange={(e) => checkPriceI(e.target.value)}
                    />
                    <TextInputAd
                      label="Giá bán"
                      error={checkP}
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={price}
                      size="small"
                      onChange={(e) => checkPrice(e.target.value)}
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
                        onClick={handleWhite}
                      >
                        Xóa trắng
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ width: 150 }}
                      >
                        Thêm
                      </Button>
                    </Stack>
                  </form>
                </Paper>
                <Box sx={{ marginTop: 2 }}>
                  <TableProduct
                    setBrand={setBrand}
                    setPriceImport={setPriceImport}
                    setProduct={setProduct}
                    setLoai={setLoai}
                    setProductId={setProductId}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default ImportOrder;
