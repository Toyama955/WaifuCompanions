import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CharacterSelection from "@/pages/character-selection";
import ChatInterface from "@/pages/chat-interface";
import GroupChat from "@/pages/group-chat";
import NovelMode from "@/pages/novel-mode";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CharacterSelection} />
      <Route path="/chat/:characterId" component={ChatInterface} />
      <Route path="/group-chat" component={GroupChat} />
      <Route path="/novel-mode" component={NovelMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen gradient-bg">
          <Toaster />
          <Router />
          
          {/* Background Particles Effect */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-sparkle"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-secondary/30 rounded-full animate-sparkle" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-accent/25 rounded-full animate-sparkle" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary/15 rounded-full animate-sparkle" style={{animationDelay: '3s'}}></div>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
