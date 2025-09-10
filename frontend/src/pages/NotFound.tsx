import { Link } from "react-router-dom";
import { Home, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-card-maternal border-primary-soft">
        <CardContent className="text-center py-12">
          <div className="mb-6">
            <Heart className="w-20 h-20 mx-auto text-primary/30 mb-4" />
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
            <p className="text-muted-foreground text-large leading-relaxed">
              The page you're looking for doesn't exist. Let's get you back to your maternal health journey.
            </p>
          </div>
          
          <Link to="/">
            <Button variant="maternal" size="large" className="w-full">
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export { NotFound };
export default NotFound;
