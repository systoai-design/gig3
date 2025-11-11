import { Check, Clock, Package, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStatusIndicatorProps {
  currentStatus: string;
  paymentConfirmedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
}

export function OrderStatusIndicator({
  currentStatus,
  paymentConfirmedAt,
  deliveredAt,
  completedAt
}: OrderStatusIndicatorProps) {
  const steps = [
    {
      id: 'payment',
      label: 'Payment Confirmed',
      icon: Check,
      completed: !!paymentConfirmedAt || !['pending', 'cancelled', 'disputed'].includes(currentStatus),
      active: currentStatus === 'pending',
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      icon: Clock,
      completed: currentStatus !== 'pending',
      active: currentStatus === 'in_progress',
    },
    {
      id: 'delivered',
      label: 'Proof Submitted',
      icon: Package,
      completed: !!deliveredAt || currentStatus === 'proof_submitted' || currentStatus === 'completed',
      active: currentStatus === 'proof_submitted' || currentStatus === 'delivered',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      completed: !!completedAt,
      active: currentStatus === 'completed',
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Animated gradient progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gradient-to-r from-muted via-muted to-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 transition-all duration-700 ease-out relative"
            style={{
              width: `${(steps.filter(s => s.completed).length / (steps.length - 1)) * 100}%`
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slide" />
          </div>
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 bg-background px-2 z-10">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative',
                  step.completed && [
                    'bg-gradient-to-br from-cyan-500 via-purple-500 to-magenta-500',
                    'border-transparent',
                    'text-white',
                    'shadow-lg shadow-purple-500/50',
                    'scale-110'
                  ],
                  step.active && !step.completed && [
                    'border-primary',
                    'bg-background',
                    'text-primary',
                    'shadow-md shadow-primary/30'
                  ],
                  !step.active && !step.completed && [
                    'border-muted',
                    'bg-muted/30',
                    'text-muted-foreground'
                  ]
                )}
              >
                <Icon className="w-6 h-6" />
                
                {/* Completion checkmark overlay */}
                {step.completed && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <span className={cn(
                'text-xs font-medium text-center max-w-[80px] leading-tight',
                step.completed && 'text-foreground font-semibold',
                step.active && !step.completed && 'text-primary font-semibold',
                !step.active && !step.completed && 'text-muted-foreground'
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
