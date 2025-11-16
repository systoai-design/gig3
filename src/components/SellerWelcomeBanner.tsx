import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function SellerWelcomeBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('seller_welcome_dismissed') === 'true';
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('seller_welcome_dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 mb-6">
      <CardContent className="p-6 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Welcome to GIG3! 🎉</h3>
            <p className="text-muted-foreground mb-4">
              Get started with these quick steps to set up your seller profile and attract clients:
            </p>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Create Your First Gig</p>
                  <p className="text-sm text-muted-foreground">Showcase your skills and services</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Complete Your Profile</p>
                  <p className="text-sm text-muted-foreground">Add portfolio items, skills, and bio</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Connect Your Socials</p>
                  <p className="text-sm text-muted-foreground">Build trust with potential clients</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/create-gig">
                <Button>Create Your First Gig</Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline">Complete Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
