import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Brain, Calendar, Pill, Stethoscope, BookOpen, Volume2 } from "lucide-react";

interface AIReminder {
  id: string;
  title: string;
  description: string;
  aiExplanation: string;
  type: 'medication' | 'appointment' | 'education' | 'exercise';
  priority: 'low' | 'medium' | 'high';
  time: string;
  date: string;
  completed: boolean;
  personalizedContent?: string;
}

export const PersonalizedReminders = () => {
  const [reminders, setReminders] = useState<AIReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generatePersonalizedReminders = async (): Promise<AIReminder[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      {
        id: '1',
        title: 'Take Prenatal Vitamins',
        description: 'Your daily folic acid and iron supplement',
        aiExplanation: 'Based on your pregnancy week (12), folic acid is crucial for preventing neural tube defects. Iron helps prevent anemia as your blood volume increases.',
        type: 'medication',
        priority: 'high',
        time: '9:00 AM',
        date: 'Today',
        completed: false,
        personalizedContent: 'Since you mentioned feeling tired yesterday, the iron in your prenatal vitamin will help boost your energy levels.'
      },
      {
        id: '2',
        title: 'Antenatal Appointment',
        description: 'Monthly checkup with Dr. Mensah',
        aiExplanation: 'This appointment will monitor your blood pressure and check for signs of preeclampsia. Your doctor will also listen to your baby\'s heartbeat.',
        type: 'appointment',
        priority: 'high',
        time: '2:00 PM',
        date: 'Tomorrow',
        completed: false,
        personalizedContent: 'Prepare questions about the mild headaches you\'ve been experiencing - this is important to discuss.'
      },
      {
        id: '3',
        title: 'Nutrition Education: Calcium',
        description: 'Learn about calcium-rich foods',
        aiExplanation: 'Your baby\'s bones are developing rapidly now. Calcium ensures strong bone formation without depleting your own calcium stores.',
        type: 'education',
        priority: 'medium',
        time: '7:00 PM',
        date: 'Today',
        completed: false,
        personalizedContent: 'Since you prefer plant-based options, we\'ll focus on sesame seeds, leafy greens, and fortified plant milks.'
      },
      {
        id: '4',
        title: 'Gentle Walking Exercise',
        description: '20-minute walk in fresh air',
        aiExplanation: 'Regular exercise improves circulation, reduces swelling, and helps prepare your body for labor. Walking is safe throughout pregnancy.',
        type: 'exercise',
        priority: 'medium',
        time: '6:00 PM',
        date: 'Today',
        completed: false,
        personalizedContent: 'The weather is perfect today for your evening walk. This will also help with the back pain you mentioned.'
      }
    ];
  };

  useEffect(() => {
    const loadReminders = async () => {
      const personalizedReminders = await generatePersonalizedReminders();
      setReminders(personalizedReminders);
      setIsLoading(false);
    };

    loadReminders();
  }, []);

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const speakExplanation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-5 h-5" />;
      case 'appointment': return <Stethoscope className="w-5 h-5" />;
      case 'education': return <BookOpen className="w-5 h-5" />;
      case 'exercise': return <Calendar className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-purple-500';
      case 'appointment': return 'bg-blue-500';
      case 'education': return 'bg-green-500';
      case 'exercise': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-card shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-muted-foreground">AI is personalizing your reminders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-primary text-white shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">AI Personalized Reminders</CardTitle>
                <p className="text-white/80">Tailored to your pregnancy journey</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              {reminders.filter(r => !r.completed).length} pending
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <Card 
            key={reminder.id} 
            className={`bg-gradient-card shadow-lg border-0 transition-all duration-200 animate-slide-up ${
              reminder.completed ? 'opacity-75' : 'hover:shadow-xl'
            }`}
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    reminder.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {reminder.completed && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </button>

                <div className={`w-12 h-12 ${getTypeColor(reminder.type)} rounded-xl flex items-center justify-center text-white shadow-md`}>
                  {getTypeIcon(reminder.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className={`font-bold text-lg leading-tight ${
                        reminder.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {reminder.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">{reminder.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-primary">{reminder.time}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{reminder.date}</span>
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 mb-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Why this matters
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakExplanation(reminder.aiExplanation)}
                        className="h-6 w-6 p-0"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-blue-700 text-sm leading-relaxed">{reminder.aiExplanation}</p>
                  </div>

                  {/* Personalized Content */}
                  {reminder.personalizedContent && (
                    <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100/50">
                      <h4 className="font-semibold text-purple-800 mb-2">Personalized for you</h4>
                      <p className="text-purple-700 text-sm leading-relaxed">{reminder.personalizedContent}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-card shadow-lg border-0">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🤖 AI learns from your preferences and health data to provide increasingly personalized reminders
          </p>
        </CardContent>
      </Card>
    </div>
  );
};