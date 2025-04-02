import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";

import SplitArray from "./Item";

function TableChoose(props) {
  const sum = props.select.reduce(
    (acc, item) => acc + item.product.salePrice * item.quantity,
    0
  );

  return (
    <Box
      sx={{
        // height: "90%",
        width: "98%",
      }}
    >
      <Stack
        direction={"row"}
        sx={{
          backgroundColor: "white",
          width: "100%",
          paddingRight: 1,
          paddingLeft: 1,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <Box sx={{ width: 230, display: "flex", justifyContent: "center" }}>
          <Typography>Tên</Typography>
        </Box>
        <Box sx={{ width: 70, display: "flex", justifyContent: "center" }}>
          <Typography>Số lượng</Typography>
        </Box>
        <Box sx={{ width: 150, display: "flex", justifyContent: "center" }}>
          <Typography>Giá</Typography>
        </Box>
      </Stack>
      <Divider />
      <Divider />
      <Box
        sx={{
          height: 240,
          overflow: "auto",
          width: "100%",
          backgroundColor: "white",
          padding: 1,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        {props.select.map((item, i) => (
          <Box key={i}>
            <SplitArray
              item={item}
              select={props.select}
              setSelect={props.setSelect}
            />
          </Box>
        ))}
      </Box>

      <Stack
        direction={"row"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 3,
          backgroundColor: "white",
          padding: 1,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Typography>Tổng hóa đơn: </Typography>
        <Box sx={{ width: 180, display: "flex", justifyContent: "center" }}>
          <Typography>
            {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default TableChoose;
