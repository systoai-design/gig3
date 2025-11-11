import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Zap, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: Shield,
    title: 'Secure Escrow',
    description: 'Your payments are protected by blockchain escrow until work is delivered',
  },
  {
    icon: Zap,
    title: 'Instant Payments',
    description: 'Get paid instantly in SOL with low fees on the Solana network',
  },
  {
    icon: DollarSign,
    title: 'Fair Pricing',
    description: 'Set your own rates and keep more of what you earn with our low platform fees',
  },
  {
    icon: Users,
    title: 'Global Marketplace',
    description: 'Connect with buyers and sellers worldwide in a decentralized marketplace',
  },
];

export const WelcomeModal = ({ open, onClose }: WelcomeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to GIG3! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-center text-muted-foreground">
            Your wallet is connected and you're ready to explore the future of freelancing
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
            <h4 className="font-semibold text-foreground mb-2">Getting Started</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Browse gigs or create your own to start earning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Complete your profile to build trust with the community</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Make your first transaction with blockchain security</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={onClose}
              size="lg"
              className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
            >
              Start Exploring
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
