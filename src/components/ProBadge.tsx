import { Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProBadgeProps {
  proSince?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ProBadge = ({ proSince, size = 'md', showIcon = true }: ProBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  };

  const formattedDate = proSince 
    ? new Date(proSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const badge = (
    <div className={`
      inline-flex items-center justify-center font-bold rounded-full
      bg-gradient-to-r from-primary via-accent to-primary
      bg-[length:200%_100%] animate-gradient
      text-white shadow-lg
      ${sizeClasses[size]}
    `}>
      {showIcon && <Sparkles className={iconSizes[size]} />}
      PRO
    </div>
  );

  if (formattedDate) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>Pro Member since {formattedDate}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
};