import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Setup from "./pages/Setup";
import Products from "./pages/Products";
import Research from "./pages/Research";
import Orders from "./pages/Orders";
import ContentGenerator from "./pages/ContentGenerator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="setup" element={<Setup />} />
          <Route path="products" element={<Products />} />
          <Route path="research" element={<Research />} />
          <Route path="orders" element={<Orders />} />
          <Route path="content" element={<ContentGenerator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
