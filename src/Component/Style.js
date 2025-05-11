import {
  Chart,
  Legend,
  LineSeries,
} from "@devexpress/dx-react-chart-material-ui";
import {
  Box,
  Link,
  ListItemButton,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
  Button,
  FormControl,
} from "@mui/material";
import { curveCatmullRom, line } from "d3-shape";
import { useState } from "react";
import PropTypes from "prop-types";

export const StackHeader = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#F8F9F9" : "#292929",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: 10,
}));

export const Search = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#3A3B3C" : "#E8E8E8",
  borderRadius: 20,
  width: "30%",
  height: 40,
  "&:hover": {
    border: "1px solid currentColor",
  },
}));

export const ItemList = styled(Paper)(() => ({
  backgroundColor: "#fff",
  padding: 20,
}));

export const Item = (props) => (
  <Stack sx={{ float: "left" }}>
    <Legend.Item {...props} />
  </Stack>
);

const PREFIX = "Demo";

export const Root = (props) => (
  <Legend.Root
    {...props}
    sx={{ display: "flex", margin: "auto", flexDirection: "row" }}
  />
);

export const Label = (props) => (
  <Legend.Label {...props} sx={{ mb: 1, whiteSpace: "nowrap" }} />
);

export const classes = {
  title: `${PREFIX}-title`,
  chart: `${PREFIX}-chart`,
};

export const StyledChart = styled(Chart)(() => ({
  [`&.${classes.chart}`]: {
    paddingRight: "30px",
  },
}));

export const Line = (props) => (
  <LineSeries.Path
    {...props}
    path={line()
      .x(({ arg }) => arg)
      .y(({ val }) => val)
      .curve(curveCatmullRom)}
  />
);

export const Text = ({ text }) => {
  const [mainText, subText] = text.split("\\n");
  return (
    <StyledDiv className={classes.title}>
      <Typography component="h3" variant="h5">
        {mainText}
      </Typography>
      <Typography variant="subtitle1">{subText}</Typography>
    </StyledDiv>
  );
};

const StyledDiv = styled("div")(() => ({
  [`&.${classes.title}`]: {
    textAlign: "center",
    width: "100%",
    marginBottom: "10px",
  },
}));

export const ExpandableCell = ({ value }) => {
  const [expanded, setExpanded] = useState(false);
  const LinkView = styled(Link)(({ theme }) => ({
    color: theme.palette.mode === "dark" ? "#90CAD" : "blue",
    cursor: "pointer",
  }));
  ExpandableCell.propTypes = {
    value: PropTypes.any,
  };
  return (
    <Box>
      {expanded ? value : value.slice(0, 150)}&nbsp;
      {value.length > 150 && (
        <LinkView onClick={() => setExpanded(!expanded)}>
          {expanded ? "view less" : "view more"}
        </LinkView>
      )}
    </Box>
  );
};

export const TextInputAd = styled(TextField)(() => ({
  marginTop: 30,
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#000000",
  },
  "& .MuiInputBase-input": {
    fontSize: "1rem",
    padding: "14px 12px",
  },
  "& .MuiOutlinedInput-root": {
    minHeight: 56,
    borderRadius: "8px",
    transition: "all 0.3s",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#81C3FF",
      borderWidth: "1px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2c6fbf",
      borderWidth: "2px",
    }
  },
  "& input[type=number]": {
    minWidth: "120px",
    fontFamily: "monospace",
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#2c6fbf"
    }
  },
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    transform: "translateY(-1px)"
  }
}));

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.default",
  border: "2px solid gray",
  boxShadow: 24,
  color: "text.primary",
  p: 4,
  borderRadius: 5,
};

export const styleProduct = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.default",
  border: "2px solid gray",
  boxShadow: 24,
  color: "text.primary",
  p: 4,
  borderRadius: 10,
};

export const FormButton = styled(Button)(({ theme, color = "primary" }) => {
  const bgColors = {
    primary: 'linear-gradient(135deg, #81C3FF 0%, #5ca1e1 100%)',
    error: 'linear-gradient(135deg, #FF6B6B 0%, #e44d4d 100%)',
    success: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
    warning: 'linear-gradient(135deg, #FFA726 0%, #F57C00 100%)'
  };
  
  const hoverBgColors = {
    primary: 'linear-gradient(135deg, #5ca1e1 0%, #2c6fbf 100%)',
    error: 'linear-gradient(135deg, #e44d4d 0%, #c62828 100%)',
    success: 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
    warning: 'linear-gradient(135deg, #F57C00 0%, #EF6C00 100%)'
  };
  
  return {
    borderRadius: "8px",
    padding: "10px 24px",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    background: bgColors[color] || bgColors.primary,
    color: "white",
    minWidth: "120px",
    transition: "all 0.3s ease",
    "&:hover": {
      background: hoverBgColors[color] || hoverBgColors.primary,
      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
      transform: "translateY(-2px)"
    },
    "&:active": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transform: "translateY(0)"
    }
  };
});

