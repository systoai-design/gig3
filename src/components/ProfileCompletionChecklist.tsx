import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  weight: number;
  action?: () => void;
  link?: string;
}

interface ProfileCompletionChecklistProps {
  completion: number;
  profile: any;
  sellerProfile: any | null;
  dismissible?: boolean;
}

export function ProfileCompletionChecklist({
  completion,
  profile,
  sellerProfile,
  dismissible = true,
}: ProfileCompletionChecklistProps) {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed || completion === 100) {
    return null;
  }

  const items: ChecklistItem[] = [
    {
      id: 'avatar',
      label: 'Add profile picture',
      completed: !!profile.avatar_url,
      weight: 10,
      link: '/settings?tab=media',
    },
    {
      id: 'banner',
      label: 'Add banner image',
      completed: !!profile.banner_url,
      weight: 10,
      link: '/settings?tab=media',
    },
    {
      id: 'bio',
      label: 'Write a bio (50+ characters)',
      completed: !!profile.bio && profile.bio.length > 50,
      weight: 15,
      link: '/settings?tab=general',
    },
    {
      id: 'tagline',
      label: 'Add a tagline',
      completed: !!profile.tagline,
      weight: 5,
      link: '/settings?tab=general',
    },
    {
      id: 'location',
      label: 'Add your location',
      completed: !!profile.location,
      weight: 5,
      link: '/settings?tab=general',
    },
    {
      id: 'languages',
      label: 'Add languages',
      completed: profile.languages?.length > 0,
      weight: 10,
      link: '/settings?tab=general',
    },
    {
      id: 'social',
      label: 'Add social links',
      completed: profile.social_links && Object.keys(profile.social_links).length > 0,
      weight: 10,
      link: '/settings?tab=social',
    },
  ];

  // Add seller-specific items
  if (sellerProfile) {
    items.push(
      {
        id: 'skills',
        label: 'Add at least 3 skills',
        completed: sellerProfile.skills?.length >= 3,
        weight: 10,
        link: '/settings?tab=professional',
      },
      {
        id: 'portfolio',
        label: 'Add portfolio item',
        completed: sellerProfile.portfolio_items?.length > 0,
        weight: 15,
        link: '/settings?tab=professional',
      },
      {
        id: 'education',
        label: 'Add education',
        completed: sellerProfile.education?.length > 0,
        weight: 5,
        link: '/settings?tab=professional',
      },
      {
        id: 'certifications',
        label: 'Add certification',
        completed: sellerProfile.certifications?.length > 0,
        weight: 5,
        link: '/settings?tab=professional',
      }
    );
  }

  const incompleteItems = items.filter(item => !item.completed);
  const completedCount = items.filter(item => item.completed).length;

  const getStrength = (percent: number) => {
    if (percent >= 80) return { label: 'Excellent', color: 'text-primary' };
    if (percent >= 60) return { label: 'Great', color: 'text-primary' };
    if (percent >= 40) return { label: 'Good', color: 'text-secondary' };
    return { label: 'Getting Started', color: 'text-muted-foreground' };
  };

  const strength = getStrength(completion);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Complete Your Profile</CardTitle>
                <Badge variant="secondary" className={strength.color}>
                  {strength.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {items.length} items completed
              </p>
            </div>
            {dismissible && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDismissed(true)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Profile Strength</span>
                <span className="font-bold text-primary">{completion}%</span>
              </div>
              <Progress value={completion} className="h-2" />
            </div>

            {incompleteItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">What's missing:</p>
                <div className="space-y-2">
                  {incompleteItems.slice(0, 5).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.label}</span>
                        <Badge variant="outline" className="text-xs">
                          +{item.weight}%
                        </Badge>
                      </div>
                      {item.link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(item.link!)}
                          className="h-7 text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => navigate('/settings')}
              className="w-full"
            >
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
