import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CategoryIcon from "@mui/icons-material/Category";
import LayersIcon from "@mui/icons-material/Layers";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import InventoryIcon from "@mui/icons-material/Inventory";

import Left from "../../Component/Left";
import Header from "../../Component/Header";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ValueDate,
  ModernCard,
  CardTitle,
  TableContainer,
  ActionButton,
  StyledChip,
  commonStyles,
} from "../../Component/Style";
import Swal from "sweetalert2";

const DetailInfoCard = ({ title, icon, children }) => (
  <ModernCard elevation={2} sx={{ p: 2, height: "100%" }}>
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
    <Divider sx={{ mb: 2 }} />
    {children}
  </ModernCard>
);

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
    <Box sx={{ mr: 1, color: "text.secondary" }}>{icon}</Box>
    <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>
      {label}:
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 500 }}>
      {value || "N/A"}
    </Typography>
  </Box>
);

function ImportDetail() {
  const [show, setShow] = useState(true);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/v1/importOrders/getById/${id}`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
        if (res.data && res.data.importOrderDetail) {
          const sum = res.data.importOrderDetail.reduce(
            (acc, item) => acc + item.importPrice * item.quantity,
            0
          );
          setTotalValue(sum);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        Swal.fire({
          title: "Lỗi",
          text: "Không thể lấy thông tin chi tiết đơn nhập. Vui lòng thử lại sau.",
          icon: "error",
        });
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    Swal.fire({
      title: "Đang xử lý",
      text: "Đang chuẩn bị file PDF...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Giả lập việc xuất PDF
    setTimeout(() => {
      Swal.fire({
        title: "Thành công",
        text: "Đã xuất file PDF thành công",
        icon: "success",
      });
    }, 1500);
  };

  if (loading) {
      return (
      <Box sx={{ display: "flex" }}>
        <Left />
        <Box
          component="main"
          sx={{
            flexGrow: 1, 
            bgcolor: "background.default", 
            p: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh" 
          }}
        >
          <CircularProgress />
        </Box>
        </Box>
      );
    }

  return (
    <Box sx={{ display: "flex" }}>
      <Left />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Header text={`Chi tiết phiếu nhập #${id}`} show={show} setShow={setShow} />
        
        {order ? (
          <Box className="fade-in" sx={{ ...commonStyles.pageContainer }}>
            {/* Header */}
            <ModernCard elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Quay lại">
                    <IconButton 
                      onClick={() => navigate("/ImportOrder")}
                      sx={{ mr: 2, bgcolor: "#f5f5f5" }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Chi tiết phiếu nhập #{id}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", gap: 1 }}>
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                  >
                    In
                  </ActionButton>
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportPDF}
                  >
                    Xuất PDF
                  </ActionButton>
                </Box>
              </Box>
              
              <Box sx={{ mt: 2, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <StyledChip 
                  icon={<InventoryIcon />} 
                  label="Phiếu nhập"
                  color="primary"
                />
                {order.date && (
                  <StyledChip 
                    label={`Ngày tạo: ${new Date(order.date).toLocaleDateString("vi-VN")}`}
                    color="default" 
                  />
                )}
                <StyledChip 
                  label={`Tổng giá trị: ${totalValue.toLocaleString()} VNĐ`}
                  color="success" 
                />
              </Box>
            </ModernCard>
            
            {/* Info Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <DetailInfoCard 
                  title="Thông tin nhân viên" 
                  icon={<PersonIcon color="primary" />}
                >
                  {order.employee && (
                    <>
                      <InfoRow 
                        icon={<PersonIcon fontSize="small" />}
                        label="Họ tên" 
                        value={`${order.employee.lastName} ${order.employee.firstName}`} 
                      />
                      <InfoRow 
                        icon={<EmailIcon fontSize="small" />}
                        label="Email" 
                        value={order.employee.email} 
                      />
                      <InfoRow 
                        icon={<PhoneIcon fontSize="small" />}
                        label="Điện thoại" 
                        value={order.employee.phone} 
                      />
                    </>
                  )}
                </DetailInfoCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DetailInfoCard 
                  title="Thông tin nhà cung cấp" 
                  icon={<LocalShippingIcon color="primary" />}
                >
                  {order.supplier && (
                    <>
                      <InfoRow 
                        icon={<PersonIcon fontSize="small" />}
                        label="Tên" 
                        value={order.supplier.name} 
                      />
                      <InfoRow 
                        icon={<EmailIcon fontSize="small" />}
                        label="Email" 
                        value={order.supplier.email} 
                      />
                      <InfoRow 
                        icon={<PhoneIcon fontSize="small" />}
                        label="Điện thoại" 
                        value={order.supplier.phone} 
                      />
                    </>
                  )}
                </DetailInfoCard>
              </Grid>
            </Grid>
            
            {/* Products Table */}
            <ModernCard elevation={3} sx={{ p: 3 }}>
              <CardTitle>Danh sách sản phẩm</CardTitle>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Loại</TableCell>
                      <TableCell>Thương hiệu</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Giá nhập</TableCell>
                      <TableCell>Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.importOrderDetail && order.importOrderDetail.length > 0 ? (
                      order.importOrderDetail.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{typeof item.id === 'string' ? item.id.substring(0, 8) : item.id}</TableCell>
                          <TableCell>
                            <Box sx={{ fontWeight: 500 }}>
                              {item.loHang.product.productName}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Lô hàng: {typeof item.loHang.id === 'string' ? item.loHang.id.substring(0, 8) : item.loHang.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CategoryIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              {item.loHang.product.category?.categoryName || "N/A"}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <BrandingWatermarkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              {item.loHang.product.brand?.name || "N/A"}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <StyledChip 
                              label={item.loHang.product.quantity} 
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {parseInt(item.importPrice).toLocaleString()} VNĐ
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                              {(parseInt(item.importPrice) * parseInt(item.loHang.product.quantity)).toLocaleString()} VNĐ
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography sx={{ py: 3 }}>Không có sản phẩm</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    
                    <TableRow>
                      <TableCell colSpan={5}></TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Tổng cộng:
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1976d2' }}>
                        {totalValue.toLocaleString()} VNĐ
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </ModernCard>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <Typography>Không tìm thấy thông tin đơn nhập</Typography>
          </Box>
        )}
        </Box>
    </Box>
  );
}

export default ImportDetail;
