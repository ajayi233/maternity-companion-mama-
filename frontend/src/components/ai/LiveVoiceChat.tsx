import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, Phone, Send, Globe, MessageSquare, ChevronUp, ChevronDown, User, Bot } from "lucide-react";
import { sendAudioQuery, playAudioResponse } from "@/lib/aiService";

export const LiveVoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const [currentTranscript, setCurrentTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [conversationActive, setConversationActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(true);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{id: string, type: 'user' | 'ai', text: string, timestamp: Date}>>([]);
  const [showHistory, setShowHistory] = useState(false);

  const supportedLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Arabic', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Urdu',
    'Swahili', 'Hausa', 'Yoruba', 'Igbo', 'Amharic', 'Somali'
  ];

  const responses = {
    en: {
      greeting: "Hello! I'm your AI midwife. I'm listening - please tell me how you're feeling.",
      nausea: "Morning sickness is very common. Try small frequent meals and ginger tea.",
      pain: "Some discomfort is normal, but let me know if the pain is severe.",
      exercise: "Light exercise like walking is great during pregnancy.",
      default: "I understand. Can you tell me more about what you're experiencing?"
    },
    tw: {
      greeting: "Akwaaba! Me yɛ wo AI awogyefoɔ. Mete wo so - ka deɛ wo te nka no kyerɛ me.",
      nausea: "Anɔpa yadeɛ yɛ adeɛ a ɛtaa ba. Sɔ hwɛ sɛ wobɛdi nneɛma kakraa bi na woasom ginger tea.",
      pain: "Yadeɛ bi yɛ adeɛ a ɛtaa ba, nanso ka kyerɛ me sɛ yadeɛ no mu yɛ den.",
      exercise: "Apɔmuden te sɛ nantew yɛ papa wɔ nyinsɛn berɛ mu.",
      default: "Mete aseɛ. Wobɛtumi aka deɛ worehunu no ho nsɛm pii akyerɛ me?"
    }
  };

  useEffect(() => {
    if (conversationActive) {
      // Wait for voices to load
      const initializeAfterVoicesLoad = () => {
        initializeSpeechRecognition();
        startGreeting();
      };
      
      if (speechSynthesis.getVoices().length > 0) {
        initializeAfterVoicesLoad();
      } else {
        speechSynthesis.addEventListener('voiceschanged', initializeAfterVoicesLoad, { once: true });
      }
    }
    
    return () => {
      speechSynthesis.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    };
  }, [conversationActive]);

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setCurrentTranscript("");
    };

    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentTranscript(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setError(`Speech error: ${event.error}`);
      setTimeout(() => setError(null), 3000);
      if (conversationActive && !isAISpeaking && !isProcessing) {
        setTimeout(() => startListening(), 2000);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  };

  const startListening = async () => {
    if (isListening || isAISpeaking || isProcessing) return;
    
    try {
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.start();
      console.log('Audio recording started');
      
      // Also start speech recognition for transcript display
      setCurrentTranscript("");
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      setError('Microphone access failed');
      setTimeout(() => setError(null), 3000);
    }
  };

  const stopListening = () => {
    if (isListening) {
      try {
        // Stop audio recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          console.log('Audio recording stopped');
        }
        
        // Stop speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
    }
  };

  const submitCurrentTranscript = () => {
    if (!isProcessing) {
      const userTranscript = currentTranscript.trim() || 'Voice message';
      console.log('Submitting transcript:', userTranscript);
      
      stopListening();
      
      // Wait for recording to finish and process audio
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          console.log('Audio blob created:', audioBlob.size, 'bytes');
          processUserAudio(audioBlob, userTranscript);
        };
      }
    }
  };

  const startGreeting = () => {
    setTimeout(() => {
      speakResponse("Hello! I'm your AI pregnancy assistant. I can understand and respond in multiple languages. Please speak naturally.");
    }, 1000);
  };

  const processUserAudio = async (audioBlob: Blob, userTranscript: string) => {
    if (isProcessing || isAISpeaking) return;
    
    setIsProcessing(true);
    setCurrentTranscript("");
    
    try {
      console.log('Sending audio to Lambda:', audioBlob.size, 'bytes');
      console.log('User transcript:', userTranscript);
      
      // Send actual audio to Lambda function
      const response = await sendAudioQuery(audioBlob);
      console.log('Lambda response:', response);
      
      setIsProcessing(false);
      
      // Check response structure and extract text
      const responseText = response.text_response || response.text || 'I received your message but could not generate a response.';
      const finalUserText = response.transcript || userTranscript;
      
      console.log('Final user text:', finalUserText);
      console.log('Response text:', responseText);
      
      // Add to conversation history
      const newHistory = [
        { id: Date.now().toString(), type: 'user' as const, text: finalUserText, timestamp: new Date() },
        { id: (Date.now() + 1).toString(), type: 'ai' as const, text: responseText, timestamp: new Date() }
      ];
      
      console.log('Adding to history:', newHistory);
      setConversationHistory(prev => {
        const updated = [...prev, ...newHistory];
        console.log('Updated history:', updated);
        return updated;
      });
      
      setAiResponse(responseText);
      
      console.log('Audio base64 available:', !!response.audio_base64);
      
      // Play AI audio response
      if (response.audio_base64) {
        console.log('Playing audio response');
        setIsAISpeaking(true);
        playAudioResponse(response.audio_base64);
        
        // Set timeout to reset speaking state (estimate based on response length)
        const estimatedDuration = Math.max(responseText.length * 80, 3000); // minimum 3 seconds
        setTimeout(() => {
          console.log('Audio playback finished');
          setIsAISpeaking(false);
          setTimeout(() => setAiResponse(""), 2000); // Keep text visible for 2 more seconds
        }, estimatedDuration);
      } else {
        console.log('No audio response, using text-to-speech fallback');
        // Fallback to text-to-speech
        speakResponse(responseText);
      }
    } catch (error) {
      console.error('AI processing failed:', error);
      setIsProcessing(false);
      
      // Fallback response
      const fallbackText = "I understand. Can you tell me more about what you're experiencing?";
      
      // Still add to history even on error
      const errorHistory = [
        { id: Date.now().toString(), type: 'user' as const, text: userTranscript, timestamp: new Date() },
        { id: (Date.now() + 1).toString(), type: 'ai' as const, text: fallbackText, timestamp: new Date() }
      ];
      
      setConversationHistory(prev => [...prev, ...errorHistory]);
      setAiResponse(fallbackText);
      speakResponse(fallbackText);
    }
  };
  


  const speakResponse = (text: string) => {
    if (isAISpeaking) {
      speechSynthesis.cancel();
    }
    
    setAiResponse(text);
    setIsAISpeaking(true);
    
    // Cancel any existing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisRef.current = utterance;
    
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
    
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1.3;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsAISpeaking(true);
    };
    
    utterance.onend = () => {
      console.log('Text-to-speech finished');
      setIsAISpeaking(false);
      setTimeout(() => setAiResponse(""), 2000); // Keep text visible for 2 seconds
      speechSynthesisRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsAISpeaking(false);
      setTimeout(() => setAiResponse(""), 1000);
      speechSynthesisRef.current = null;
      setError('Speech synthesis failed');
      setTimeout(() => setError(null), 3000);
    };
    
    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 100);
  };

  const startConversation = () => {
    setConversationActive(true);
  };

  const endConversation = () => {
    setConversationActive(false);
    setIsListening(false);
    setIsAISpeaking(false);
    setIsProcessing(false);
    setCurrentTranscript("");
    setAiResponse("");
    
    // Clean up speech synthesis
    speechSynthesis.cancel();
    speechSynthesisRef.current = null;
    
    // Clean up speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  };

  const makeEmergencyCall = () => {
    endConversation();
    window.location.href = 'tel:193';
  };

  if (!conversationActive) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center bg-gradient-card shadow-2xl border-0">
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center">
              <div className="text-4xl">🤱</div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Live Voice Chat</h2>
              <p className="text-muted-foreground">Have a natural conversation with your AI midwife</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-blue-700" />
                <h3 className="font-semibold text-blue-900">Multi-Language Support</h3>
              </div>
              <p className="text-blue-800 text-sm mb-2">Speak in any language - AI auto-detects and responds accordingly</p>
              <div className="text-xs text-blue-700">
                Supports: {supportedLanguages.slice(0, 6).join(', ')}, and many more...
              </div>
            </div>

            <Button
              onClick={startConversation}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg"
            >
              <Mic className="w-6 h-6 mr-2" />
              Start Conversation
            </Button>

            <div className="text-xs text-muted-foreground">
              🎤 Speak naturally - the AI will listen and respond
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 pb-28">
      <div className="w-full max-w-md space-y-8">
        {/* AI Avatar */}
        <div className="text-center">
          <div className={`w-32 h-32 mx-auto bg-primary rounded-full flex items-center justify-center mb-4 ${
            isAISpeaking ? 'animate-pulse scale-110' : ''
          } transition-all duration-300`}>
            <div className="text-6xl">🤱</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-white text-xl font-semibold">Dr. Ama - AI Midwife</div>
            <div className="text-white/90 text-sm flex items-center justify-center gap-1 mt-1">
              <Globe className="w-4 h-4" />
              Multi-language AI Assistant
            </div>
          </div>
        </div>

        {/* Status Display */}
        <Card className="bg-black/30 backdrop-blur-sm border-white/20 p-6 text-center min-h-[120px] flex items-center justify-center">
          {isAISpeaking ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Volume2 className="w-8 h-8 text-green-400 animate-pulse" />
              </div>
              <div className="text-white font-bold">Dr. Ama is speaking...</div>
              {aiResponse && (
                <div className="text-white text-sm italic max-w-xs font-medium">"{aiResponse}"</div>
              )}
            </div>
          ) : isProcessing ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <div className="text-white font-bold">Processing...</div>
            </div>
          ) : isListening ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-8 bg-blue-400 rounded animate-pulse"></div>
                  <div className="w-2 h-6 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-10 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-4 bg-blue-400 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                </div>
              </div>
              <div className="text-white font-bold">Listening...</div>
              {currentTranscript && (
                <div className="text-white text-sm max-w-xs font-medium">"{currentTranscript}"</div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Mic className="w-8 h-8 text-white mx-auto" />
              <div className="text-white font-bold">Ready to listen</div>
            </div>
          )}
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isListening && !isProcessing && !isAISpeaking ? (
            <Button
              onClick={startListening}
              className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full"
            >
              <Mic className="w-8 h-8" />
            </Button>
          ) : isListening ? (
            <>
              <Button
                onClick={stopListening}
                className="bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full"
              >
                <MicOff className="w-8 h-8" />
              </Button>
              <Button
                onClick={submitCurrentTranscript}
                disabled={!currentTranscript.trim()}
                className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full disabled:opacity-50"
              >
                <Send className="w-8 h-8" />
              </Button>
            </>
          ) : null}
          
          <Button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-purple-500 hover:bg-purple-600 text-white w-16 h-16 rounded-full"
          >
            <MessageSquare className="w-8 h-8" />
          </Button>
          
          <Button
            onClick={endConversation}
            className="bg-gray-500 hover:bg-gray-600 text-white w-16 h-16 rounded-full"
          >
            <MicOff className="w-8 h-8" />
          </Button>
          
          <Button
            onClick={makeEmergencyCall}
            className="bg-orange-500 hover:bg-orange-600 text-white w-16 h-16 rounded-full"
          >
            <Phone className="w-8 h-8" />
          </Button>
        </div>

        <div className="text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-white text-sm font-medium">
              {isListening ? "Press the red button to stop, green to send" : "Press the blue microphone to start speaking"}
            </div>
            <div className="text-white/90 text-xs mt-1">Purple button shows conversation history</div>
            {error && (
              <div className="text-orange-300 mt-2 text-xs font-medium">{error}</div>
            )}
          </div>
        </div>
        
        {/* Conversation History Modal */}
        {showHistory && (
          <Card className="bg-black/30 backdrop-blur-sm border-white/20 max-h-80 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Conversation History
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="text-white hover:bg-white/10 h-6 w-6 p-0"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 max-h-60 overflow-y-auto">
              {conversationHistory.length === 0 ? (
                <div className="text-white/70 text-sm text-center py-4">
                  No conversation yet. Start speaking to see your chat history!
                </div>
              ) : (
                <div className="space-y-3">
                  {conversationHistory.map((message) => (
                    <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'ai' && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-lg p-2 text-xs ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/90 text-gray-800'
                      }`}>
                        <p className="leading-relaxed">{message.text}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};