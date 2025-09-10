import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Volume2, Bot, User, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI health assistant 🤖 How can I help you today? Ask me about pregnancy symptoms, nutrition, exercises, or any concerns you might have.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text.toLowerCase()),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    if (userInput.includes('nausea') || userInput.includes('morning sickness')) {
      return "Morning sickness is common in the first trimester 🤢 Try small frequent meals, avoid strong smells, and consider ginger tea. If severe, consult your healthcare provider.";
    }
    if (userInput.includes('exercise') || userInput.includes('workout')) {
      return "Gentle exercise is wonderful during pregnancy! 🏃‍♀️ Try walking, swimming, or prenatal yoga. Always get your doctor's approval first.";
    }
    if (userInput.includes('nutrition') || userInput.includes('food')) {
      return "A balanced diet is crucial! 🥗 Focus on fruits, vegetables, whole grains, lean proteins, and dairy. Don't forget your prenatal vitamins.";
    }
    if (userInput.includes('pain') || userInput.includes('cramp')) {
      return "Some discomfort is normal, but severe pain needs attention 🩺 Don't hesitate to contact your healthcare provider if you're concerned.";
    }
    return "Thanks for your question! 💜 While I provide general info, always consult your healthcare provider for personalized pregnancy advice.";
  };

  const toggleListening = () => {
    if (!isListening) {
      // Start voice recognition (placeholder - implement with Web Speech API)
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputText("This is a placeholder for voice input");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Speech synthesis failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-20 animate-fade-in">
      <div className="px-4 space-y-4 sm:space-y-6 mobile-safe">
        {/* Modern Header */}
        <div className="relative overflow-hidden">
          <div className="h-28 sm:h-32 bg-gradient-primary relative rounded-2xl">
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
            <div className="relative z-10 p-4 sm:p-6 text-white flex items-center gap-3 sm:gap-4 h-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="animate-slide-up">
                <h1 className="text-xl sm:text-2xl font-bold mb-1">AI Health Assistant</h1>
                <p className="text-sm sm:text-base text-white/80">Ask me anything about your pregnancy</p>
              </div>
              <div className="ml-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Sparkles className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-gradient-card rounded-2xl shadow-lg border-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="h-[45vh] sm:h-[50vh] overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-slide-up`}
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <Avatar className={`w-8 h-8 sm:w-10 sm:h-10 ${message.isUser ? 'order-2' : ''}`}>
                  <AvatarFallback className={message.isUser ? 'bg-primary text-white' : 'bg-secondary text-white'}>
                    {message.isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 ${message.isUser ? 'order-1' : ''}`}>
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 ${
                      message.isUser
                        ? 'bg-primary text-white ml-auto'
                        : 'bg-white/50 backdrop-blur-sm border border-white/20 text-foreground'
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                    <div className={`flex items-center justify-between mt-3 gap-2 ${
                      message.isUser ? 'flex-row-reverse' : ''
                    }`}>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {!message.isUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakMessage(message.text)}
                          className="h-8 w-8 p-0 hover:bg-white/20"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 animate-slide-up">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-secondary text-white">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Modern Input */}
          <div className="border-t border-white/10 p-3 sm:p-6 bg-white/20 backdrop-blur-sm rounded-b-2xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about your pregnancy... 🤰"
                  className="pr-12 sm:pr-16 h-12 sm:h-14 text-base rounded-xl border-2 border-white/20 bg-white/50 backdrop-blur-sm focus:border-primary focus:bg-white/70 transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg ${
                    isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-muted-foreground hover:bg-white/50'
                  }`}
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                variant="gradient"
                size="lg"
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="h-12 w-12 sm:h-14 sm:w-14 p-0 rounded-xl"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            
            <div className="text-xs text-white/70 mt-3 text-center">
              🎤 Tap microphone to speak or type your question
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};