import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { useProStatus } from "@/hooks/useProStatus";
import { useAuth } from "@/contexts/AuthContext";

export const ProSubscriptionBanner = () => {
  const { user } = useAuth();
  const { data: proStatus } = useProStatus(user?.id);
  const [showDialog, setShowDialog] = useState(false);

  if (!user) return null;

  // Show renewal reminder if expiring soon
  const showRenewalReminder = proStatus?.isPro && proStatus?.daysLeft && proStatus.daysLeft <= 7;

  // Show upgrade banner if not pro
  const showUpgradeBanner = !proStatus?.isPro;

  if (!showRenewalReminder && !showUpgradeBanner) return null;

  return (
    <>
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent-cyan/10 border-primary/30 shadow-[0_0_30px_rgba(14,165,233,0.2)] dark:shadow-[0_0_30px_rgba(14,165,233,0.15)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              {showRenewalReminder ? (
                <>
                  <h3 className="font-semibold text-lg">Renew Your Pro Subscription</h3>
                  <p className="text-sm text-muted-foreground">
                    Your Pro membership expires in {proStatus.daysLeft} {proStatus.daysLeft === 1 ? 'day' : 'days'}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">Upgrade to GIG3 Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Get verified Pro badge, priority search ranking, and premium features
                  </p>
                </>
              )}
            </div>
          </div>
          <Button onClick={() => setShowDialog(true)} className="gap-2">
            {showRenewalReminder ? (
              <>
                <Calendar className="h-4 w-4" />
                Renew Now
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Upgrade to Pro
              </>
            )}
          </Button>
        </div>
      </Card>

      <SubscriptionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
};