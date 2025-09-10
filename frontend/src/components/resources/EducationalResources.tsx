import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, Volume2, Clock, Star, Heart, Baby, Apple, Dumbbell, Brain } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio';
  category: 'nutrition' | 'exercise' | 'mental-health' | 'baby-development';
  duration: string;
  rating: number;
  icon: string;
  color: string;
}

export const EducationalResources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Healthy Eating During Pregnancy',
      description: 'Essential nutrients and foods for you and your baby\'s development.',
      type: 'article',
      category: 'nutrition',
      duration: '5 min read',
      rating: 4.8,
      icon: '🥗',
      color: 'bg-green-500'
    },
    {
      id: '2',
      title: 'Prenatal Yoga for Beginners',
      description: 'Gentle exercises to keep you healthy and prepare for childbirth.',
      type: 'video',
      category: 'exercise',
      duration: '15 min',
      rating: 4.9,
      icon: '🧘♀️',
      color: 'bg-purple-500'
    },
    {
      id: '3',
      title: 'Managing Pregnancy Anxiety',
      description: 'Techniques to stay calm and positive throughout your pregnancy.',
      type: 'audio',
      category: 'mental-health',
      duration: '12 min',
      rating: 4.7,
      icon: '🧠',
      color: 'bg-blue-500'
    },
    {
      id: '4',
      title: 'Your Baby\'s Development: Week by Week',
      description: 'Understanding how your baby grows from conception to birth.',
      type: 'article',
      category: 'baby-development',
      duration: '8 min read',
      rating: 4.9,
      icon: '👶',
      color: 'bg-pink-500'
    },
    {
      id: '5',
      title: 'Safe Exercises for Each Trimester',
      description: 'Workout routines adapted for every stage of pregnancy.',
      type: 'video',
      category: 'exercise',
      duration: '20 min',
      rating: 4.6,
      icon: '💪',
      color: 'bg-orange-500'
    },
    {
      id: '6',
      title: 'Meditation for Expectant Mothers',
      description: 'Guided meditation sessions for relaxation and bonding.',
      type: 'audio',
      category: 'mental-health',
      duration: '10 min',
      rating: 4.8,
      icon: '🕯️',
      color: 'bg-indigo-500'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen, count: resources.length },
    { id: 'nutrition', name: 'Nutrition', icon: Apple, count: resources.filter(r => r.category === 'nutrition').length },
    { id: 'exercise', name: 'Exercise', icon: Dumbbell, count: resources.filter(r => r.category === 'exercise').length },
    { id: 'mental-health', name: 'Mental Health', icon: Brain, count: resources.filter(r => r.category === 'mental-health').length },
    { id: 'baby-development', name: 'Baby Development', icon: Baby, count: resources.filter(r => r.category === 'baby-development').length }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'audio': return <Volume2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'video': return 'bg-red-100 text-red-700 border-red-200';
      case 'audio': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-24 animate-fade-in">
      <div className="px-4 space-y-4 sm:space-y-6 mobile-safe">
        {/* Modern Header */}
        <div className="relative overflow-hidden">
          <div className="h-28 sm:h-32 bg-gradient-primary relative rounded-2xl">
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
            <div className="relative z-10 p-4 sm:p-6 text-white flex items-center gap-3 sm:gap-4 h-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="animate-slide-up">
                <h1 className="text-xl sm:text-2xl font-bold mb-1">Educational Resources</h1>
                <p className="text-sm sm:text-base text-white/80">Learn and grow with expert guidance</p>
              </div>
              <div className="ml-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Heart className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-4 sm:mb-6 bg-white/50 backdrop-blur-sm border border-white/20 h-auto p-1 gap-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id} 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col gap-1 py-2 sm:py-3 px-1 sm:px-2 min-h-[60px] sm:min-h-[auto]"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{category.name}</span>
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {category.count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-4">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {filteredResources.map((resource, index) => (
                  <div
                    key={resource.id}
                    className="bg-gradient-card rounded-2xl p-4 sm:p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-200 animate-slide-up group"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${resource.color} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
                        <span className="text-lg sm:text-xl">{resource.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-foreground text-base sm:text-lg leading-tight">
                            {resource.title}
                          </h3>
                          <Badge className={`text-xs font-medium ${getTypeBadgeColor(resource.type)} flex items-center gap-1`}>
                            {getTypeIcon(resource.type)}
                            {resource.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3 leading-relaxed">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {resource.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {resource.rating}
                            </div>
                          </div>
                          <Button
                            variant="gradient"
                            size="sm"
                            className="group-hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
                            onClick={() => {
                              import('sonner').then(({ toast }) => {
                                toast.success(`Opening ${resource.title}`, {
                                  description: `${resource.type === 'article' ? 'Reading' : resource.type === 'video' ? 'Watching' : 'Listening to'} ${resource.title}...`,
                                  duration: 2000,
                                });
                              });
                            }}
                          >
                            {resource.type === 'article' ? 'Read' : resource.type === 'video' ? 'Watch' : 'Listen'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12 bg-gradient-card rounded-2xl shadow-lg">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    No resources found
                  </h3>
                  <p className="text-muted-foreground">
                    Try selecting a different category.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Featured Section */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Card className="bg-gradient-card shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Star className="w-6 h-6 text-yellow-500" />
                Featured This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <span className="text-2xl">🤱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      Preparing for Breastfeeding
                    </h3>
                    <p className="text-muted-foreground">
                      Complete guide to successful breastfeeding journey
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      Video Series
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      45 min total
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      4.9
                    </div>
                  </div>
                  <Button 
                    variant="gradient" 
                    size="lg" 
                    className="w-full sm:w-auto"
                    onClick={() => {
                      import('sonner').then(({ toast }) => {
                        toast.success('Starting Featured Content', {
                          description: 'Opening Preparing for Breastfeeding series...',
                          duration: 2000,
                        });
                      });
                    }}
                  >
                    Start Learning
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};