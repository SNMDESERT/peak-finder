import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Trips from "@/pages/Trips";
import TripDetail from "@/pages/TripDetail";
import Achievements from "@/pages/Achievements";
import Reviews from "@/pages/Reviews";
import About from "@/pages/About";
import Dashboard from "@/pages/Dashboard";
import InvitePage from "@/pages/InvitePage";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Home} />
      )}
      <Route path="/trips" component={Trips} />
      <Route path="/trips/:id" component={TripDetail} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/about" component={About} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/invite/:code" component={InvitePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
