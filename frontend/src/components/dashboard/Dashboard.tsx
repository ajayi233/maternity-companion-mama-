import { useMemo, useState } from "react";
import { PregnancyProgress } from "./PregnancyProgress";
import { QuickActions } from "./QuickActions";
import { AIPregnancyGuide } from "@/components/ai/AIPregnancyGuide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Heart, User, LogOut, Settings } from "lucide-react";
import heroImage from "@/assets/hero-maternal.jpg";

interface DashboardProps {
  user: {
    name: string;
    dueDate?: string;
  };
  onNavigate: (tab: string) => void;
  onLogout?: () => void;
}

export const Dashboard = ({ user, onNavigate, onLogout }: DashboardProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const upcomingReminders = useMemo(() => [
    { id: 1, title: "Take prenatal vitamins", time: "9:00 AM", type: "medication" },
    { id: 2, title: "Doctor appointment", time: "Tomorrow 2:00 PM", type: "appointment" },
    { id: 3, title: "Weekly weight check", time: "This Friday", type: "checkup" }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-hero pb-24 page-enter">
      {/* Header with Hero Image */}
      <div className="relative overflow-hidden">
        <div
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-maternal/80"></div>
          <div className="relative z-10 p-6 text-white animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {getGreeting()}, {user.name}! 👋
                </h1>
                <p className="text-lg opacity-90">
                  Welcome to your maternal health companion
                </p>
              </div>
              <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30"
                  >
                    <User className="w-5 h-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border border-white/20">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {onLogout && (
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                      onClick={onLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6">
        {/* AI Pregnancy Guide */}
        <div className="card-enter">
          <AIPregnancyGuide dueDate={user.dueDate} />
        </div>

        {/* Quick Actions */}
        <div className="card-enter" style={{ animationDelay: '0.1s' }}>
          <QuickActions onNavigate={onNavigate} />
        </div>

        {/* Upcoming Reminders */}
        <Card className="shadow-card border-border card-enter" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-primary" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReminders.length > 0 ? (
              <div className="space-y-3">
                {upcomingReminders.slice(0, 3).map((reminder, index) => (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent border border-border animate-fade-in hover-scale"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      reminder.type === 'medication' ? 'bg-primary' :
                      reminder.type === 'appointment' ? 'bg-secondary' : 'bg-accent'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{reminder.title}</p>
                      <p className="text-sm text-muted-foreground">{reminder.time}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => onNavigate('reminders')}
                  className="w-full text-center text-primary font-medium py-2 rounded-lg hover:bg-accent transition-smooth"
                >
                  View all reminders
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No reminders yet. We'll help you stay on track!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Tips Card */}
        <Card className="shadow-card border-border card-enter" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-secondary" />
              Today's Health Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-accent rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-secondary mb-2">Stay Hydrated!</h3>
              <p className="text-foreground text-large leading-relaxed">
                Drinking plenty of water during pregnancy helps prevent dehydration, 
                reduces swelling, and supports your baby's development. Aim for 8-10 
                glasses of water daily.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};