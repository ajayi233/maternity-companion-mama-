import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle, Mic, Send, Brain } from "lucide-react";

interface SymptomAnalysis {
  riskLevel: 'low' | 'medium' | 'high' | 'emergency';
  title: string;
  description: string;
  recommendations: string[];
  whenToSeekHelp: string;
  emergencyContacts?: string[];
}

export const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const analyzeSymptoms = async (symptomText: string): Promise<SymptomAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const lowerSymptoms = symptomText.toLowerCase();
    
    if (lowerSymptoms.includes('bleeding') && lowerSymptoms.includes('heavy')) {
      return {
        riskLevel: 'emergency',
        title: 'Heavy Bleeding - Please Seek Immediate Care',
        description: 'Heavy bleeding during pregnancy needs prompt medical attention to ensure you and your baby are safe.',
        recommendations: [
          'Contact emergency services (193) right away',
          'Visit the nearest hospital for evaluation',
          'Have someone accompany you for support',
          'Monitor bleeding with a pad if possible'
        ],
        whenToSeekHelp: 'Please seek medical care immediately for your safety',
        emergencyContacts: ['193', '0302-665-401']
      };
    }
    
    if (lowerSymptoms.includes('headache') && lowerSymptoms.includes('severe')) {
      return {
        riskLevel: 'high',
        title: 'Severe Headache - High Priority',
        description: 'Severe headaches during pregnancy can indicate preeclampsia or other serious conditions.',
        recommendations: [
          'Contact your healthcare provider immediately',
          'Monitor for additional symptoms like vision changes',
          'Rest in a dark, quiet room',
          'Check your blood pressure if possible'
        ],
        whenToSeekHelp: 'Contact your doctor within 2-4 hours, or immediately if symptoms worsen'
      };
    }
    
    if (lowerSymptoms.includes('nausea') || lowerSymptoms.includes('morning sickness')) {
      return {
        riskLevel: 'low',
        title: 'Morning Sickness - Normal Pregnancy Symptom',
        description: 'Nausea and morning sickness are common during the first trimester and usually not cause for concern.',
        recommendations: [
          'Eat small, frequent meals throughout the day',
          'Try ginger tea or ginger candies',
          'Avoid strong smells and spicy foods',
          'Stay hydrated with small sips of water'
        ],
        whenToSeekHelp: 'Contact your doctor if you cannot keep food or fluids down for 24 hours'
      };
    }
    
    return {
      riskLevel: 'medium',
      title: 'General Pregnancy Symptoms',
      description: 'Your symptoms may be related to normal pregnancy changes, but monitoring is recommended.',
      recommendations: [
        'Keep track of when symptoms occur',
        'Stay hydrated and get adequate rest',
        'Contact your healthcare provider if symptoms persist',
        'Monitor for any worsening of symptoms'
      ],
      whenToSeekHelp: 'Contact your healthcare provider if symptoms persist or worsen over 24-48 hours'
    };
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    const result = await analyzeSymptoms(symptoms);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const startVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSymptoms("I have a mild headache and feel tired");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">AI Symptom Checker</CardTitle>
              <p className="text-muted-foreground">Describe how you're feeling for AI analysis</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <Input
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms... (e.g., 'I have a headache and feel nauseous')"
                className="pr-16 h-14 text-base rounded-xl"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={startVoiceInput}
                className={`absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                  isListening ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'
                }`}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleAnalyze}
              disabled={!symptoms.trim() || isAnalyzing}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="flex space-x-1 mr-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </div>

          {analysis && (
            <div className="space-y-4 animate-slide-up">
              <div className={`rounded-xl p-4 border ${getRiskColor(analysis.riskLevel)}`}>
                <div className="flex items-center gap-2 mb-3">
                  {getRiskIcon(analysis.riskLevel)}
                  <h3 className="font-bold text-lg">{analysis.title}</h3>
                  <Badge className={getRiskColor(analysis.riskLevel)}>
                    {analysis.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="leading-relaxed mb-4">{analysis.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                    <div className="space-y-2">
                      {analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-3">
                    <h4 className="font-semibold mb-1">When to seek help:</h4>
                    <p className="text-sm">{analysis.whenToSeekHelp}</p>
                  </div>
                  
                  {analysis.emergencyContacts && (
                    <div className="flex gap-2">
                      {analysis.emergencyContacts.map((contact, idx) => (
                        <Button
                          key={idx}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          size="sm"
                          onClick={() => window.location.href = `tel:${contact}`}
                        >
                          Call {contact}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground text-center bg-amber-50/50 rounded-lg p-3 border border-amber-200/50">
            <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-600" />
            This AI analysis is for informational purposes only. Always consult healthcare professionals for medical advice.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};