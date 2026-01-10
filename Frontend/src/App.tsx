import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingsProvider } from "@/contexts/BookingsContext";
import Index from "./pages/Index";
import AuthPage from "./pages/RegistroPag";
import CourtsPage from "./pages/CanchasPage";
import BookingPage from "./pages/ReservaPage";
import HistoryPage from "./pages/HistorialPage";
import AdminPage from "./pages/AdminPag";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/Registro" element={<AuthPage />} />
              <Route path="/Canchas" element={<CourtsPage />} />
              <Route path="/Reserva" element={<BookingPage />} />
              <Route path="/Historial" element={<HistoryPage />} />
              <Route path="/Admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
