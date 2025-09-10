import { Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export const EmergencyButton = () => {
  const emergencyContacts = [
    { name: 'Ghana Ambulance', number: '193', icon: '🚑', priority: true },
    { name: 'Korle-Bu Hospital', number: '0302-665-401', icon: '🏥', priority: true },
    { name: 'Fire Service', number: '192', icon: '🚒', priority: false },
    { name: 'Police Emergency', number: '191', icon: '👮', priority: false }
  ];

  const quickTips = [
    { text: "Stay calm & breathe", icon: "🫁" },
    { text: "Call for help immediately", icon: "📞" },
    { text: "Get to safety", icon: "🛡️" }
  ];

  const makeCall = (number: string) => {
    try {
      window.location.href = `tel:${number}`;
    } catch (error) {
      console.error('Failed to initiate call:', error);
      import('sonner').then(({ toast }) => {
        toast.info('Unable to make call', {
          description: `Please dial ${number} manually`,
          duration: 4000,
        });
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-4 border-white/20"
          aria-label="Emergency help"
        >
          <div className="relative">
            <Phone className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-gradient-card border-0 shadow-2xl" 
        side="left" 
        sideOffset={20}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 pb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Emergency Help</h3>
              <p className="text-sm text-muted-foreground">Quick access to help</p>
            </div>
          </div>

          {/* Priority Contacts */}
          <div className="space-y-2">
            {emergencyContacts.filter(c => c.priority).map((contact, index) => (
              <button
                key={index}
                onClick={() => makeCall(contact.number)}
                className="w-full flex items-center gap-3 p-3 bg-white/50 hover:bg-white/70 rounded-xl transition-all duration-200 hover:scale-[1.02] border border-white/20"
              >
                <span className="text-2xl">{contact.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground">{contact.name}</div>
                  <div className="text-lg font-mono text-orange-600">{contact.number}</div>
                </div>
                <Phone className="w-4 h-4 text-orange-500" />
              </button>
            ))}
          </div>

          <Separator className="my-3" />

          {/* Quick Tips */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-foreground mb-2">Quick Tips:</h4>
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span>{tip.icon}</span>
                <span className="text-muted-foreground">{tip.text}</span>
              </div>
            ))}
          </div>

          {/* More Contacts */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              More emergency contacts ▼
            </summary>
            <div className="mt-2 space-y-1">
              {emergencyContacts.filter(c => !c.priority).map((contact, index) => (
                <button
                  key={index}
                  onClick={() => makeCall(contact.number)}
                  className="w-full flex items-center gap-2 p-2 hover:bg-white/30 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg">{contact.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">{contact.number}</div>
                  </div>
                </button>
              ))}
            </div>
          </details>
        </div>
      </PopoverContent>
    </Popover>
  );
};