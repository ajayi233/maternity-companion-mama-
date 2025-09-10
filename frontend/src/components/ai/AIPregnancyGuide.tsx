import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Brain, Baby, Heart, Sparkles, Volume2, Calendar, MessageCircle, Mic, Send } from "lucide-react";
import { sendTextQuery, playAudioResponse } from "@/lib/aiService";

interface AIInsight {
  week: number;
  title: string;
  description: string;
  babyDevelopment: string;
  motherChanges: string;
  recommendations: string[];
  nutritionFocus: string[];
  warningSigns: string[];
}

interface AIPregnancyGuideProps {
  dueDate?: string;
}

export const AIPregnancyGuide = ({ dueDate }: AIPregnancyGuideProps) => {
  const [currentWeek, setCurrentWeek] = useState(12);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateAIInsight = async (week: number): Promise<AIInsight> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const insights: Record<number, AIInsight> = {
      12: {
        week: 12,
        title: "Welcome to Your Second Trimester! 🌟",
        description: "You're entering an exciting phase! Your baby is developing rapidly, and you may start feeling more energetic as morning sickness subsides.",
        babyDevelopment: "Your baby is now about 2.1 inches long and weighs about half an ounce. Bones are beginning to harden, and your baby can make a fist!",
        motherChanges: "You may notice less nausea and more energy. Your uterus is growing and may start showing as a small bump.",
        recommendations: [
          "Continue taking prenatal vitamins with folic acid",
          "Stay hydrated with 8-10 glasses of water daily",
          "Start gentle prenatal exercises like walking or swimming",
          "Schedule your second prenatal appointment"
        ],
        nutritionFocus: ["Lean proteins", "Leafy greens", "Whole grains", "Calcium-rich foods"],
        warningSigns: ["Severe abdominal pain", "Heavy bleeding", "Persistent vomiting", "High fever"]
      }
    };

    return insights[week] || insights[12];
  };

  useEffect(() => {
    const loadAIInsight = async () => {
      setIsLoading(true);
      const insight = await generateAIInsight(currentWeek);
      setAiInsight(insight);
      setIsLoading(false);
    };

    loadAIInsight();
  }, [currentWeek]);

  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    try {
      const response = await sendTextQuery(question);
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

  const speakInsight = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
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
            <span className="text-muted-foreground">AI is analyzing your pregnancy journey...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!aiInsight) return null;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-primary shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">AI Pregnancy Guide</CardTitle>
                <p className="text-gray-700">Week {aiInsight.week} Insights</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-gray-800 border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-card shadow-lg border-0">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-bold text-foreground">
              {aiInsight.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speakInsight(aiInsight.description)}
              className="h-8 w-8 p-0"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground leading-relaxed">{aiInsight.description}</p>

          <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
            <div className="flex items-center gap-2 mb-3">
              <Baby className="w-5 h-5 text-pink-700" />
              <h3 className="font-semibold text-pink-900">Your Baby This Week</h3>
            </div>
            <p className="text-pink-800 leading-relaxed">{aiInsight.babyDevelopment}</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-purple-700" />
              <h3 className="font-semibold text-purple-900">Changes in Your Body</h3>
            </div>
            <p className="text-purple-800 leading-relaxed">{aiInsight.motherChanges}</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">AI Recommendations</h3>
            <div className="space-y-2">
              {aiInsight.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-blue-800">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-green-700" />
              <h3 className="font-semibold text-green-900">Ask AI Assistant</h3>
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
                >
                  {isAsking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {aiResponse && (
                <div className="bg-white rounded-lg p-3 border border-green-300">
                  <p className="text-green-900 text-sm leading-relaxed">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};