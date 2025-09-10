import { useState, useEffect } from "react";
import { Calendar, Baby, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import pregnancyTrackerIcon from "@/assets/pregnancy-tracker.png";

interface PregnancyProgressProps {
  dueDate?: string;
  startDate?: string;
}

export const PregnancyProgress = ({ dueDate, startDate }: PregnancyProgressProps) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (dueDate || startDate) {
      const now = new Date();
      let pregnancyStart: Date;
      
      if (startDate) {
        pregnancyStart = new Date(startDate);
      } else if (dueDate) {
        pregnancyStart = new Date(dueDate);
        pregnancyStart.setDate(pregnancyStart.getDate() - 280); // 40 weeks back
      } else {
        return;
      }

      const daysSinceStart = Math.floor((now.getTime() - pregnancyStart.getTime()) / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(daysSinceStart / 7);
      const remainingDays = dueDate ? Math.ceil((new Date(dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 280 - daysSinceStart;
      const progress = Math.min(100, (daysSinceStart / 280) * 100);

      setCurrentWeek(Math.max(0, Math.min(40, weeks)));
      setDaysRemaining(Math.max(0, remainingDays));
      setProgressPercentage(Math.max(0, progress));
    }
  }, [dueDate, startDate]);

  const getWeekMessage = (week: number) => {
    if (week < 12) return "First trimester - Your baby is developing rapidly!";
    if (week < 27) return "Second trimester - You might start feeling baby's movements!";
    if (week < 37) return "Third trimester - Baby is growing bigger and stronger!";
    return "Full term - Baby could arrive any day now!";
  };

  const getBabySize = (week: number) => {
    if (week < 8) return "Blueberry";
    if (week < 12) return "Lime";
    if (week < 16) return "Avocado";
    if (week < 20) return "Banana";
    if (week < 24) return "Corn";
    if (week < 28) return "Eggplant";
    if (week < 32) return "Coconut";
    if (week < 36) return "Pineapple";
    if (week < 40) return "Watermelon";
    return "Full grown baby";
  };

  return (
    <Card className="bg-gradient-hero border-primary-soft shadow-card-maternal">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl font-semibold text-foreground">
          <img src={pregnancyTrackerIcon} alt="Pregnancy tracker" className="w-8 h-8" />
          Your Pregnancy Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Week Display */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-primary">{currentWeek} weeks</div>
          <p className="text-muted-foreground text-large">{getWeekMessage(currentWeek)}</p>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="hsl(var(--primary-soft))"
                strokeWidth="8"
                fill="none"
                className="opacity-20"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Baby className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-card-accent rounded-lg p-4 border border-primary-soft">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{daysRemaining}</div>
            <div className="text-sm text-muted-foreground">Days remaining</div>
          </div>
          <div className="bg-card-accent rounded-lg p-4 border border-primary-soft">
            <Heart className="w-6 h-6 text-secondary mx-auto mb-2" />
            <div className="text-lg font-semibold text-secondary">{getBabySize(currentWeek)}</div>
            <div className="text-sm text-muted-foreground">Baby's size</div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-primary-soft/10 rounded-lg p-4 text-center border border-primary-soft">
          <p className="text-foreground font-medium">
            You're doing amazing! Keep taking care of yourself and your baby. 💕
          </p>
        </div>
      </CardContent>
    </Card>
  );
};