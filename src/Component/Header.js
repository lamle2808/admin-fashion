import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { StackHeader, Search } from "./Style";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";

function Header({ text, show, setShow }) {
  const [click, setClick] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};

  const handleClick = () => {
    setClick(!click);
    setShow(!show);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    // Xử lý đăng xuất
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <StackHeader
      direction={"row"}
      sx={{
        width: "100%",
        px: 3,
        py: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        backgroundColor: "white"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={handleClick}
          sx={{
            borderRadius: "8px",
            backgroundColor: click ? "#f0f7ff" : "transparent",
            color: click ? "#1976d2" : "inherit",
            transition: "all 0.2s ease",
            '&:hover': {
              backgroundColor: "#e3f2fd"
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          className="fade-in"
          sx={{ 
            fontWeight: 600,
            color: "#1976d2",
            display: { xs: "none", sm: "block" },
            letterSpacing: "0.2px",
          }}
        >
          {text}
        </Typography>
      </Box>

      <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <Paper
          component="form"
          sx={{
            p: '2px 12px',
            display: 'flex',
            alignItems: 'center',
            width: { xs: 150, sm: 250, md: 300 },
            borderRadius: "50px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #eeeeee",
            backgroundColor: "#f9f9f9",
            transition: "all 0.3s ease",
            '&:hover': {
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              backgroundColor: "#ffffff"
            }
          }}
        >
          <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm kiếm..."
            inputProps={{ 'aria-label': 'tìm kiếm' }}
          />
        </Paper>

        {/* Notification Icon */}
        <Tooltip title="Thông báo">
          <IconButton 
            onClick={handleNotificationClick}
            sx={{
              backgroundColor: notificationOpen ? "#f0f7ff" : "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid #eeeeee",
              transition: "all 0.2s ease",
              '&:hover': {
                backgroundColor: "#e3f2fd"
              }
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Dropdown menu for notifications */}
        <Menu
          anchorEl={notificationAnchorEl}
          id="notification-menu"
          open={notificationOpen}
          onClose={handleNotificationClose}
          onClick={handleNotificationClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              borderRadius: '12px',
              minWidth: 300,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Thông báo</Typography>
          </Box>
          
          <MenuItem sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Đơn hàng mới #2342</Typography>
              <Typography variant="caption" color="text.secondary">
                15 phút trước
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Cập nhật lô hàng PNH2610</Typography>
              <Typography variant="caption" color="text.secondary">
                2 giờ trước
              </Typography>
            </Box>
          </MenuItem>
          
          <MenuItem sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Sắp hết hàng sản phẩm #SP032</Typography>
              <Typography variant="caption" color="text.secondary">
                Hôm qua, 14:30
              </Typography>
            </Box>
          </MenuItem>
          
          <Divider />
          <MenuItem sx={{ justifyContent: 'center', color: 'primary.main', py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Xem tất cả thông báo</Typography>
          </MenuItem>
        </Menu>

        {/* Profile Avatar and Menu */}
        <Tooltip title="Tài khoản">
          <IconButton
            onClick={handleProfileClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{
              ml: 1,
              backgroundColor: open ? "#f0f7ff" : "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid #eeeeee",
              padding: "4px",
              transition: "all 0.2s ease",
              '&:hover': {
                backgroundColor: "#e3f2fd"
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: "#1976d2"
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Dropdown menu for account */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleProfileClose}
          onClick={handleProfileClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              borderRadius: '12px',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user.name || "User"}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email || "user@example.com"}
            </Typography>
          </Box>
          
          <MenuItem onClick={() => navigate('/Profile')}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Thông tin cá nhân
          </MenuItem>
          
          <MenuItem>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Cài đặt
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Đăng xuất
          </MenuItem>
        </Menu>
      </Stack>
    </StackHeader>
  );
}

export default Header;
