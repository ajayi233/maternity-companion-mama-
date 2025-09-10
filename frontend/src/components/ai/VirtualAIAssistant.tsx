import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Mic, MicOff, Volume2, Bot, User, Languages, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sendTextQuery } from "@/lib/aiService";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  language: string;
  timestamp: Date;
  audioUrl?: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface VirtualAIAssistantProps {
  user?: {
    name: string;
    dueDate?: string;
  };
}

export const VirtualAIAssistant = ({ user }: VirtualAIAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("tw");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'tw', name: 'Twi', nativeName: 'Twi', flag: '🇬🇭' },
    { code: 'ga', name: 'Ga', nativeName: 'Ga', flag: '🇬🇭' },
    { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe', flag: '🇬🇭' },
    { code: 'fat', name: 'Fante', nativeName: 'Fante', flag: '🇬🇭' },
    { code: 'dag', name: 'Dagomba', nativeName: 'Dagbanli', flag: '🇬🇭' }
  ];

  const greetings = {
    en: "Hello! I'm your AI midwife. How can I help you today?",
    tw: "Akwaaba! Me yɛ wo AI awogyefoɔ. Ɛdeɛn na metumi ayɛ ama wo ɛnnɛ?",
    ga: "Akwaaba! Mi yɛ wo AI midwife. Nɛ mi tumi yɛ ma wo lɛ?",
    ee: "Woezɔ! Menye wò AI midwife. Nu ka mate ŋu awɔ na wò egbe?",
    fat: "Akwaaba! Me yɛ wo AI midwife. Deɛn na metumi ayɛ ama wo ɛnnɛ?",
    dag: "Desba! N yɛli a AI midwife. Bo ka n tumi maal' shɛli fu?"
  };

  useEffect(() => {
    // Initialize with greeting in selected language
    const greeting: ChatMessage = {
      id: '1',
      text: greetings[selectedLanguage as keyof typeof greetings] || greetings.en,
      isUser: false,
      language: selectedLanguage,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const translateAndRespond = async (userMessage: string, language: string): Promise<string> => {
    try {
      const response = await sendTextQuery(userMessage, user?.dueDate);
      return response.text;
    } catch (error) {
      console.error('AI response failed:', error);
      return "I'm sorry, I'm having trouble responding right now. Please try again.";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      language: selectedLanguage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const aiResponse = await translateAndRespond(inputText, selectedLanguage);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        language: selectedLanguage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-speak AI response
      speakMessage(aiResponse, selectedLanguage);
    } catch (error) {
      console.error('AI response failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    setIsListening(true);
    
    // Simulate voice recognition (replace with actual implementation)
    setTimeout(() => {
      setIsListening(false);
      const sampleInputs = {
        tw: "Me yam ye me ya",
        ga: "Mi yam yɛ mi ya", 
        ee: "Nye dɔ le vevem",
        fat: "Me yam ye me ya",
        dag: "N yɛm bɛ n ya",
        en: "I have stomach pain"
      };
      setInputText(sampleInputs[selectedLanguage as keyof typeof sampleInputs] || sampleInputs.en);
    }, 3000);
  };

  const speakMessage = (text: string, language: string) => {
    if (!('speechSynthesis' in window)) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Ensure female voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('karen') ||
       voice.name.toLowerCase().includes('susan') ||
       voice.name.toLowerCase().includes('zira') ||
       voice.name.toLowerCase().includes('hazel') ||
       voice.name.toLowerCase().includes('catherine') ||
       voice.name.toLowerCase().includes('allison') ||
       voice.name.toLowerCase().includes('ava') ||
       voice.name.toLowerCase().includes('serena'))
    ) || voices.find(voice => voice.lang.startsWith('en') && voice.gender === 'female') ||
       voices.find(voice => voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('male'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Set language-specific voice settings
    const voiceMap = {
      en: 'en-US',
      tw: 'en-GH',
      ga: 'en-GH', 
      ee: 'en-GH',
      fat: 'en-GH',
      dag: 'en-GH'
    };
    
    utterance.lang = voiceMap[language as keyof typeof voiceMap] || 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  const makeEmergencyCall = () => {
    window.location.href = 'tel:193';
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-20 animate-fade-in">
      <div className="px-4 space-y-4 sm:space-y-6 mobile-safe">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="h-28 sm:h-32 bg-gradient-primary relative rounded-2xl">
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
            <div className="relative z-10 p-4 sm:p-6 text-white flex items-center gap-3 sm:gap-4 h-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="animate-slide-up flex-1">
                <h1 className="text-xl sm:text-2xl font-bold mb-1">Virtual AI Midwife</h1>
                <p className="text-sm sm:text-base text-white/80">Real-time multilingual support</p>
              </div>
              <Button
                onClick={makeEmergencyCall}
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl"
              >
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <Card className="bg-gradient-card shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-primary" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        <span className="text-muted-foreground">({lang.nativeName})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="bg-gradient-card shadow-lg border-0">
          <CardContent className="p-0">
            <div className="h-[45vh] sm:h-[50vh] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-slide-up`}
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <Avatar className={`w-8 h-8 sm:w-10 sm:h-10 ${message.isUser ? 'order-2' : ''}`}>
                    <AvatarFallback className={message.isUser ? 'bg-primary text-white' : 'bg-secondary text-white'}>
                      {message.isUser ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 ${message.isUser ? 'order-1' : ''}`}>
                    <div className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 ${
                      message.isUser
                        ? 'bg-primary text-white ml-auto'
                        : 'bg-white/50 backdrop-blur-sm border border-white/20 text-foreground'
                    }`}>
                      <p className="leading-relaxed">{message.text}</p>
                      <div className={`flex items-center justify-between mt-3 gap-2 ${
                        message.isUser ? 'flex-row-reverse' : ''
                      }`}>
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!message.isUser && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakMessage(message.text, message.language)}
                            className="h-8 w-8 p-0 hover:bg-white/20"
                            disabled={isSpeaking}
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
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarFallback className="bg-secondary text-white">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">AI is translating...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t border-white/10 p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-b-2xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={selectedLanguage === 'tw' ? 'Kyerɛw wo nsɛm...' : 
                                selectedLanguage === 'ga' ? 'Ŋwalɛ wo nsɛm...' :
                                selectedLanguage === 'ee' ? 'Ŋlɔ wò nyawo...' :
                                selectedLanguage === 'fat' ? 'Kyerɛw wo nsɛm...' :
                                selectedLanguage === 'dag' ? 'Ŋmaa a maŋa...' :
                                'Type your message...'}
                    className="pr-12 sm:pr-16 h-12 sm:h-14 text-base rounded-xl"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startVoiceInput}
                    className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg ${
                      isListening ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="h-12 w-12 sm:h-14 sm:w-14 p-0 rounded-xl"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              
              <div className="text-xs text-white/70 mt-3 text-center">
                🎤 {selectedLanguage === 'tw' ? 'Ka anaa kyerɛw wo nsɛm' :
                     selectedLanguage === 'ga' ? 'Ka anaa ŋwalɛ wo nsɛm' :
                     selectedLanguage === 'ee' ? 'Ƒo nu alo ŋlɔ wò nyawo' :
                     selectedLanguage === 'fat' ? 'Ka anaa kyerɛw wo nsɛm' :
                     selectedLanguage === 'dag' ? 'Yɛli bee ŋmaa a maŋa' :
                     'Speak or type your message'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};