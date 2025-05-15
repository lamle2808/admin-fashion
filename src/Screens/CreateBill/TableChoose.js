import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  Alert,
} from "@mui/material";
import React from "react";
import { StylePaper } from "../../Component/Style";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: "#f1f9ff",
  color: "#2c6fbf",
}));

const StyledDeleteButton = styled(Button)(({ theme }) => ({
  minWidth: "40px",
  padding: "6px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(255, 0, 0, 0.04)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
}));

export default function TableChoose({ setSelect, select }) {
  const handleDelete = (id) => {
    const filter = select.filter((item) => item.product.id !== id);
    if (filter.length === 0) {
      setSelect("");
    } else {
      setSelect(filter);
    }
  };

  // Kiểm tra nếu không có sản phẩm
  if (!select || (Array.isArray(select) && select.length === 0)) {
    return (
      <StylePaper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          p: 2,
        }}
      >
        <Alert severity="info">Chưa có sản phẩm nào được chọn</Alert>
      </StylePaper>
    );
  }
  return (
    <StylePaper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        color="#2c6fbf"
        p={2}
        sx={{
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        Sản phẩm đã chọn
      </Typography>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên sản phẩm</StyledTableCell>
              <StyledTableCell align="right">Số lượng</StyledTableCell>
              <StyledTableCell align="right">Giá</StyledTableCell>
              <StyledTableCell align="center">Thành tiền</StyledTableCell>
              <StyledTableCell align="center">asd</StyledTableCell>
              <StyledTableCell align="center">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {select.map((row) => (
              <TableRow
                key={row.product.id + row.specifications}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.product.productName}
                </TableCell>
                <TableCell align="right">{row.specifications.count}</TableCell>
                <TableCell align="right">
                  {row.product.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                  VND
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 500, color: "#e44d4d" }}
                >
                  {(row.product.price * row.specifications.count)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                  VND
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.specifications.color} {row.specifications.size}
                </TableCell>
                <TableCell align="center">
                  <StyledDeleteButton
                    onClick={() => handleDelete(row.product.id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </StyledDeleteButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell colSpan={3} align="right" sx={{ fontWeight: 600 }}>
                Tổng tiền:
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "#e44d4d" }}
              >
                {select
                  .reduce((n, item) => {
                    const count = item.specifications?.count || 0;
                    return n + item.product.price * count;
                  }, 0)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                VND
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </StylePaper>
  );
}
