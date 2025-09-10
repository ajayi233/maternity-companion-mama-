import { MessageCircle, Calendar, Phone, MapPin, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import aiChatIcon from "@/assets/ai-chat-icon.png";

interface QuickActionsProps {
  onNavigate: (tab: string) => void;
}

export const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  const actions = [
    {
      id: 'chat',
      title: 'Text Chat',
      titleGhana: 'Nkrasɛm Kasa',
      description: 'Chat with AI assistant',
      descriptionGhana: 'Kasa ne AI boafo',
      icon: MessageCircle,
      variant: 'chat' as const,
      action: () => onNavigate('chat')
    },
    {
      id: 'voice-chat',
      title: 'Voice Chat',
      titleGhana: 'Nne Kasa',
      description: 'Talk with AI assistant',
      descriptionGhana: 'Kasa ne AI boafo',
      icon: Mic,
      variant: 'chat' as const,
      action: () => onNavigate('voice-chat')
    },
    {
      id: 'reminders',
      title: 'View Reminders',
      titleGhana: 'Hwɛ Nkaebɔ',
      description: 'Check your appointments and medication',
      descriptionGhana: 'Hwɛ wo nhyiamu ne aduro',
      icon: Calendar,
      variant: 'maternal' as const,
      action: () => onNavigate('reminders')
    },
    {
      id: 'emergency',
      title: 'Emergency Help',
      titleGhana: 'Ntɛm Mmoa',
      description: 'Get immediate medical assistance',
      descriptionGhana: 'Nya aduruyɛ mmoa ntɛm ara',
      icon: Phone,
      variant: 'emergency' as const,
      action: () => {
        try {
          window.location.href = 'tel:193';
        } catch (error) {
          alert('Please call 193 for emergency services');
        }
      }
    },
    {
      id: 'clinics',
      title: 'Find Clinics',
      titleGhana: 'Hwehwɛ Ayaresabea',
      description: 'Locate nearby healthcare facilities',
      descriptionGhana: 'Hu akwahosan bea a ɛbɛn wo',
      icon: MapPin,
      variant: 'health' as const,
      action: () => onNavigate('map')
    }
  ];

  return (
    <Card className="shadow-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant={action.id === 'emergency' ? 'emergency' : 'default'}
              size="lg"
              className="h-20 flex-col gap-2 text-center"
              onClick={action.action}
            >
              <Icon className="w-6 h-6" />
              <div>
                <div className="text-sm font-medium leading-tight">{action.title}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};