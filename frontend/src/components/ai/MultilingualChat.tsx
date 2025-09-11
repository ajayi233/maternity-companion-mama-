import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, Send, Volume2, Mic, Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  language: string;
  timestamp: Date;
  originalText?: string;
}

export const MultilingualChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Akwaaba! I am your AI midwife. How can I help you today?',
      isUser: false,
      language: 'en',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tw', name: 'Twi', flag: '🇬🇭' },
    { code: 'ee', name: 'Ewe', flag: '🇬🇭' },
    { code: 'ga', name: 'Ga', flag: '🇬🇭' }
  ];

  const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
    // Simulate AWS Translate integration
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'tw': 'Ɛte sɛn? Me pɛ sɛ mebisa wo nsɛm bi.',
        'ee': 'Aleke nɔ? Medi be mabia nya aɖe.',
        'ga': 'Bawo ni? Mi lɔ be ma bisa wo naa.'
      },
      'tw': {
        'en': 'How are you? I want to ask you something.',
        'ee': 'Aleke nɔ? Medi be mabia nya aɖe.',
        'ga': 'Bawo ni? Mi lɔ be ma bisa wo naa.'
      }
    };

    return translations[fromLang]?.[toLang] || text;
  };

  const generateAIResponse = async (userMessage: string, language: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses: Record<string, string[]> = {
      'en': [
        "I understand your concern. During pregnancy, it's important to monitor your symptoms carefully.",
        "That's a great question! Let me help you with information about pregnancy health.",
        "Based on what you've shared, here are some recommendations for your pregnancy journey."
      ],
      'tw': [
        "Mete wo adwene ase. Nyinsɛn berɛ mu no, ɛho hia sɛ wohwɛ wo ho yadeɛ no yiye.",
        "Ɛyɛ asɛm pa! Ma memmoa wo wɔ nyinsɛn ho nsɛm ho.",
        "Deɛ woaka no, mede akwankyerɛ bi bɛma wo wɔ wo nyinsɛn akwan no ho."
      ],
      'ee': [
        "Mese wò susu. Le fufɔɣi me la, ele be nàkpɔ wò lãmesese ɖe ŋu nyuie.",
        "Biabiaɖe nyui aɖe! Na makpe ɖe ŋuwò le fufɔɣi ŋuti nyawo me.",
        "Nu si nègblɔ la, matsɔ aɖaŋuɖoɖo aɖewo ana wò le wò fufɔɣi mɔ la ŋu."
      ],
      'ga': [
        "Mi lɔ wo suban. Lɛ nyɔŋmɔ gbɛ mli, ɛ bɔɔlɔ ni o kpɛ wo lɛ yɛlɛ yɛɛ.",
        "Bibi fɛɛ! Ma kɛ mi bɔ wo lɛ nyɔŋmɔ nsɛm lɛ ho.",
        "Nɛ o gblɔ lɛ, ma tsɔ akwankyerɛ bi na wo lɛ wo nyɔŋmɔ kwan lɛ ho."
      ]
    };

    const langResponses = responses[language] || responses['en'];
    return langResponses[Math.floor(Math.random() * langResponses.length)];
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

    // Generate AI response
    const aiResponseText = await generateAIResponse(inputText, selectedLanguage);
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponseText,
      isUser: false,
      language: selectedLanguage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const speakMessage = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
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
      
      utterance.lang = language === 'tw' ? 'en-GH' : language === 'en' ? 'en-US' : 'en-GH';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputText("Mete sɛ me yam ye me ya");
    }, 3000);
  };

  const getLanguageFlag = (code: string) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐';
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-card shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Multilingual AI Midwife</CardTitle>
                <p className="text-muted-foreground">Chat in your preferred language</p>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {getLanguageFlag(selectedLanguage)} {languages.find(l => l.code === selectedLanguage)?.name}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-card shadow-lg border-0">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 animate-slide-up">
                <Avatar className={`w-10 h-10 ${message.isUser ? 'order-2' : ''}`}>
                  <AvatarFallback className={message.isUser ? 'bg-primary text-white' : 'bg-secondary text-white'}>
                    {message.isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 ${message.isUser ? 'order-1' : ''}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 ${
                    message.isUser
                      ? 'bg-primary text-white ml-auto'
                      : 'bg-white/50 backdrop-blur-sm border border-white/20 text-foreground'
                  }`}>
                    <p className="leading-relaxed">{message.text}</p>
                    <div className={`flex items-center justify-between mt-3 gap-2 ${
                      message.isUser ? 'flex-row-reverse' : ''
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs opacity-70">
                          {getLanguageFlag(message.language)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakMessage(message.text, message.language)}
                        className="h-8 w-8 p-0 hover:bg-white/20"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
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
                    <span className="text-sm text-muted-foreground">AI is translating and responding...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-white/10 p-4 bg-white/20 backdrop-blur-sm">
            <div className="flex gap-3 mb-3">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={selectedLanguage === 'tw' ? 'Kyerɛw wo nsɛm...' : 
                              selectedLanguage === 'ee' ? 'Ŋlɔ wò nyawo...' :
                              selectedLanguage === 'ga' ? 'Ŋwalɛ wo nsɛm...' :
                              'Type your message...'}
                  className="pr-16 h-14 text-base rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startVoiceInput}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                    isListening ? 'text-pink-500 animate-pulse' : 'text-muted-foreground'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="gradient"
                size="lg"
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className="h-14 w-14 p-0 rounded-xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};