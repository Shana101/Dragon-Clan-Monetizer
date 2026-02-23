import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard/Dashboard";
import Earnings from "@/pages/dashboard/Earnings";
import HeidiTools from "@/pages/dashboard/HeidiTools";
import DragonPoints from "@/pages/dashboard/DragonPoints";
import Community from "@/pages/dashboard/Community";
import Analytics from "@/pages/dashboard/Analytics";
import Settings from "@/pages/dashboard/Settings";

import PodcastStudio from "@/pages/tools/PodcastStudio";

function Router() {
  return (
    <Switch>
      {/* Dashboard is the main entry point */}
      <Route path="/" component={Dashboard} />
      
      {/* Tools Routes */}
      <Route path="/tools/podcast-studio" component={PodcastStudio} />
      
      {/* Main Sections */}
      <Route path="/earnings" component={Earnings} />
      <Route path="/tools" component={HeidiTools} />
      <Route path="/points" component={DragonPoints} />
      <Route path="/community" component={Community} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;