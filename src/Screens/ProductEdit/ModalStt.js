import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import React from "react";

import { style } from "../../Component/Style";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function ModalStt({ setModal, modal, id }) {
  const [data, setData] = useState("");
  const [choose, setChoose] = useState("");
  const toggleModal = () => {
    setModal(false);
  };

  useEffect(() => {
    axios
      .get(`/api/v1/loHangs/getByProduct/${id}`)
      .then(function (response) {
        setData(response.data);

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
  }, [id]);

  const handleChange = (event) => {
    setChoose(event.target.value);
  };

  const handleChange2 = () => {
    axios
      .post(`/api/v1/loHangs/saveOrUpdate`, {
        id: choose,
      })
      .then(function (response) {
        setModal(false);
        Swal.fire({
          title: "Thành công",
          icon: "success",
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Modal open={modal} onClose={toggleModal}>
      <Box sx={style}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            Chọn lô hàng mở bán
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={choose}
            onChange={handleChange}
            sx={{ marginTop: 2 }}
          >
            {data !== ""
              ? data.map((item, i) => {
                  return (
                    <FormControlLabel
                      key={i}
                      disabled={item.quantity <= 0 ? true : false}
                      value={item.id}
                      control={<Radio />}
                      label={item.id + ` (${item.quantity})`}
                    />
                  );
                })
              : null}
          </RadioGroup>
        </FormControl>
        <Stack
          direction="row"
          spacing={10}
          style={{
            justifyContent: "center",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{ width: 150 }}
            onClick={() => setModal(false)}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ width: 150 }}
            onClick={handleChange2}
          >
            Sửa
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ModalStt;
