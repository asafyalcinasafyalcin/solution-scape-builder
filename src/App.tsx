import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import Solutions from "./pages/Solutions";
import ReadyLines from "./pages/ReadyLines";
import TomatoLines from "./pages/TomatoLines";
import SauceLines from "./pages/SauceLines";
import SingleMachines from "./pages/SingleMachines";
import DairyMachines from "./pages/DairyMachines";
import Configurator from "./pages/Configurator";
import FillingMachines from "./pages/FillingMachines";
import CustomProjects from "./pages/CustomProjects";
import Services from "./pages/Services";
import References from "./pages/References";
import Corporate from "./pages/Corporate";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Sunum from "./pages/Sunum";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cozumler" element={<Solutions />} />
              <Route path="/hazir-hatlar" element={<ReadyLines />} />
              <Route path="/hazir-hatlar/salca-domates" element={<TomatoLines />} />
              <Route path="/hazir-hatlar/mayonez-ketcap-sos" element={<SauceLines />} />
              <Route path="/tekil-makineler" element={<SingleMachines />} />
              <Route path="/tekil-makineler/sut-prosesi" element={<DairyMachines />} />
              <Route path="/tekil-makineler/dolum-paketleme" element={<FillingMachines />} />
              <Route path="/konfigurator" element={<Configurator />} />
              <Route path="/ozel-projeler" element={<CustomProjects />} />
              <Route path="/hizmetler" element={<Services />} />
              <Route path="/referanslar" element={<References />} />
              <Route path="/kurumsal" element={<Corporate />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/iletisim" element={<Contact />} />
              <Route path="/sunum" element={<Sunum />} />
              <Route path="/presentation" element={<Sunum />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
