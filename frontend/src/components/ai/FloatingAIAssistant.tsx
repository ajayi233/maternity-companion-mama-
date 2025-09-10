import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import { sendTextQuery, playAudioResponse } from "@/lib/aiService";

interface FloatingAIAssistantProps {
  dueDate?: string;
}

export const FloatingAIAssistant = ({ dueDate }: FloatingAIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    try {
      const response = await sendTextQuery(question, dueDate);
      setAiResponse(response.text);
      if (response.audio_base64) {
        playAudioResponse(response.audio_base64);
      }
    } catch (error) {
      console.error('AI query failed:', error);
      setAiResponse('Sorry, I could not process your question. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-44 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-4 border-white/20 pointer-events-auto"
        aria-label="AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-64 right-6 left-6 lg:left-auto lg:right-6 lg:w-96 z-[9998] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 pointer-events-auto">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            <MessageCircle className="w-5 h-5 text-green-700" />
            <h3 className="font-semibold text-gray-900">Ask AI Assistant</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about your pregnancy..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askAI()}
                className="flex-1"
              />
              <Button
                onClick={askAI}
                disabled={isAsking || !question.trim()}
                size="sm"
                className="relative z-[9999] pointer-events-auto"
              >
                {isAsking ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {aiResponse && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200 max-h-40 overflow-y-auto">
                <p className="text-green-900 text-sm leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};