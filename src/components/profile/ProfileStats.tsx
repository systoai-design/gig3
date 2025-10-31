import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, Star, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
  sellerProfile: any;
  totalOrders?: number;
}

export function ProfileStats({ sellerProfile, totalOrders = 0 }: ProfileStatsProps) {
  if (!sellerProfile) return null;

  const stats = [
    {
      icon: Clock,
      label: 'Response Time',
      value: `${sellerProfile.response_time_hours || 24}h`,
      color: 'text-primary',
    },
    {
      icon: CheckCircle,
      label: 'Completion Rate',
      value: `${sellerProfile.completion_rate || 100}%`,
      color: 'text-primary',
    },
    {
      icon: TrendingUp,
      label: 'Total Orders',
      value: totalOrders.toString(),
      color: 'text-secondary',
    },
    {
      icon: Star,
      label: 'Rating',
      value: '5.0',
      color: 'text-yellow-500',
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
        <div className="space-y-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className="font-semibold">{stat.value}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
