import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import CreateGig from "./pages/CreateGig";
import EditGig from "./pages/EditGig";
import GigDetail from "./pages/GigDetail";
import Explore from "./pages/Explore";
import SellerDashboard from "./pages/CreatorDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import OrderDetail from "./pages/OrderDetail";
import BecomeSeller from "./pages/BecomeCreator";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <WalletProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/gig/:id" element={<GigDetail />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/become-creator" element={<ProtectedRoute><BecomeSeller /></ProtectedRoute>} />
              <Route path="/become-seller" element={<ProtectedRoute><BecomeSeller /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
              <Route path="/create-gig" element={<ProtectedRoute><CreateGig /></ProtectedRoute>} />
              <Route path="/edit-gig/:id" element={<ProtectedRoute><EditGig /></ProtectedRoute>} />
              <Route path="/dashboard/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/buyer" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WalletProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
