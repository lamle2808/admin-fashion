import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BarChartIcon from "@mui/icons-material/BarChart";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CampaignIcon from "@mui/icons-material/Campaign";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DescriptionIcon from "@mui/icons-material/Description";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssessmentIcon from "@mui/icons-material/Assessment";
import logo from "../Assert/logo.png";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const MenuButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: '#81C3FF',
  color: 'white',
  marginTop: 8,
  marginBottom: 2,
  padding: '10px 16px',
  "&:hover": {
    backgroundColor: "#5da8e9",
  },
  "&.Mui-selected": {
    backgroundColor: "#5da8e9",
    color: "white",
    "&:hover": {
      backgroundColor: "#5da8e9",
    }
  }
}));

const SubMenuButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: '#81C3FF',
  color: 'white',
  marginTop: 4,
  marginBottom: 2,
  marginLeft: 15,
  padding: '8px 16px',
  width: "calc(100% - 15px)",
  "&:hover": {
    backgroundColor: "#5da8e9",
  },
  "&.Mui-selected": {
    backgroundColor: "#5da8e9",
    color: "white",
    "&:hover": {
      backgroundColor: "#5da8e9",
    }
  }
}));

function Left() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openOrder, setOpenOrder] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openPromo, setOpenPromo] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const navigate = useNavigate();

  const handleClick = (index, path) => {
    setSelectedIndex(index);
    navigate(path);
  };

  const handleToggleOrder = () => {
    setOpenOrder(!openOrder);
  };

  const handleToggleImport = () => {
    setOpenImport(!openImport);
  };

  const handleTogglePromo = () => {
    setOpenPromo(!openPromo);
  };

  const handleToggleAccount = () => {
    setOpenAccount(!openAccount);
  };

  const handleToggleStats = () => {
    setOpenStats(!openStats);
  };

  useEffect(() => {
    const path = window.location.hash.substring(1);
    
    // Map the path to the index
    if (path === "/DashBoard") setSelectedIndex(0);
    else if (path === "/Product") setSelectedIndex(1);
    else if (path === "/ImportOrder" || path === "/CreateImportOrder" || path.startsWith("/ImportOrderData")) {
      setSelectedIndex(2);
      setOpenImport(true);
    }
    else if (path === "/CheckOut" || path.includes("/CheckOut/")) {
      setSelectedIndex(3);
      setOpenOrder(true);
    }
    else if (path === "/CreateBill") {
      setSelectedIndex(4);
      setOpenOrder(true);
    }
    else if (path === "/Brand") setSelectedIndex(7);
    else if (path === "/Distributor") setSelectedIndex(9);
    else if (path === "/Sale") {
      setSelectedIndex(10);
      setOpenPromo(true);
    }
    else if (path === "/SaleDB" || path.startsWith("/SaleDetail/")) {
      setSelectedIndex(11);
      setOpenPromo(true);
    }
    else if (path === "/Account") {
      setSelectedIndex(12);
      setOpenAccount(true);
    }
    else if (path === "/Employee") {
      setSelectedIndex(13);
      setOpenAccount(true);
    }
    else if (path === "/Statistics" || path === "/SaleStatistics") {
      setSelectedIndex(14);
      setOpenStats(true);
    }
  }, []);

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        bgcolor: "#f0f6ff",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <img src={logo} alt="logo" width="130" />
      </Box>

      {/* Menu */}
      <List sx={{ px: 2 }}>
        {/* Dashboard */}
        <ListItem disablePadding>
          <MenuButton
            onClick={() => handleClick(0, "/DashBoard")}
            selected={selectedIndex === 0}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </MenuButton>
        </ListItem>

        {/* Order Management */}
        <ListItem disablePadding>
          <MenuButton
            onClick={handleToggleOrder}
            selected={selectedIndex === 3 || selectedIndex === 4}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý hóa đơn" />
            {openOrder ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </MenuButton>
        </ListItem>

        {/* Order Management Submenu */}
        <Collapse in={openOrder} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <SubMenuButton
              onClick={() => handleClick(4, "/CreateBill")}
              selected={selectedIndex === 4}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tạo hóa đơn" />
            </SubMenuButton>
            <SubMenuButton
              onClick={() => handleClick(3, "/CheckOut")}
              selected={selectedIndex === 3}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <ReceiptIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Danh sách hóa đơn" />
            </SubMenuButton>
          </List>
        </Collapse>

        {/* Import Management */}
        <ListItem disablePadding>
          <MenuButton
            onClick={handleToggleImport}
            selected={selectedIndex === 2 || selectedIndex === 5 || selectedIndex === 6}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý nhập hàng" />
            {openImport ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </MenuButton>
        </ListItem>

        {/* Import Management Submenu */}
        <Collapse in={openImport} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <SubMenuButton
              onClick={() => handleClick(5, "/ImportOrder")}
              selected={selectedIndex === 5}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Phiếu nhập" />
            </SubMenuButton>
            <SubMenuButton
              onClick={() => handleClick(6, "/ImportOrderData")}
              selected={selectedIndex === 6}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <ReceiptIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Danh sách đơn nhập" />
            </SubMenuButton>
          </List>
        </Collapse>

        {/* Brand */}
        <ListItem disablePadding>
          <MenuButton
            onClick={() => handleClick(7, "/Brand")}
            selected={selectedIndex === 7}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <BrandingWatermarkIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý thương hiệu" />
          </MenuButton>
        </ListItem>

        {/* Products */}
        <ListItem disablePadding>
          <MenuButton
            onClick={() => handleClick(8, "/Product")}
            selected={selectedIndex === 8}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý sản phẩm" />
          </MenuButton>
        </ListItem>

        {/* Distributor */}
        <ListItem disablePadding>
          <MenuButton
            onClick={() => handleClick(9, "/Distributor")}
            selected={selectedIndex === 9}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý nhà phân phối" />
          </MenuButton>
        </ListItem>

        {/* Promotion Management */}
        <ListItem disablePadding>
          <MenuButton
            onClick={handleTogglePromo}
            selected={selectedIndex === 10 || selectedIndex === 11}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý khuyến mãi" />
            {openPromo ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </MenuButton>
        </ListItem>

        {/* Promotion Management Submenu */}
        <Collapse in={openPromo} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <SubMenuButton
              onClick={() => handleClick(10, "/Sale")}
              selected={selectedIndex === 10}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Tạo khuyến mãi" />
            </SubMenuButton>
            <SubMenuButton
              onClick={() => handleClick(11, "/SaleDB")}
              selected={selectedIndex === 11}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <ReceiptIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Danh sách khuyến mãi" />
            </SubMenuButton>
          </List>
        </Collapse>

        {/* Account Management */}
        <ListItem disablePadding>
          <MenuButton
            onClick={handleToggleAccount}
            selected={selectedIndex === 12 || selectedIndex === 13}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý tài khoản" />
            {openAccount ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </MenuButton>
        </ListItem>

        {/* Account Management Submenu */}
        <Collapse in={openAccount} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <SubMenuButton
              onClick={() => handleClick(12, "/Account")}
              selected={selectedIndex === 12}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Khách hàng" />
            </SubMenuButton>
            <SubMenuButton
              onClick={() => handleClick(13, "/Employee")}
              selected={selectedIndex === 13}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Nhân viên" />
            </SubMenuButton>
          </List>
        </Collapse>

        {/* Statistics */}
        <ListItem disablePadding>
          <MenuButton
            onClick={handleToggleStats}
            selected={selectedIndex === 14 || selectedIndex === 15 || selectedIndex === 16}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Thống kê" />
            {openStats ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </MenuButton>
        </ListItem>

        {/* Statistics Submenu */}
        <Collapse in={openStats} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <SubMenuButton
              onClick={() => handleClick(15, "/Statistics")}
              selected={selectedIndex === 15}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Phiếu nhập" />
            </SubMenuButton>
            <SubMenuButton
              onClick={() => handleClick(16, "/SaleStatistics")}
              selected={selectedIndex === 16}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <ReceiptIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Hóa đơn" />
            </SubMenuButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
}

export default Left;
