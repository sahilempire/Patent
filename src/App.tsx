import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import DocumentsPage from "./pages/DocumentsPage";
import UploadsPage from "./pages/UploadsPage";
import CompliancePage from "./pages/CompliancePage";
import FilingPage from "./pages/FilingPage";
import TrademarkFilingPage from "./pages/TrademarkFilingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wizard" element={<Index />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/uploads" element={<UploadsPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/filing" element={<FilingPage />} />
            <Route path="/trademark-filing" element={<TrademarkFilingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
