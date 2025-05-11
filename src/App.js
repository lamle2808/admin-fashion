import { Route, Routes } from "react-router-dom";
import DashBoard from "./Screens/DashBoard/DashBoard";
import Product from "./Screens/Product/Product";
import ImportOrder from "./Screens/ImportOrder/ImportOrder";
import ImportOrderData from "./Screens/ImportData/ImportData";
import CheckOut from "./Screens/CheckOut/CheckOut";
import Login from "./Screens/Login/Login";
import InvoiceDetails from "./Screens/InvoiceDetails/InvoiceDetails";
import CreateBill from "./Screens/CreateBill/CreateBill";
import ProductEdit from "./Screens/ProductEdit/ProductEdit";
import ImportExcel from "./Screens/ImportExcel/ImportExcel";
import ImportDetail from "./Screens/ImportDetail/ImportDetail";
import Sale from "./Screens/Sale/Sale";
import SaleDB from "./Screens/SaleDB/SaleDB";
import SaleDetails from "./Screens/SaleDB/SaleDetail";
import Account from "./Screens/Account/Account";
import AccountDetail from "./Screens/Account/AccountDetail";
import Statistics from "./Screens/Statistics/Statistics";
import Profile from "./Screens/Profile/Profile";
import SaleStatistics from "./Screens/Statistics/Sale";
import Brand from "./Screens/Brand/Brand";
import Employee from "./Screens/Employee/Employee";
import EmployeeDetail from "./Screens/Employee/EmployeeDetail";
import CreateEm from "./Screens/Create/Create";
import Distributor from './Screens/Distributor/Distributor';

function Router() {
  return (
    <Routes basename="/Fashion_shop">
      <Route path="/" element={<Login />} />
      <Route path="/DashBoard" element={<DashBoard />} />
      <Route path="/Product" element={<Product />} />
      <Route path="/ImportOrder" element={<ImportOrder />} />
      <Route path="/ImportOrderData" element={<ImportOrderData />} />
      <Route path="/ImportOrderData/:id" element={<ImportDetail />} />
      <Route path="/CheckOut" element={<CheckOut />} />
      <Route path="/CheckOut/:id" element={<InvoiceDetails />} />
      <Route path="/CreateBill" element={<CreateBill />} />
      <Route path="/Sale" element={<Sale />} />
      <Route path="/SaleDB" element={<SaleDB />} />
      <Route path="/SaleDetail/:id" element={<SaleDetails />} />
      <Route path="/Account/" element={<Account />} />
      <Route path="/Account/:id" element={<AccountDetail />} />
      <Route path="/Statistics/" element={<Statistics />} />
      <Route path="/SaleStatistics/" element={<SaleStatistics />} />
      <Route path="/ImportExcel" element={<ImportExcel />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Employee" element={<Employee />} />
      <Route path="/Brand" element={<Brand />} />
      <Route path="/ProductEdit/:id" element={<ProductEdit />} />
      <Route path="/Employee/:id" element={<EmployeeDetail />} />
      <Route path="/CreateEmployee" element={<CreateEm />} />
      <Route path="/Distributor" element={<Distributor />} />
    </Routes>
  );
}

export default Router;
