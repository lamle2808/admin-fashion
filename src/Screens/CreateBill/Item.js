import { Box, OutlinedInput, Stack, Typography } from "@mui/material";
import { useState } from "react";

function SplitArray(props) {
  const [error, setError] = useState(false);

  const inputQuantity = (e) => {
    setError(false);
    if (e > 0 && e < props.item.product.maxQuantity) {
      const newArr = props.select.map((item) => {
        if (item.id === props.item.id) {
          props.item.quantity = e;
        }

        return item;
      });
      props.setSelect(newArr);
    } else {
      setError(true);
    }
  };

  const handlePrice = () => {
    if (props.item.product.salePrice !== props.item.product.price) {
      return (
        <Typography sx={{ textDecoration: "line-through" }}>
          {props.item.product.price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
          đ
        </Typography>
      );
    }
  };

  return (
    <Stack direction={"row"} sx={{ marginTop: 2 }}>
      <Box sx={{ width: 230, display: "flex", alignItems: "center" }}>
        <Typography>{props.item.product.name}</Typography>
      </Box>
      <Box
        sx={{
          width: 70,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <OutlinedInput
          type="number"
          id="outlined-adornment-weight"
          error={error}
          value={props.item.quantity}
          sx={{ height: "40px" }}
          onChange={(e) => inputQuantity(Number(e.target.value))}
        />
      </Box>
      <Box
        sx={{
          width: 150,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          {handlePrice()}
          <Typography>
            {(props.item.product.salePrice * props.item.quantity)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            đ
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export default SplitArray;
