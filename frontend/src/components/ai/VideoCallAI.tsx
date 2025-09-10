import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Languages, Settings } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const VideoCallAI = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("tw");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'tw', name: 'Twi', nativeName: 'Twi', flag: '🇬🇭' },
    { code: 'ga', name: 'Ga', nativeName: 'Ga', flag: '🇬🇭' },
    { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe', flag: '🇬🇭' },
    { code: 'fat', name: 'Fante', nativeName: 'Fante', flag: '🇬🇭' },
    { code: 'dag', name: 'Dagomba', nativeName: 'Dagbanli', flag: '🇬🇭' }
  ];

  const aiResponses = {
    en: [
      "Hello! I'm Dr. Ama, your AI midwife. How are you feeling today?",
      "That's completely normal during pregnancy. Let me explain what's happening.",
      "I recommend you drink plenty of water and get some rest.",
      "Would you like me to show you some gentle exercises?",
      "Your baby is developing well. Do you have any concerns?"
    ],
    tw: [
      "Akwaaba! Me yɛ Dr. Ama, wo AI awogyefoɔ. Ɛte sɛn ɛnnɛ?",
      "Ɛyɛ adeɛ a ɛtaa ba nyinsɛn berɛ mu. Ma menkyerɛ wo deɛ ɛrekɔ so.",
      "Mekamfo sɛ wonom nsuo pii na woahome.",
      "Wobɛpɛ sɛ mekyerɛ wo apɔmuden bi a ɛnyɛ den?",
      "Wo ba no rekɔ so yiye. Wowɔ nsɛmmisa bi?"
    ],
    ga: [
      "Akwaaba! Mi yɛ Dr. Ama, wo AI midwife. Ɛte sɛn lɛ?",
      "Ɛyɛ adeɛ fɛɛ lɛ nyɔŋmɔ berɛ mu. Ma mi kyerɛ wo nɛ ɛkɔ so.",
      "Mi kamfo sɛ o nom nsuo pii kɛ o home.",
      "O bɛpɛ sɛ mi kyerɛ wo apɔmuden bi kɛ ɛnyɛ den?",
      "Wo ba lɛ rekɔ so yiye. O wɔ nsɛmmisa bi?"
    ]
  };

  useEffect(() => {
    if (isCallActive) {
      startUserVideo();
      startCallTimer();
      simulateAIGreeting();
    } else {
      stopUserVideo();
      stopCallTimer();
    }

    return () => {
      stopUserVideo();
      stopCallTimer();
    };
  }, [isCallActive]);

  const startUserVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopUserVideo = () => {
    if (userVideoRef.current?.srcObject) {
      const stream = userVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      userVideoRef.current.srcObject = null;
    }
  };

  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
  };

  const simulateAIGreeting = () => {
    setTimeout(() => {
      const responses = aiResponses[selectedLanguage as keyof typeof aiResponses] || aiResponses.en;
      setAiMessage(responses[0]);
      setIsAISpeaking(true);
      
      if (isSpeakerOn) {
        speakMessage(responses[0], selectedLanguage);
      }
      
      setTimeout(() => setIsAISpeaking(false), 3000);
    }, 2000);
  };

  const speakMessage = (text: string, language: string) => {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voiceMap = {
      en: 'en-US',
      tw: 'en-GH',
      ga: 'en-GH', 
      ee: 'en-GH',
      fat: 'en-GH',
      dag: 'en-GH'
    };
    
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
    
    utterance.lang = voiceMap[language as keyof typeof voiceMap] || 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  const startCall = () => {
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setAiMessage("");
    setIsAISpeaking(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (userVideoRef.current?.srcObject) {
      const stream = userVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (userVideoRef.current?.srcObject) {
      const stream = userVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isCallActive) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center bg-gradient-card shadow-2xl border-0">
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="text-4xl mb-2">👩‍⚕️</div>
                <div className="text-xs font-bold text-white">Dr. AMA</div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Video Consultation</h2>
              <p className="text-muted-foreground">Connect with your AI midwife for personalized care</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-primary" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={startCall}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg"
              >
                <Video className="w-6 h-6 mr-2" />
                Start Video Call
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              🔒 Your privacy is protected. This is a secure AI consultation.
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Call Header */}
      <div className="bg-black/50 backdrop-blur-sm p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-lg">👩‍⚕️</span>
          </div>
          <div>
            <div className="font-semibold">Dr. Ama - AI Midwife</div>
            <div className="text-sm text-white/70">{formatTime(callDuration)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
          <div className={`w-3 h-3 rounded-full ${isAISpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* AI Video (Simulated) */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-8xl mb-4 ${isAISpeaking ? 'animate-bounce' : ''}`}>👩‍⚕️</div>
            <div className="text-white text-xl font-semibold mb-2">Dr. Ama</div>
            <div className="text-white/80">AI Midwife</div>
            
            {/* AI Speaking Indicator */}
            {isAISpeaking && (
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-8 bg-green-400 rounded animate-pulse"></div>
                  <div className="w-2 h-6 bg-green-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-10 bg-green-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-4 bg-green-400 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Video (Small) */}
        <div className="absolute top-4 right-4 w-32 h-24 sm:w-40 sm:h-30 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
          {isVideoOn ? (
            <video
              ref={userVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-white/50" />
            </div>
          )}
        </div>

        {/* AI Message Overlay */}
        {aiMessage && (
          <div className="absolute bottom-20 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">👩‍⚕️</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">Dr. Ama</div>
                  <div className="text-white/90">{aiMessage}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="bg-black/80 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full ${!isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-8 h-8" />
          </Button>

          <Button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-14 h-14 rounded-full ${isSpeakerOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
};