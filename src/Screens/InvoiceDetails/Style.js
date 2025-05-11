import { Box, Grid, Stack, Typography, styled } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export const StackNav = styled(Stack)({
  width: "80%",
  backgroundColor: "white",
  justifyContent: "space-between",
  padding: "16px 24px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  marginTop: 16,
  border: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  }
});

export const GridBox = styled(Grid)({
  border: "none",
  borderRadius: "12px",
  padding: "16px",
  backgroundColor: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    backgroundColor: "#81C3FF",
    borderRadius: "12px 0 0 12px"
  },
  "& .MuiTypography-h6": {
    marginBottom: 12,
    color: "#2c6fbf",
    fontWeight: 600
  }
});

export const BoxBtn = styled(Box)({
  backgroundColor: "white",
  padding: 16,
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  width: "60%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 24,
  "& .MuiButton-root": {
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    minWidth: "140px",
    transition: "all 0.3s ease",
  },
  "& .MuiButton-root:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
  },
  "& .MuiButton-containedError": {
    background: "linear-gradient(135deg, #FF6B6B 0%, #e44d4d 100%)",
  },
  "& .MuiButton-containedSuccess": {
    background: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
  }
});

export const InvoicePaper = styled(Box)({
  backgroundColor: "#F8FAFC",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  padding: "20px",
  position: "relative",
  "& .MuiTypography-h4": {
    marginBottom: 20,
    color: "#2c6fbf",
    fontWeight: 600,
    textAlign: "center",
    position: "relative",
    display: "inline-block",
    width: "100%",
    "&::after": {
      content: '""',
      position: "absolute",
      width: "80px",
      height: "3px",
      bottom: "-8px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(90deg, #81C3FF, #2c6fbf)",
      borderRadius: "10px"
    }
  }
});

export const SaleDis = ({ value }) => {
  const [data, setData] = useState("");

  useEffect(() => {
    if (value?.sale !== "Không có" && value?.sale) {
      axios
        .get(`/api/v1/sales/getById/${value.sale}`)
        .then((res) => {
          setData(res.data?.discount || 0);
        })
        .catch((error) => console.log(error));
    }
  }, [value]);
  
  // Kiểm tra nếu value không tồn tại hoặc không có thuộc tính price
  if (!value || value.price === undefined) {
    return <Typography>0 đ</Typography>;
  }
  
  return (
    <Stack direction={"column"}>
      {value.sale !== "Không có" && value.sale ? (
        <>
          <Typography 
            sx={{ 
              textDecoration: "line-through", 
              color: "text.secondary", 
              fontSize: "0.85rem" 
            }}
          >
            {(value.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
          </Typography>
          <Typography 
            sx={{ 
              fontWeight: 600, 
              color: "#e44d4d" 
            }}
          >
            {(value.price - value.price * ((data || 0) / 100))
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
          </Typography>
        </>
      ) : (
        <Typography sx={{ fontWeight: 600 }}>
          {(value.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
        </Typography>
      )}
    </Stack>
  );
};
