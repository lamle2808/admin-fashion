import { Box, Grid, Stack, Typography, styled } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export const StackNav = styled(Stack)({
  width: "80%",
  backgroundColor: "white",
  justifyContent: "space-between",
  padding: 10,
  paddingLeft: 20,
  paddingRight: 20,
  borderRadius: 20,
  border: "1px solid black",
  marginTop: 10,
});

export const GridBox = styled(Grid)({
  border: "1px solid black",
  borderRadius: 20,
  paddingTop: 2,
  paddingBottom: 10,
  backgroundColor: "white",
});
export const BoxBtn = styled(Box)({
  backgroundColor: "white",
  padding: 10,
  border: "1px solid black",
  borderRadius: 20,
  width: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
});
export const SaleDis = ({ value }) => {
  const [data, setData] = useState("");

  useEffect(() => {
    if (value.sale !== "Không có") {
      axios
        .get(`/api/v1/sales/getById/${value.sale}`)
        .then((res) => {
          setData(res.data.discount);
        })
        .catch((error) => console.log(error));
    }
  }, [value]);
  return (
    <Stack direction={"column"}>
      {value.sale !== "Không có" ? (
        <>
          <Typography sx={{ textDecoration: "line-through" }}>
            {value.price} đ
          </Typography>
          <Typography>
            {(value.price - value.price * (data / 100))
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
            đ
          </Typography>
        </>
      ) : (
        <Typography>{value.price} đ</Typography>
      )}
    </Stack>
  );
};
