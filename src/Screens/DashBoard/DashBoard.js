import { 
  Box, 
  CircularProgress, 
  Stack, 
  Typography, 
  Grid, 
  Divider,
  Chip
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";

import {
  Title,
  ArgumentAxis,
  ValueAxis,
  Legend,
  LineSeries,
  Tooltip
} from "@devexpress/dx-react-chart-material-ui";
import { energyConsumption } from "../../Component/data";

import { scalePoint } from "d3-scale";
import {
  Animation,
  ArgumentScale,
  EventTracker
} from "@devexpress/dx-react-chart";
import {
  Item,
  Label,
  Line,
  StyledChart,
  StylePaper,
  classes,
} from "../../Component/Style.js";
import Left from "../../Component/Left";
import Header from "../../Component/Header";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

// Icons
import PaidIcon from '@mui/icons-material/Paid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const DashBoard = () => {
  const [show, setShow] = useState(true);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/v1/orders/getAllOrder")
      .then(function (response) {
        setData(response.data.filter((item) => item.statusOrder === "1"));
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Định dạng số tiền thành chuỗi có dấu phân cách
  const formatCurrency = (amount) => {
    if (!amount) return "0";
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Component tooltip tùy chỉnh
  const CustomTooltipContent = props => {
    const { targetItem, text, ...restProps } = props;
    
    return (
      <Tooltip.Content
        {...restProps}
        text={text}
        style={{ fontWeight: 'bold', backgroundColor: '#ffffff', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
      />
    );
  };

  // Custom component hiển thị trạng thái đơn hàng
  const OrderStatus = ({ value }) => {
    const getColorByStatus = (status) => {
      switch (status) {
        case "1": return { bg: "#e3f2fd", color: "#2c6fbf", label: "Đang chờ xử lý" };
        case "2": return { bg: "#fff8e1", color: "#f57c00", label: "Đang giao hàng" };
        case "3": return { bg: "#e8f5e9", color: "#2e7d32", label: "Đã giao hàng" };
        case "4": return { bg: "#ffebee", color: "#d32f2f", label: "Đã hủy" };
        default: return { bg: "#f5f5f5", color: "#757575", label: "Không xác định" };
      }
    };
    
    const statusInfo = getColorByStatus(value);
    
    return (
      <Chip 
        label={statusInfo.label}
        sx={{ 
          backgroundColor: statusInfo.bg,
          color: statusInfo.color,
          fontWeight: 600,
          borderRadius: '8px',
          '& .MuiChip-label': { px: 1.5 }
        }}
      />
    );
  };

  // Custom component hiển thị ngày tháng
  const DateFormat = ({ value }) => {
    const date = new Date(value);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
    return (
      <Typography variant="body2" fontWeight={500}>
        {formattedDate}
      </Typography>
    );
  };

  const columns = [
    { 
      field: "id", 
      headerName: "Mã đơn hàng", 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="#2c6fbf">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Khách hàng",
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      renderCell: (params) => <OrderStatus value={params.value} />,
      flex: 1.5,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "date",
      headerName: "Ngày đặt",
      flex: 1,
      renderCell: (params) => <DateFormat value={params.value} />,
      align: 'center',
      headerAlign: 'center',
    },
  ];
  
  const handleOnCellClick = (params) => {
    window.open(`/DoAnTotNghiep/#/CheckOut/${params.id}`, "_blank");
  };

  const datatable = () => {
    if (loading) {
      return (
        <Box
          sx={{
            height: 450,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    
    if (Array.isArray(data) && data.length !== 0) {
      return (
        <Box 
          sx={{
            height: 450, 
            width: "100%", 
            backgroundColor: "#fff",
            borderRadius: '8px',
            overflow: 'hidden',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f7fa',
              borderBottom: '1px solid #e0e0e0',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9fafb',
            }
          }}
        >
          <DataGrid
            localeText={{
              toolbarColumns: "Cột",
              toolbarDensity: "Khoảng cách",
              toolbarFilters: "Lọc",
              toolbarExport: "Xuất",
              noRowsLabel: "Không có dữ liệu",
            }}
            rowHeight={60}
            rows={data.map((item) => ({
              id: item.id,
              name: item.customer.lastName + " " + item.customer.firstName,
              status: item.statusOrder,
              date: item.date,
            }))}
            density="comfortable"
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            onCellDoubleClick={handleOnCellClick}
            disableRowSelectionOnClick
            getRowHeight={() => "auto"}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-cell:focus-within': {
                outline: 'none',
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
            backgroundColor: "#fff",
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Không có đơn hàng nào cần xử lý
          </Typography>
        </Box>
      );
    }
  };

  // Style cho thẻ thông tin
  const infoCardStyle = {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    }
  };

  // Style cho biểu tượng
  const iconStyle = {
    padding: '15px',
    borderRadius: '12px',
    fontSize: '2.5rem',
    marginRight: '20px',
  };

  return (
    <Box sx={{ justifyContent: "center", minHeight: "100%" }}>
      <Stack direction="row">
        {show && <Left />}
        <Box sx={{ width: "100%", minWidth: "70%" }}>
          <Header setShow={setShow} show={show} />
          <Box
            bgcolor={"#EEF5FD"}
            sx={{
              height: "91vh",
              padding: 3,
              overflowY: "auto",
            }}
          >
            <Box mb={3}>
              <Typography variant="h4" fontWeight={600} color="#2c6fbf">
                Bảng điều khiển
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Tổng quan về hoạt động kinh doanh
              </Typography>
            </Box>

            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{
                  ...infoCardStyle,
                  borderLeft: '5px solid #2c6fbf',
                }}>
                  <Box sx={{
                    ...iconStyle,
                    backgroundColor: '#e3f2fd',
                    color: '#2c6fbf',
                  }}>
                    <PaidIcon fontSize="inherit" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                      Doanh thu
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="#2c6fbf">
                      {formatCurrency(1153330)} đ
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{
                  ...infoCardStyle,
                  borderLeft: '5px solid #f57c00',
                }}>
                  <Box sx={{
                    ...iconStyle,
                    backgroundColor: '#fff8e1',
                    color: '#f57c00',
                  }}>
                    <ShoppingCartIcon fontSize="inherit" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                      Đơn hàng
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="#f57c00">
                      5
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{
                  ...infoCardStyle,
                  borderLeft: '5px solid #2e7d32',
                }}>
                  <Box sx={{
                    ...iconStyle,
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                  }}>
                    <LocalShippingIcon fontSize="inherit" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                      Đơn nhập
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="#2e7d32">
                      2
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{
                  ...infoCardStyle,
                  borderLeft: '5px solid #d32f2f',
                }}>
                  <Box sx={{
                    ...iconStyle,
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',
                  }}>
                    <LocalOfferIcon fontSize="inherit" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                      Khuyến mãi
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="#d32f2f">
                      3
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <StylePaper sx={{ height: '100%', p: 2 }}>
                  <Typography variant="h5" fontWeight={600} color="#2c6fbf" mb={1}>
                    Số lượng bán qua các năm (2010 - 2015)
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <StyledChart
                    height={400}
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
                      color="#2c6fbf"
                    />
                    <LineSeries
                      name="Mua Online"
                      valueField="oil"
                      argumentField="country"
                      seriesComponent={Line}
                      color="#f57c00"
                    />

                    <Legend
                      position="bottom"
                      itemComponent={Item}
                      labelComponent={Label}
                    />
                    <EventTracker />
                    <Tooltip contentComponent={CustomTooltipContent} />
                    <Animation />
                  </StyledChart>
                </StylePaper>
              </Grid>
              <Grid item xs={12} md={5}>
                <StylePaper sx={{ height: '100%', p: 2 }}>
                  <Typography variant="h5" fontWeight={600} color="#2c6fbf" mb={1}>
                    Đơn hàng đang chờ xử lý
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {datatable()}
                </StylePaper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default DashBoard;
