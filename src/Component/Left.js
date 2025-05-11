import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  ListItemButton
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReportIcon from "@mui/icons-material/Report";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import logo from "../Assert/logo.png";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import InputIcon from "@mui/icons-material/Input";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { MenuBtn } from "./Style";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import StoreIcon from "@mui/icons-material/Store";

function LeftAdmin() {
  const navigate = useNavigate();
  const BoxSide = styled(Box)(() => ({
    backgroundColor: "#F8F9F9",
  }));

  const [open, setOpen] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [openC, setOpenC] = useState(false);
  const [openD, setOpenD] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickA = () => {
    setOpenA(!openA);
  };
  const handleHome = () => {
    navigate("/DashBoard");
  };
  const handleDB = () => {
    navigate("/DashBoard");
  };
  const handleQuestion = () => {
    navigate("/Checkout");
  };
  const handleQuestionA = () => {
    navigate("/CreateBill");
  };

  const handleUser = () => {
    navigate("/ImportOrder");
  };
  const handleSP = () => {
    navigate("/Product");
  };

  const handleReportC = () => {
    navigate("/ImportOrderData");
  };

  // const handleExcel = () => {
  //   navigate("/ImportExcel");
  // };
  const handleKM = () => {
    navigate("/Sale");
  };
  const handleKmDB = () => {
    navigate("/SaleDB");
  };
  const handleACc = () => {
    navigate("/Account");
  };
  const handleACc2 = () => {
    navigate("/Employee");
  };
  const handleTk = () => {
    navigate("/Statistics");
  };
  const handleSale = () => {
    navigate("/SaleStatistics");
  };
  const handleBrand = () => {
    navigate("/Brand");
  };
  const handleClickB = () => {
    setOpenB(!openB);
  };
  const handleClickC = () => {
    setOpenC(!openC);
  };
  const handleClickD = () => {
    setOpenD(!openD);
  };

  return (
    <BoxSide>
      <Box 
        sx={{ 
          width: 250, 
          p: 2, 
          height: '100vh', 
          overflowY: 'auto', 
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}
      >
        <Box>
          <List 
            bgcolor="background.paper" 
            sx={{ 
              '& .MuiDivider-root': { 
                my: 2 
              } 
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2
              }}
            >
              <Box
                onClick={handleHome}
                component="img"
                sx={{
                  height: 60,
                  cursor: "pointer",
                }}
                alt="logo"
                src={logo}
              />
            </Box>
            <Divider />
            <ListItem disablePadding>
              <MenuBtn onClick={handleDB}>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Trang chủ" />
              </MenuBtn>
            </ListItem>

            <MenuBtn onClick={handleClickA}>
              <ListItemIcon>
                <PaidIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Quản lý hóa đơn" />
              {openA ? <ExpandLess /> : <ExpandMore />}
            </MenuBtn>

            <Collapse in={openA} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <MenuBtn sx={{ pl: 4 }} onClick={handleQuestionA}>
                  <ListItemIcon>
                    <NoteAddIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Tạo hóa đơn" />
                </MenuBtn>

                <MenuBtn sx={{ pl: 4 }} onClick={handleQuestion}>
                  <ListItemIcon>
                    <RequestQuoteIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Danh sách hóa đơn" />
                </MenuBtn>
              </List>
            </Collapse>

            <MenuBtn onClick={handleClick}>
              <ListItemIcon>
                <InputIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Quản lý nhập hàng" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </MenuBtn>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <MenuBtn sx={{ pl: 4 }} onClick={handleUser}>
                  <ListItemIcon>
                    <NoteAddIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Phiếu nhập" />
                </MenuBtn>

                {/* <MenuBtn sx={{ pl: 4 }} onClick={handleExcel}>
                  <ListItemIcon>
                    <NoteAddIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Phiếu nhập excel" />
                </MenuBtn> */}

                <MenuBtn sx={{ pl: 3 }} onClick={handleReportC}>
                  <ListItemIcon>
                    <Inventory2Icon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Danh sách đơn nhập" />
                </MenuBtn>
              </List>
            </Collapse>
            <ListItem disablePadding>
              <MenuBtn onClick={handleBrand}>
                <ListItemIcon>
                  <CategoryIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Quản lý thương hiệu" />
              </MenuBtn>
            </ListItem>
            <ListItem disablePadding>
              <MenuBtn onClick={handleSP}>
                <ListItemIcon>
                  <CategoryIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Quản lý sản phẩm" />
              </MenuBtn>
            </ListItem>
            <ListItem disablePadding>
              <MenuBtn onClick={() => navigate('/Distributor')}>
                <ListItemIcon>
                  <StoreIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Quản lý nhà phân phối" />
              </MenuBtn>
            </ListItem>
            <MenuBtn onClick={handleClickB}>
              <ListItemIcon>
                <PaidIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Quản lý khuyến mãi" />
              {openB ? <ExpandLess /> : <ExpandMore />}
            </MenuBtn>

            <Collapse in={openB} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <MenuBtn sx={{ pl: 4 }} onClick={handleKM}>
                  <ListItemIcon>
                    <NoteAddIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Tạo khuyến mãi" />
                </MenuBtn>

                <MenuBtn sx={{ pl: 4 }} onClick={handleKmDB}>
                  <ListItemIcon>
                    <RequestQuoteIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Danh sách khuyến mãi" />
                </MenuBtn>
              </List>
            </Collapse>
            <ListItem disablePadding>
              <MenuBtn onClick={handleClickD}>
                <ListItemIcon>
                  <ReportIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Quản lý tài khoản" />
                {openD ? <ExpandLess /> : <ExpandMore />}
              </MenuBtn>
            </ListItem>
            <Collapse in={openD} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <MenuBtn sx={{ pl: 4 }} onClick={handleACc}>
                  <ListItemIcon>
                    <SupervisorAccountIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Khách hàng" />
                </MenuBtn>

                <MenuBtn sx={{ pl: 4 }} onClick={handleACc2}>
                  <ListItemIcon>
                    <SupportAgentIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Nhân viên" />
                </MenuBtn>
              </List>
            </Collapse>
            <ListItem disablePadding>
              <MenuBtn onClick={handleClickC}>
                <ListItemIcon>
                  <ReportIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Thống kê" />
                {openC ? <ExpandLess /> : <ExpandMore />}
              </MenuBtn>
            </ListItem>
            <Collapse in={openC} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <MenuBtn sx={{ pl: 4 }} onClick={handleTk}>
                  <ListItemIcon>
                    <NoteAddIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Phiếu nhập" />
                </MenuBtn>

                <MenuBtn sx={{ pl: 4 }} onClick={handleSale}>
                  <ListItemIcon>
                    <RequestQuoteIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText primary="Hóa đơn" />
                </MenuBtn>
              </List>
            </Collapse>
          </List>
        </Box>
      </Box>
    </BoxSide>
  );
}

export default memo(LeftAdmin);
