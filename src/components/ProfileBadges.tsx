import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfileBadges } from '@/hooks/useProfileBadges';
import { formatDistanceToNow } from 'date-fns';

interface ProfileBadgesProps {
  userId: string;
  variant?: 'full' | 'compact';
}

export function ProfileBadges({ userId, variant = 'full' }: ProfileBadgesProps) {
  const { badges, isLoading } = useProfileBadges(userId);

  if (isLoading) return null;

  const earnedBadges = badges.filter(b => b.earned);
  
  if (earnedBadges.length === 0 && variant === 'compact') return null;

  // Always show full variant even with no earned badges
  if (variant === 'full' && earnedBadges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Achievement Badges</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete your profile to earn badges and unlock exclusive perks!
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-muted bg-muted/20 opacity-40 hover:opacity-60 transition-all">
                        <div className="text-4xl">{badge.icon}</div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-semibold">{badge.label}</p>
                          <Badge variant="outline" className="text-xs">
                            {badge.threshold}%
                          </Badge>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-semibold">{badge.label}</p>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                        {badge.perk && (
                          <p className="text-xs text-primary font-medium">✨ {badge.perk}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Complete {badge.threshold}% of your profile to unlock
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {earnedBadges.map((badge) => (
          <TooltipProvider key={badge.type}>
            <Tooltip>
              <TooltipTrigger>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="text-2xl cursor-pointer"
                >
                  {badge.icon}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-semibold">{badge.label}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {badge.perk && (
                    <p className="text-xs text-primary">✨ {badge.perk}</p>
                  )}
                  {badge.earnedAt && (
                    <p className="text-xs text-muted-foreground">
                      Earned {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Achievement Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                        ${badge.earned 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-muted bg-muted/20 opacity-40'
                        }
                      `}
                    >
                      <div className="text-4xl">{badge.icon}</div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-semibold">{badge.label}</p>
                        <Badge variant={badge.earned ? 'default' : 'outline'} className="text-xs">
                          {badge.threshold}%
                        </Badge>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1 max-w-xs">
                      <p className="font-semibold">{badge.label}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      {badge.perk && (
                        <p className="text-xs text-primary font-medium">✨ {badge.perk}</p>
                      )}
                      {badge.earned && badge.earnedAt && (
                        <p className="text-xs text-muted-foreground">
                          Earned {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
                        </p>
                      )}
                      {!badge.earned && (
                        <p className="text-xs text-muted-foreground">
                          Complete {badge.threshold}% of your profile to unlock
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
