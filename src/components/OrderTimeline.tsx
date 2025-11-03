import { Check, Clock, Package, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineEvent {
  status: string;
  timestamp: string | null;
  label: string;
}

interface OrderTimelineProps {
  currentStatus: 'pending' | 'in_progress' | 'proof_submitted' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  paymentConfirmedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
  disputedAt?: string | null;
  createdAt: string;
  proofSubmittedAt?: string | null;
}

export function OrderTimeline({
  currentStatus,
  paymentConfirmedAt,
  deliveredAt,
  completedAt,
  disputedAt,
  createdAt,
  proofSubmittedAt,
}: OrderTimelineProps) {
  const events: TimelineEvent[] = [
    {
      status: 'pending',
      timestamp: createdAt,
      label: 'Order Placed',
    },
    {
      status: 'in_progress',
      timestamp: paymentConfirmedAt,
      label: 'Payment Confirmed',
    },
    {
      status: 'proof_submitted',
      timestamp: proofSubmittedAt,
      label: 'Proof Submitted',
    },
    {
      status: 'delivered',
      timestamp: deliveredAt,
      label: 'Work Delivered',
    },
    {
      status: 'completed',
      timestamp: completedAt || disputedAt,
      label: currentStatus === 'disputed' ? 'Disputed' : 'Completed',
    },
  ];

  const getStatusIndex = (status: string) => {
    const statusOrder = ['pending', 'in_progress', 'proof_submitted', 'delivered', 'completed', 'disputed'];
    return statusOrder.indexOf(status);
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  const getIcon = (event: TimelineEvent, index: number) => {
    if (currentStatus === 'disputed' && event.status === 'completed') {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
    
    if (event.timestamp) {
      return <Check className="h-5 w-5 text-primary" />;
    }
    
    if (index === currentStatusIndex) {
      return <Clock className="h-5 w-5 text-muted-foreground animate-pulse" />;
    }
    
    return <Package className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const isActive = event.timestamp !== null;
        const isCurrent = index === currentStatusIndex;
        const isLast = index === events.length - 1;

        return (
          <div key={event.status} className="relative">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={`absolute left-[10px] top-8 w-0.5 h-12 ${
                  isActive ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}

            {/* Timeline item */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                  isActive
                    ? 'border-primary bg-primary/10'
                    : isCurrent
                    ? 'border-muted-foreground bg-background'
                    : 'border-border bg-background'
                }`}
              >
                {getIcon(event, index)}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <h4
                  className={`font-medium ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {event.label}
                </h4>
                {event.timestamp && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(event.timestamp), 'MMM d, yyyy - h:mm a')}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
