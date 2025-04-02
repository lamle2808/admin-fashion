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
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#000000",
  },
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
  if (value === "1") {
    return <div>Đang xử lý</div>;
  } else if (value === "2") {
    return <div>Đang vận chuyển</div>;
  } else if (value === "3") {
    return <div>Hoàn thành</div>;
  } else {
    return <div>Đã hủy</div>;
  }
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
  borderRadius: 20,
  backgroundColor: "#81C3FF",
  color: "white",
  marginTop: 10,
  ":hover": {
    backgroundColor: "#2c6fbf",
  },
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
