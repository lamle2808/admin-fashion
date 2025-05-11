import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { StackHeader, Search } from "./Style";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Logout, Settings } from "@mui/icons-material";
import { memo, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

function Header({ show, setShow, text }) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [data, setData] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePf = () => {
    setAnchorEl(null);
    navigate("/Profile");
  };
  const handleSetting = () => {
    setAnchorEl(null);
  };
  return (
    <StackHeader 
      direction="row" 
      color={"text.primary"} 
      spacing={2}
      sx={{
        px: 3,
        py: 1.5,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        height: 64
      }}
    >
      <IconButton onClick={() => setShow(!show)} sx={{ mr: 1 }}>
        <MenuIcon />
      </IconButton>

      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 500, 
          flexGrow: 0, 
          mr: 3,
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </Typography>

      <Search sx={{ flexGrow: 1, maxWidth: 500 }}>
        <InputBase
          sx={{ 
            ml: 2, 
            width: '90%', 
            fontSize: 16,
            '& input': {
              py: 1
            }
          }}
          fullWidth
          placeholder="Tìm kiếm..."
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </Search>

      <Stack 
        direction="row" 
        spacing={1}
        alignItems="center"
      >
        <IconButton size="medium">
          <NotificationsIcon />
        </IconButton>

        <Box>
          <Tooltip title="Tài khoản">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              {data.avatar !== null ? (
                <Avatar
                  alt="Avatar"
                  src={data.avatar}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {data?.name?.charAt(0) || "A"}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          // onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handlePf}>
            {data.avatar !== null ? (
              <Avatar alt="Avatar" src={data.avatar} />
            ) : (
              <Avatar>V</Avatar>
            )}
            Trang cá nhân
          </MenuItem>

          <Divider />
          <MenuItem onClick={handleSetting}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Cài đặt
          </MenuItem>
          <MenuItem onClick={() => navigate("/")}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Đăng xuất
          </MenuItem>
        </Menu>
      </Stack>
    </StackHeader>
  );
}

export default memo(Header);
