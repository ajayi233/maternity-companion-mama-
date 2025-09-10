import { Home, Calendar, MessageCircle, BookOpen, MapPin, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home', labelGhana: 'Home' },
  { id: 'chat', icon: MessageCircle, label: 'Text Chat', labelGhana: 'Nkrasɛm' },
  { id: 'voice-chat', icon: Mic, label: 'Voice', labelGhana: 'Nne' },
  { id: 'resources', icon: BookOpen, label: 'Resources', labelGhana: 'Nhomasua' },
  { id: 'map', icon: MapPin, label: 'Map', labelGhana: 'Beae' }
];

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg mobile-safe">
      <div className="flex items-center justify-around py-3 px-2 sm:px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 min-w-0 touch-target text-center",
                isActive 
                  ? "text-primary bg-accent" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-smooth",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium leading-none truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};