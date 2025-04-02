import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";

import {
  Title,
  ArgumentAxis,
  ValueAxis,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { energyConsumption } from "../../Component/data";

import { scalePoint } from "d3-scale";
import {
  Animation,
  LineSeries,
  ArgumentScale,
} from "@devexpress/dx-react-chart";
import {
  CheckStatus,
  Item,
  ItemList,
  Label,
  Line,
  StyledChart,
  Text,
  ValueDate,
  classes,
} from "../../Component/Style.js";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const DashBoard = () => {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  useEffect(() => {
    axios
      .get("/api/v1/orders/getAllOrder")
      .then(function (response) {
        setData(response.data.filter((item) => item.statusOrder === "1"));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Người mua",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      renderCell: (params) => <CheckStatus {...params} />,
      flex: 1,
    },
    {
      field: "date",
      headerName: "Ngày lập",
      flex: 1,
      renderCell: (params) => <ValueDate {...params} />,
    },
  ];
  const handleOnCellClick = (params) => {
    // navigate(`/CheckOut/${params.id}`);
    window.open(`/DoAnTotNghiep/#/CheckOut/${params.id}`, "_blank");
  };

  const datatable = () => {
    if (Array.isArray(data) && data.length !== 0) {
      return (
        <Box height={450} width="99%" bgcolor={"#ffffff"}>
          <DataGrid
            localeText={{
              toolbarColumns: "Cột",
              toolbarDensity: "Khoảng cách",
              toolbarFilters: "Lọc",
              toolbarExport: "Xuất",
            }}
            rowHeight={50}
            rows={data.map((item) => ({
              id: item.id,
              name: item.customer.lastName + " " + item.customer.firstName,
              status: item.statusOrder,
              date: item.date,
            }))}
            density="comfortable"
            columns={columns}
            pageSizeOptions={[10, 50, 100]}
            initialState={{
              ...data.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            onCellDoubleClick={handleOnCellClick}
            hideFooter
            getRowHeight={() => "auto"}
            sx={{
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: 1,
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "8px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "10px",
              },
            }}
          />
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            height: 450,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%" }}>
          <Header setShow={setShow} show={show} />
          <Box sx={{ width: "moz-fit-width", paddingLeft: 2, paddingRight: 2 }}>
            <Typography variant="h4" sx={{ paddingTop: 1 }}>
              Bảng điều khiển
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 1, sm: 8, md: 12 }}
              >
                <Grid xs={3}>
                  <ItemList>
                    <Typography>Doanh thu</Typography>
                    <Typography variant="h4">
                      {(1153330)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      đ
                    </Typography>
                  </ItemList>
                </Grid>
                <Grid xs={3}>
                  <ItemList>
                    <Typography>Số lượng đơn hàng</Typography>
                    <Typography variant="h4">5</Typography>
                  </ItemList>
                </Grid>
                <Grid xs={3}>
                  <ItemList>
                    <Typography>Số lượng đơn nhập</Typography>
                    <Typography variant="h4">2</Typography>
                  </ItemList>
                </Grid>
                <Grid xs={3}>
                  <ItemList>
                    <Typography>Số lượng khuyến mãi</Typography>
                    <Typography variant="h4">3</Typography>
                  </ItemList>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Stack
            direction="row"
            sx={{
              marginTop: 2,
              gap: 5,
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            <Box sx={{ flex: 1, height: "60vh" }}>
              <Paper>
                <StyledChart
                  height={500}
                  data={energyConsumption}
                  className={classes.chart}
                >
                  <ArgumentScale factory={scalePoint} />
                  <ArgumentAxis />
                  <ValueAxis />

                  <LineSeries
                    name="Mua trực tiếp"
                    valueField="hydro"
                    argumentField="country"
                    seriesComponent={Line}
                  />
                  <LineSeries
                    name="Mua Online"
                    valueField="oil"
                    argumentField="country"
                    seriesComponent={Line}
                  />

                  <Legend
                    position="bottom"
                    itemComponent={Item}
                    labelComponent={Label}
                  />
                  <Title
                    text="Số lượng bán qua các năm (2010 - 2015)"
                    textComponent={Text}
                  />
                  <Animation />
                </StyledChart>
              </Paper>
            </Box>
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Paper>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Đơn hàng đang chờ xử lý
                </Typography>
                {datatable()}
                {/* <Chart data={dataColumn} height={400} width={600}>
                  <ArgumentAxis />
                  <ValueAxis />
                  <BarSeries valueField="population" argumentField="year" />
                  <Title text="Doanh thu qua các năm" />
                  <EventTracker />
                  <Tooltip />
                </Chart> */}
              </Paper>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default DashBoard;