export const StyledFormControl = styled(FormControl)(() => ({
  marginTop: 30,
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#2c6fbf"
    }
  },
  "& .MuiSelect-select": {
    padding: "14px 12px",
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#81C3FF",
      borderWidth: "1px",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2c6fbf",
      borderWidth: "2px",
    }
  },
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    transform: "translateY(-1px)"
  }
}));

export const StylePaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  padding: 3,
  borderRadius: 3,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  }
}));

export const ValueDate = ({ value }) => {
  const dateObject = new Date(value);
  const day = dateObject.getDate(); // Lấy ngày
  const month = dateObject.getMonth() + 1; // Lấy tháng (lưu ý: tháng trong JavaScript bắt đầu từ 0 nên phải cộng thêm 1)
  const year = dateObject.getFullYear(); // Lấy năm
  const hours = dateObject.getHours(); // Lấy giờ
  const minutes = dateObject.getMinutes(); // Lấy phút
  const date = `${hours}:${minutes} - ${day}/${month}/${year}`;
  return <div>{date}</div>;
};

export const ValueDateKM = ({ value }) => {
  const dateObject = new Date(value);
  const day = dateObject.getDate(); // Lấy ngày
  const month = dateObject.getMonth() + 1; // Lấy tháng (lưu ý: tháng trong JavaScript bắt đầu từ 0 nên phải cộng thêm 1)
  const year = dateObject.getFullYear(); // Lấy năm

  const date = `${day}/${month}/${year}`;
  return <div>{date}</div>;
};

export const CheckStatus = ({ value }) => {
  const getColorByStatus = (status) => {
    switch (status) {
      case "1":
        return "#FFA726"; // Màu cam cho chờ xác nhận
      case "2":
        return "#29B6F6"; // Màu xanh dương cho đang giao
      case "3":
        return "#66BB6A"; // Màu xanh lá cho hoàn thành
      case "4":
        return "#EF5350"; // Màu đỏ cho đã hủy
      default:
        return "#757575"; // Màu xám mặc định
    }
  };

  const getLabelByStatus = (status) => {
    switch (status) {
      case "1":
        return "Chờ xác nhận";
      case "2":
        return "Đang giao";
      case "3":
        return "Hoàn thành";
      case "4":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: `${getColorByStatus(value)}20`,
        color: getColorByStatus(value),
        fontWeight: "600",
        padding: "6px 12px",
        borderRadius: "16px",
        display: "inline-block",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        whiteSpace: "nowrap",
        textAlign: "center",
        border: `1px solid ${getColorByStatus(value)}40`,
        boxShadow: `0 1px 2px ${getColorByStatus(value)}10`,
      }}
    >
      {getLabelByStatus(value)}
    </Box>
  );
};

export const ValueDate2 = (value) => {
  const dateObject = new Date(value);
  const day = dateObject.getDate(); // Lấy ngày
  const month = dateObject.getMonth() + 1; // Lấy tháng (lưu ý: tháng trong JavaScript bắt đầu từ 0 nên phải cộng thêm 1)
  const year = dateObject.getFullYear(); // Lấy năm
  const hours = dateObject.getHours(); // Lấy giờ
  const minutes = dateObject.getMinutes(); // Lấy phút
  const date = `${hours}:${minutes} - ${day}/${month}/${year}`;
  return date;
};

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const MenuBtn = styled(ListItemButton)(() => ({
  borderRadius: 8,
  backgroundColor: '#81C3FF',
  color: 'white',
  marginTop: 8,
  marginBottom: 2,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  height: 46,
  padding: '4px 16px',
  ":hover": {
    backgroundColor: "#2c6fbf",
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
  "&.Mui-selected": {
    backgroundColor: "#2c6fbf",
    color: "white",
    "&:hover": {
      backgroundColor: "#235da3",
    }
  }
}));

export const NoteDiv = styled("div")(() => ({
  width: "100%",
  backgroundColor: "white",
  borderRadius: 20,
  height: 40,
  border: "1px solid black",
  display: "flex",
  justifyContent: "center",
}));
