import { Home, Calendar, MessageCircle, BookOpen, MapPin, Mic, User, LogOut, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: { name: string };
  onLogout?: () => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'chat', icon: MessageCircle, label: 'Text Chat' },
  { id: 'voice-chat', icon: Mic, label: 'Voice Chat' },
  { id: 'resources', icon: BookOpen, label: 'Resources' },
  { id: 'map', icon: MapPin, label: 'Find Clinics' }
];

export const TopNavigation = ({ activeTab, onTabChange, user, onLogout }: TopNavigationProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="hidden lg:block fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-pink-600">MAMA</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 relative z-[9999]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium relative z-[9999] pointer-events-auto",
                    isActive 
                      ? "text-pink-600 bg-pink-50" 
                      : "text-muted-foreground hover:text-pink-600 hover:bg-pink-50/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Profile Menu */}
          <div className="relative z-[9999]" ref={profileMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-2 hover:bg-accent relative z-[9999] pointer-events-auto"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User className="w-4 h-4" />
              <span className="font-medium">{user.name.split(' ')[0]}</span>
            </Button>
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white shadow-xl rounded-xl border z-[9999] p-1 pointer-events-auto">
                <div className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100 pointer-events-auto">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100 pointer-events-auto">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
                {onLogout && (
                  <div 
                    className="flex items-center gap-2 cursor-pointer text-pink-600 rounded-lg px-3 py-2 hover:bg-gray-100 pointer-events-auto"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};