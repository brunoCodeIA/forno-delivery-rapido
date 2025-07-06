import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CustomerAccess from "./pages/CustomerAccess";
import CustomerAddress from "./pages/CustomerAddress";
import CustomerCatalog from "./pages/CustomerCatalog";
import CustomerCheckout from "./pages/CustomerCheckout";
import CustomerTracking from "./pages/CustomerTracking";
import StaffAccess from "./pages/StaffAccess";
import StaffDashboard from "./pages/StaffDashboard";
import AdminAccess from "./pages/AdminAccess";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/customer" element={<CustomerAccess />} />
          <Route path="/customer/address" element={<CustomerAddress />} />
          <Route path="/customer/catalog" element={<CustomerCatalog />} />
          <Route path="/customer/checkout" element={<CustomerCheckout />} />
          <Route path="/customer/tracking" element={<CustomerTracking />} />
          <Route path="/staff" element={<StaffAccess />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/admin" element={<AdminAccess />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
