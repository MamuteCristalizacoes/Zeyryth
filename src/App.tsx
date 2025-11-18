import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { MainLayout } from "./components/MainLayout";
import Home from "./pages/Home";
import ColorCollector from "./pages/ColorCollector";
import Textures from "./pages/Textures";
import Palettes from "./pages/Palettes";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";
import UserProfile from "./pages/UserProfile";
import CommunityChat from "./pages/CommunityChat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/color-collector" component={ColorCollector} />
      <Route path="/textures" component={Textures} />
      <Route path="/palettes" component={Palettes} />
      <Route path="/chat" component={CommunityChat} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <MainLayout>
              <Router />
            </MainLayout>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
