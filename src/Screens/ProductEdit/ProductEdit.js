import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
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
import { Phanloai } from "../../Component/data";

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

    axios
      .get(`/api/v1/products/getById/${id.id}`)
      .then(function (response) {
        console.log(response.data);
        setImage(response.data.imageProducts);
        setName(response.data.productName);
        setQuantity(response.data.quantity);
        setBrand(response.data.brand.id);
        setDescription(response.data.description);
        setPrice(response.data.price);
        setLoai(response.data.category.id);
        setSpec(response.data.specifications);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/api/v1/products/saveOrUpdate", {
        id: id.id,
        productName: name,
        quantity,
        brand: {
          id: brand,
        },
        description,
        price,
        category: {
          id: loai,
        },
        specifications: spec,
      })
      .then(function () {
        Swal.fire({
          title: "Thành công",
          icon: "success",
        });
      })
      .catch(function (error) {
        console.log(error);
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
  const handleChange = (event) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn đổi",
      text: "Sau khi đổi toàn bộ thông số kỹ thuật cũ sẽ mất hết",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      denyButtonText: `Hủy`,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoai(event.target.value);
        axios
          .post(
            `/api/v1/productSpecifications/updateList/${id.id}`,
            Phanloai(event.target.value)
          )
          .then(function (res) {
            axios
              .get(`/api/v1/products/getById/${id.id}`)
              .then(function (response) {
                setSpec(response.data.specifications);
                Swal.fire({
                  title: "Thành công",
                  icon: "success",
                });
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
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
      {/* {spec !== "" ? (
        <ModalTk
          modal={modalTk}
          setModal={setModalTk}
          spec={spec}
          id={id.id}
          setSpec={setSpec}
        />
      ) : (
        <></>
      )} */}

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
                <Button variant="contained" onClick={() => setModalStt(true)}>
                  Trạng thái
                </Button>
                {/* <Button variant="contained" onClick={() => setModalTk(true)}>
                  Thông số kỹ thuật
                </Button> */}
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
                  <Button type="submit" variant="contained" sx={{ width: 150 }}>
                    Sửa
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
                  value={description}
                  modules={modules}
                  style={{ height: 550 }}
                  onChange={(newContent) => setDescription(newContent)}
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

export default ProductEdit;
