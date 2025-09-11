import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Play,
  Volume2,
  Clock,
  Star,
  ChevronRight,
  Filter,
  Heart,
  ArrowRight,
  Users,
  Award,
} from "lucide-react";
import heroImage from "@/assets/pregnant-woman.png";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "audio";
  category: "nutrition" | "exercise" | "mental-health" | "baby-development";
  duration: string;
  rating: number;
  icon: string;
  color: string;
  url: string;
}

export const EducationalResources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const resources: Resource[] = [
    {
      id: "1",
      title: "Nutrition During Pregnancy",
      description:
        "Find out how to eat a healthy diet in pregnancy, including plenty of fruit and vegetables, and cutting down on sugar and saturated fat.",
      type: "article",
      category: "nutrition",
      duration: "5 min read",
      rating: 4.8,
      icon: "🥗",
      color: "bg-emerald-500",
      url: "https://www.hopkinsmedicine.org/health/wellness-and-prevention/nutrition-during-pregnancy",
    },
    {
      id: "2",
      title: "10 minute PRENATAL YOGA for Beginners (Safe for ALL Trimesters)",
      description: "Gentle exercises for a healthy pregnancy",
      type: "video",
      category: "exercise",
      duration: "11 min",
      rating: 4.9,
      icon: "🧘♀️",
      color: "bg-violet-500",
      url: "https://youtu.be/4NwQKXpWN_A",
    },
    {
      id: "3",
      title: "01 Managing anxious thoughts in pregnancy | Guided practice",
      description: "Mental wellness techniques for expectant mothers",
      type: "audio",
      category: "mental-health",
      duration: "14 min",
      rating: 4.7,
      icon: "🧠",
      color: "bg-blue-500",
      url: "https://youtu.be/vfQOYhzdDEU",
    },
    {
      id: "4",
      title: "Baby Development Guide",
      description: "A Week-by-Week Guide to Your Babys First Year Milestones",
      type: "article",
      category: "baby-development",
      duration: "8 min read",
      rating: 4.9,
      icon: "👶",
      color: "bg-pink-500",
      url: "https://www.parents.com/baby/development/growth/baby-development-week-by-week/#toc-12-month-baby-milestones",
    },
    {
      id: "5",
      title: "Pregnancy: A Month-By-Month Guide | 3D Animation",
      description: "A comprehensive video guide on pregnancy stages",
      type: "video",
      category: "exercise",
      duration: "4 min",
      rating: 4.6,
      icon: "💪",
      color: "bg-orange-500",
      url: "https://youtu.be/8BH7WFmRs-E",
    },
    {
      id: "6",
      title: "Mindfulness & Meditation",
      description:
        "7 mins Daily Pregnancy Meditation for Positivity, Calmness & Connecting with Your Baby | Bharti Goel",
      type: "video",
      category: "mental-health",
      duration: "7 min",
      rating: 4.8,
      icon: "🕯️",
      color: "bg-indigo-500",
      url: "https://youtu.be/Km0CsOjF_Fw",
    },
  ];

  const categories = [
    { id: "all", name: "All" },
    { id: "nutrition", name: "Nutrition" },
    { id: "exercise", name: "Exercise" },
    { id: "mental-health", name: "Wellness" },
    { id: "baby-development", name: "Development" },
  ];

  const filteredResources =
    selectedCategory === "all"
      ? resources
      : resources.filter((resource) => resource.category === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="w-4 h-4" />;
      case "video":
        return <Play className="w-4 h-4" />;
      case "audio":
        return <Volume2 className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    return "bg-white text-gray-600 border border-gray-300";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/40"></div>
        <div className="relative px-6 lg:px-24 pt-16 pb-0">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div className="pb-16">
              <div className="inline-flex items-center gap-2 bg-pink-100 rounded-full px-4 py-2 mb-6">
                <BookOpen className="w-4 h-4 text-pink-600" />
                <span className="text-pink-700 text-sm font-medium">
                  Learning Hub
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Expert Resources for Your Journey
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Access curated content from healthcare professionals, covering
                everything from nutrition to mental wellness during pregnancy.
              </p>
              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 font-medium">
                    10,000+ mothers learning
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 font-medium">
                    Expert-verified content
                  </span>
                </div>
              </div>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg">
                Start Learning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Maternal health resources"
                  className="w-full h-[400px] object-cover object-top rounded-t-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-24 py-12 space-y-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-500 mb-2">
              {resources.length}
            </div>
            <div className="text-gray-600">Resources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {categories.length - 1}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">4.8</div>
            <div className="text-gray-600">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
            <div className="text-gray-600">Available</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-pink-500 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-pink-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="group hover:shadow-md hover:bg-gray-50 transition-all duration-200 border border-gray-200 bg-white cursor-pointer"
              onClick={() => {
                window.open(resource.url, "_blank");
              }}
            >
              <CardContent className="px-6 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 hidden sm:flex">
                    <span className="text-lg">{resource.icon}</span>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 text-xs">
                    {resource.type}
                  </Badge>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 leading-tight text-base">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                  {resource.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {resource.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {resource.rating}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Content */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 lg:p-12 border border-pink-100 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-semibold text-pink-700">
              Featured Content
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Complete Pregnancy Guide
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Comprehensive week-by-week guide covering nutrition, exercise,
                mental wellness, and baby development milestones.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  <span>Video Series</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>2 hours total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>4.9 rating</span>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3"
              >
                Start Learning
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                  <span className="text-6xl">🤱</span>
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-12">
        <div className="px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-pink-600">MAMA</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Your trusted maternal health companion across Ghana.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li>AI Health Assistant</li>
                <li>Appointment Reminders</li>
                <li>Clinic Locator</li>
                <li>Health Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Emergency</h4>
              <p className="text-gray-600 mb-2">Ghana Ambulance Service</p>
              <p className="text-2xl font-bold text-pink-600">193</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-600">
              © 2024 MAMA. Made with ❤️ for mothers in Ghana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
