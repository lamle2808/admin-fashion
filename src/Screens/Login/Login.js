import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { BtnLog, BoxLogin } from "./Style";

import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

var regEmail = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z]{2,4})+$/;
var regpass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/api/v1/auth/login", {
        email: userName,
        passWordA: password,
      })
      .then(function (response) {
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("key", response.data.phone);
        const userRoles = response.data.account.roles;
        const roleWithId3 = userRoles.find((role) => role.id === 3);
        if (roleWithId3 === undefined) {
          localStorage.setItem("asd", "asd");
        } else {
          localStorage.setItem("asd", "123");
        }
        navigate("/DashBoard");
      })
      .catch(function (error) {
        console.log(error);
        Swal.fire({
          title: "Thất bại",
          text: "Sai mật khẩu",
          icon: "error",
        });
      });
  };

  const handleChangleUserName = (e) => {
    if (regEmail.test(e)) {
      setUserName(e);
      setUserNameError(false);
    } else {
      setUserName("");
      setUserNameError(true);
    }
  };

  const handleChanglePassword = (e) => {
    if (regpass.test(e)) {
      setPassword(e);
      setPasswordError(false);
    } else {
      setPassword("");
      setPasswordError(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          marginTop: 5,
        }}
      >
        <BoxLogin>
          <Box sx={{ textAlign: "center", marginBottom: 5 }}>
            <Typography variant="h3">Đăng nhập</Typography>
          </Box>

          <Box>
            <form noValidate onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                onChange={(e) => handleChangleUserName(e.target.value)}
                error={userNameError}
              />

              <TextField
                label="Mật khẩu"
                error={passwordError}
                onChange={(e) => handleChanglePassword(e.target.value)}
                style={{ marginTop: 20, marginBottom: 20 }}
                fullWidth
                type={showPass ? "text" : "password"}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={showPass ? "Hiện" : "Ẩn"}>
                        <IconButton onClick={() => setShowPass(!showPass)}>
                          {showPass ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />

              <Box style={{ justifyContent: "center", textAlign: "center" }}>
                <BtnLog type="submit" variant="contained">
                  đăng nhập
                </BtnLog>
              </Box>
            </form>
          </Box>
        </BoxLogin>
      </Box>
    </Box>
  );
}

export default Login;
