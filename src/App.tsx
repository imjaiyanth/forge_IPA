import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Company from "./pages/Company";
import Members from "./pages/Members";
import Clients from "./pages/Clients";
import Vendors from "./pages/Vendors";
import Projects from "./pages/Projects";
import Estimations from "./pages/Estimations";
import Estimation from "./pages/Estimation";
import Quotation from "./pages/Quotation";
import WorkOrder from "./pages/WorkOrder";
import Certificate from "./pages/Certificate";
import VendorPO from "./pages/VendorPO";
import PackingList from "./pages/PackingList";
import DeliveryPackage from "./pages/DeliveryPackage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<Company />} />
          <Route path="/members" element={<Members />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/estimations" element={<Estimations />} />
          <Route path="/estimation/:id" element={<Estimation />} />
          <Route path="/quotation/:id" element={<Quotation />} />
          <Route path="/work-order/:id" element={<WorkOrder />} />
          <Route path="/certificate/:id" element={<Certificate />} />
          <Route path="/vendor-po/:id" element={<VendorPO />} />
          <Route path="/packing-list/:id" element={<PackingList />} />
          <Route path="/delivery-package/:id" element={<DeliveryPackage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
