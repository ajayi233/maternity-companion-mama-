import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Brain, Baby, Heart, Sparkles, Volume2 } from "lucide-react";
import { sendTextQuery, playAudioResponse } from "@/lib/aiService";
import { getHomepageInsights } from "@/lib/homepageService";
import healthImage from "@/assets/health.png";

interface AIInsight {
  week: number;
  title: string;
  description: string;
  babyDevelopment: string;
  motherChanges: string;
  recommendations: string[];
  healthTip: string;
}

interface AIPregnancyGuideProps {
  dueDate?: string;
}

export const AIPregnancyGuide = ({ dueDate }: AIPregnancyGuideProps) => {
  const [currentWeek, setCurrentWeek] = useState(12);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateAIInsight = async (dueDate?: string): Promise<AIInsight> => {
    if (!dueDate) {
      // Fallback data if no due date
      return {
        week: 12,
        title: "Welcome to Your Pregnancy Journey! 🌟",
        description: "Please update your due date to get personalized insights for your pregnancy week.",
        babyDevelopment: "Your baby is developing beautifully. Update your due date for specific weekly information.",
        motherChanges: "Every pregnancy is unique. Get personalized insights by setting your due date.",
        recommendations: ["Update your due date in profile settings", "Take prenatal vitamins", "Stay hydrated", "Contact your healthcare provider"],
        healthTip: "Regular prenatal care is essential for a healthy pregnancy."
      };
    }

    try {
      const data = await getHomepageInsights(dueDate);
      
      // Convert AI recommendations string to array
      const recommendationsArray = data.insights.ai_recommendations
        .split(/[.!]\s+/)
        .filter(rec => rec.trim().length > 0)
        .map(rec => rec.trim())
        .slice(0, 4); // Limit to 4 recommendations

      return {
        week: data.gestational_week,
        title: `Week ${data.gestational_week} - Your Pregnancy Journey! 🌟`,
        description: data.insights.ai_pregnancy_guide,
        babyDevelopment: data.insights.baby_this_week,
        motherChanges: data.insights.changes_in_body,
        recommendations: recommendationsArray,
        healthTip: data.insights.health_tip
      };
    } catch (error) {
      console.error('Failed to fetch dynamic insights:', error);
      // Fallback to static data on error
      return {
        week: 12,
        title: "Your Pregnancy Journey! 🌟",
        description: "We're having trouble loading your personalized insights. Please try again later.",
        babyDevelopment: "Your baby is developing beautifully. Check back soon for updated information.",
        motherChanges: "Your body is adapting to support your growing baby.",
        recommendations: ["Try refreshing the page", "Check your internet connection", "Contact support if issue persists"],
        healthTip: "Continue with your regular prenatal care routine."
      };
    }
  };

  useEffect(() => {
    const loadAIInsight = async () => {
      setIsLoading(true);
      const insight = await generateAIInsight(dueDate);
      setAiInsight(insight);
      setCurrentWeek(insight.week);
      setIsLoading(false);
    };

    loadAIInsight();
  }, [dueDate]);

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
      <Card className="bg-gradient-primary border-0">
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
            {/*  */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Today's Health Tip - Left */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-gray-900">Today's Health Tip</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <img src={healthImage} alt="Health tip" className="w-[250px] h-[250px] object-cover rounded-lg flex-shrink-0" />
                <div className="bg-pink-50 border-l-4 border-pink-500 p-3 rounded-r-lg flex-1">
                  <p className="text-gray-800 leading-relaxed">{aiInsight.healthTip}</p>
                </div>
              </div>
            </div>

            {/* Accordion - Right */}
            <div className="bg-white rounded-xl border border-gray-200">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="baby">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2">
                      <Baby className="w-5 h-5 text-pink-700" />
                      <span className="font-semibold text-gray-900">Your Baby This Week</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <p className="text-gray-800 leading-relaxed">{aiInsight.babyDevelopment}</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="body">
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-purple-700" />
                      <span className="font-semibold text-gray-900">Changes in Your Body</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <p className="text-gray-800 leading-relaxed">{aiInsight.motherChanges}</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="recommendations">
                  <AccordionTrigger className="px-4">
                    <span className="font-semibold text-gray-900">AI Recommendations</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-2">
                      {aiInsight.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-800">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>



        </CardContent>
      </Card>
    </div>
  );
};