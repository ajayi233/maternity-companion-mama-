import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Send, Phone, AlertTriangle, Heart } from "lucide-react";

interface User {
  name: string;
  phone: string;
  dueDate?: string;
  pregnancyData?: {
    dueDate?: string;
    isPregnant?: boolean;
  };
}

export const EmergencyContact = () => {
  const user: User | null = JSON.parse(localStorage.getItem('mama_user') || 'null');
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [location, setLocation] = useState<string>("Ghana");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      import('sonner').then(({ toast }) => {
        toast.error('Recording failed', {
          description: 'Please check microphone permissions',
          duration: 3000,
        });
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        () => {
          setLocation("Ghana");
        }
      );
    }
  }, []);

  const sendEmergencyMessage = async () => {
    if (!message.trim() && !audioBlob) {
      import('sonner').then(({ toast }) => {
        toast.error('Please enter a message or record audio');
      });
      return;
    }

    setIsLoading(true);
    try {
      const dueDate = user?.pregnancyData?.dueDate || user?.dueDate ? new Date(user.pregnancyData?.dueDate || user.dueDate!) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const dueMonth = (dueDate.getMonth() + 1).toString();
      const dueYear = dueDate.getFullYear().toString();
      const patientName = user?.name || 'Emergency Patient';
      
      let requestBody;
      
      if (audioBlob) {
        const audioBase64 = await blobToBase64(audioBlob);
        requestBody = {
          input_type: 'audio',
          audio_format: 'wav',
          audio_data: audioBase64,
          due_month: dueMonth,
          due_year: dueYear,
          location: location,
          patient_name: patientName
        };
      } else {
        requestBody = {
          input_type: 'text',
          text: message,
          due_month: dueMonth,
          due_year: dueYear,
          patient_name: patientName,
          location: location
        };
      }

      const response = await fetch('https://igjlm3mowlnv3nnczmcfrefndy0bfdxl.lambda-url.us-west-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      const responseBody = data.body ? JSON.parse(data.body) : data;
      
      setAiResponse(responseBody.text_response);
      if (responseBody.audio_base64) {
        const audio = new Audio(`data:audio/mp3;base64,${responseBody.audio_base64}`);
        audio.play();
      }

      // Send emergency notification via backend
      try {
        await fetch('http://localhost:5000/api/emergency/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            audioBase64: responseBody.audio_base64,
            textResponse: responseBody.text_response,
            user: user,
            location: location
          })
        });
      } catch (notifyError) {
        console.error('Failed to send emergency notification:', notifyError);
      }
      
      import('sonner').then(({ toast }) => {
        toast.success('Emergency message sent!', {
          description: 'AI assistant has analyzed your situation',
          duration: 5000,
        });
      });
      
      setMessage("");
      setAudioBlob(null);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error sending message:', error);
      import('sonner').then(({ toast }) => {
        toast.error('Failed to send message', {
          description: 'Please try again or call emergency numbers directly',
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Contact</h1>
          <p className="text-gray-600">Send an urgent message to emergency services</p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">Logged in as: {user.name}</p>
          )}
        </div>

        {/* Emergency Numbers */}
        <Card className="mb-6 border-pink-200 bg-pink-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-pink-800 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Emergency Numbers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => window.location.href = 'tel:193'}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                🚑 Ambulance: 193
              </Button>
              <Button 
                onClick={() => window.location.href = 'tel:191'}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                🚓 Police: 191
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Describe Your Emergency</h3>
            <Textarea
              placeholder="Type your emergency message here... (e.g., 'Pregnant woman in labor needs immediate assistance at [location]')"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-32 mb-4 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            />
            
            {/* Voice Recording */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Or Send Voice Message</h4>
              <div className="flex items-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    className="bg-pink-600 hover:bg-pink-700 text-white animate-pulse"
                  >
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording ({formatTime(recordingTime)})
                  </Button>
                )}
                
                {audioBlob && (
                  <div className="flex items-center gap-2 text-green-600">
                    ✅ Voice message recorded ({formatTime(recordingTime)})
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Response */}
        {aiResponse && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-3">AI Assistant Response:</h3>
              <p className="text-blue-700 whitespace-pre-wrap">{aiResponse}</p>
            </CardContent>
          </Card>
        )}

        {/* Send Button */}
        <Button
          onClick={sendEmergencyMessage}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 text-lg font-semibold"
          disabled={(!message.trim() && !audioBlob) || isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Analyzing Emergency...' : 'Send Emergency Message'}
        </Button>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-pink-600">MAMA</span>
          </div>
          <p className="text-xs text-gray-500">
            Your safety is our priority. Emergency services will be contacted immediately.
          </p>
        </div>
      </div>
    </div>
  );
};