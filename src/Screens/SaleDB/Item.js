import { Box, IconButton, Stack, Typography } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
function SplitArray(props) {
  const handleEdit = (id, stt) => {
    if (stt === 1) {
      props.setSelect((prevArray) =>
        prevArray.map((item) => {
          if (item.product.id === id) {
            return { ...item, enable: 0 };
          }
          return item;
        })
      );
    } else {
      props.setSelect((prevArray) =>
        prevArray.map((item) => {
          if (item.product.id === id) {
            return { ...item, enable: 1 };
          }
          return item;
        })
      );
    }
  };

  return (
    <Stack direction={"row"} sx={{ marginTop: 2 }}>
      <Box
        sx={{
          width: 230,
          display: "flex",
        }}
      >
        <Typography>{props.item.product.productName}</Typography>
      </Box>

      <Box
        sx={{
          width: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>
          {props.item.enable === 1 ? "Đang mở" : "Tạm đóng"}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 70,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          aria-label="delete"
          onClick={() => handleEdit(props.item.product.id, props.item.enable)}
        >
          <EditIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}

export default SplitArray;
