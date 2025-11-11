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
      completed: !!paymentConfirmedAt,
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
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${(steps.filter(s => s.completed).length / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  step.completed && 'bg-primary border-primary text-primary-foreground',
                  step.active && !step.completed && 'border-primary bg-background text-primary',
                  !step.active && !step.completed && 'border-muted bg-muted text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                'text-xs font-medium text-center',
                (step.completed || step.active) ? 'text-foreground' : 'text-muted-foreground'
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
