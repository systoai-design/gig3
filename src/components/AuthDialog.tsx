import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { z } from 'zod';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';
import * as bs58 from 'bs58';
import { Check, Wallet, FileSignature, UserCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const walletSignupSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces'),
  username: z.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must only contain letters, numbers, and underscores')
    .toLowerCase()
});

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Onboarding steps enum
enum OnboardingStep {
  CONNECT_WALLET = 1,
  SIGN_MESSAGE = 2,
  PROFILE_SETUP = 3,
  COMPLETE = 4
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signInWithWallet, signUpWithWallet, signOut, user } = useAuth();
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.CONNECT_WALLET);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExistingUser, setIsExistingUser] = useState(false);
  const authInProgressRef = useRef(false);
  const signatureScheduledRef = useRef(false);
  const signatureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Steps configuration
  const steps = [
    { number: 1, title: 'Connect Wallet', icon: Wallet },
    { number: 2, title: 'Sign Message', icon: FileSignature },
    { number: 3, title: 'Setup Profile', icon: UserCircle },
  ];

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(OnboardingStep.CONNECT_WALLET);
      setErrors({});
      setIsSubmitting(false);
      setIsExistingUser(false);
      signatureScheduledRef.current = false;
      if (signatureTimeoutRef.current) {
        clearTimeout(signatureTimeoutRef.current);
        signatureTimeoutRef.current = null;
      }
    }
  }, [open]);

  // Close dialog when user successfully authenticates
  useEffect(() => {
    if (user && open) {
      setCurrentStep(OnboardingStep.COMPLETE);
      
      // Check user roles and redirect appropriately
      const checkRolesAndRedirect = async () => {
        try {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);
          
          const isSeller = roles?.some(r => r.role === 'seller');
          
          setTimeout(() => {
            onOpenChange(false);
            // Redirect sellers to seller dashboard, buyers stay where they are
            if (isSeller) {
              navigate('/dashboard/seller');
            }
          }, 2000);
        } catch (error) {
          console.error('Error checking roles:', error);
          setTimeout(() => onOpenChange(false), 2000);
        }
      };
      
      checkRolesAndRedirect();
    }
  }, [user, open, onOpenChange, navigate]);

  // Handle wallet connection
  useEffect(() => {
    const handleWalletConnection = async () => {
      if (!open) {
        signatureScheduledRef.current = false;
        if (signatureTimeoutRef.current) {
          clearTimeout(signatureTimeoutRef.current);
          signatureTimeoutRef.current = null;
        }
        return;
      }

      if (!connected || !publicKey) {
        setCurrentStep(OnboardingStep.CONNECT_WALLET);
        signatureScheduledRef.current = false;
        return;
      }

      // Check if user is already logged in with a different wallet
      if (user && connected && publicKey) {
        const userWalletAddress = user.user_metadata?.wallet_address;
        const currentWalletAddress = publicKey.toBase58();
        
        if (userWalletAddress && userWalletAddress !== currentWalletAddress) {
          toast.info('Different wallet detected. Please authenticate with this wallet.');
          await signOut();
          setCurrentStep(OnboardingStep.SIGN_MESSAGE);
          signatureScheduledRef.current = false;
          return;
        }
      }

      // Move to sign message step when wallet connects (only once)
      if (currentStep === OnboardingStep.CONNECT_WALLET && !signatureScheduledRef.current) {
        if (!signMessage || typeof signMessage !== 'function') {
          toast.error('This wallet does not support message signing. Please use Phantom or Solflare.');
          if (disconnect) await disconnect();
          return;
        }
        
        setCurrentStep(OnboardingStep.SIGN_MESSAGE);
        signatureScheduledRef.current = true;
        
        // Schedule signature request only once
        signatureTimeoutRef.current = setTimeout(() => {
          handleSignMessage();
          signatureTimeoutRef.current = null;
        }, 1500);
      }
    };

    handleWalletConnection();
    
    return () => {
      if (signatureTimeoutRef.current) {
        clearTimeout(signatureTimeoutRef.current);
        signatureTimeoutRef.current = null;
      }
    };
  }, [connected, publicKey, user, signOut, open]);

  const handleSignMessage = async (retryCount = 0, maxRetries = 3) => {
    // Prevent multiple simultaneous auth attempts
    if (authInProgressRef.current) {
      console.log('Auth already in progress, skipping');
      return;
    }

    // Check if signMessage is available as a function
    if (!publicKey || !signMessage || typeof signMessage !== 'function') {
      if (retryCount < maxRetries) {
        // Wait and retry with exponential backoff
        const delay = 1000 * Math.pow(2, retryCount); // 1s, 2s, 4s
        toast.info(`Waiting for wallet to initialize... (${retryCount + 1}/${maxRetries})`, {
          id: 'wallet-init'
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        toast.dismiss('wallet-init');
        return handleSignMessage(retryCount + 1, maxRetries);
      }
      
      toast.error('Wallet does not support message signing. Please try reconnecting.');
      setCurrentStep(OnboardingStep.CONNECT_WALLET);
      if (disconnect) await disconnect();
      return;
    }

    authInProgressRef.current = true;
    setIsSubmitting(true);
    
    try {
      const message = `Sign this message to authenticate with GIG3: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      toast.info('Please approve the signature request in your wallet', {
        id: 'wallet-sign',
        duration: 10000
      });

      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      toast.dismiss('wallet-sign');

      // Try to sign in (check if wallet is registered)
      const { error } = await signInWithWallet(
        publicKey.toBase58(),
        signatureBase58,
        message
      );

      if (error && error.message?.includes('not registered')) {
        // New user - show profile setup
        setIsExistingUser(false);
        setCurrentStep(OnboardingStep.PROFILE_SETUP);
        toast.info('New wallet detected. Please complete your profile.');
      } else if (!error) {
        // Existing user - sign in complete
        setIsExistingUser(true);
        onOpenChange(false);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error('Authentication failed. Please try again.');
        setCurrentStep(OnboardingStep.CONNECT_WALLET);
        if (disconnect) await disconnect();
      }
    } catch (error: any) {
      toast.dismiss('wallet-sign');
      
      if (error.message?.includes('not a function')) {
        toast.error('Wallet connection issue. Please disconnect and reconnect your wallet.');
        setCurrentStep(OnboardingStep.CONNECT_WALLET);
        if (disconnect) await disconnect();
      } else if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
        toast.error('Signature rejected. Please try again.');
        setCurrentStep(OnboardingStep.SIGN_MESSAGE);
      } else if (error.message?.includes('Wallet locked')) {
        toast.error('Please unlock your wallet and try again.');
        setCurrentStep(OnboardingStep.SIGN_MESSAGE);
      } else {
        toast.error(`Authentication error: ${error.message || 'Unknown error'}`);
        setCurrentStep(OnboardingStep.SIGN_MESSAGE);
      }
    } finally {
      setIsSubmitting(false);
      authInProgressRef.current = false;
    }
  };

  const handleProfileSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      username: formData.get('username') as string
    };

    try {
      // Validate input
      const validatedData = walletSignupSchema.parse(data);
      
      if (!publicKey || !signMessage) {
        throw new Error('Wallet not connected');
      }

      // Sign message for account creation
      const message = `Sign this message to create your GIG3 account: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      toast.info('Please approve the signature request to create your account', {
        id: 'signup-sign'
      });

      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      toast.dismiss('signup-sign');

      // Create account
      const { error } = await signUpWithWallet(
        publicKey.toBase58(),
        signatureBase58,
        message,
        validatedData.name,
        validatedData.username
      );

      if (!error) {
        setCurrentStep(OnboardingStep.COMPLETE);
        toast.success('Account created successfully!');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix the errors in the form');
      } else if (error instanceof Error) {
        if (error.message?.includes('rejected')) {
          toast.error('Signature rejected. Please try again.');
        } else {
          toast.error(error.message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const Icon = step.icon;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors",
                  isCompleted && "bg-primary border-primary",
                  isActive && "border-primary bg-primary/10",
                  !isCompleted && !isActive && "border-muted bg-muted/10"
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Icon className={cn(
                    "w-6 h-6",
                    isActive && "text-primary",
                    !isActive && "text-muted-foreground"
                  )} />
                )}
              </motion.div>
              <span className={cn(
                "text-xs font-medium text-center max-w-[80px]",
                isActive && "text-primary",
                !isActive && "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-12 h-0.5 mx-2 mb-8 transition-colors",
                currentStep > step.number ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case OnboardingStep.CONNECT_WALLET:
        return (
          <motion.div
            key="connect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6 py-8"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connect your Solana wallet to get started with GIG3
              </p>
            </div>
            <WalletMultiButton className="!bg-gradient-primary hover:!opacity-90 !text-white !border-0 mx-auto !h-12 !rounded-full !px-8 !text-base !font-semibold" />
            <p className="text-xs text-muted-foreground">
              Supported wallets: Phantom, Solflare
            </p>
          </motion.div>
        );

      case OnboardingStep.SIGN_MESSAGE:
        return (
          <motion.div
            key="sign"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6 py-8"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Verify Your Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Sign a message to verify you own this wallet
              </p>
            </div>
            
            {isSubmitting ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Waiting for wallet signature...
                </p>
                <p className="text-xs text-muted-foreground">
                  Check your wallet extension
                </p>
              </div>
            ) : (
              <Button
                onClick={() => handleSignMessage()}
                className="bg-gradient-primary hover:opacity-90 h-12 px-8 rounded-full"
                disabled={isSubmitting || !signMessage || typeof signMessage !== 'function'}
              >
                <FileSignature className="mr-2 h-5 w-5" />
                Sign Message
              </Button>
            )}

            <div className="text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Why do I need to sign?</p>
              <p>Signing proves you control this wallet without revealing your private keys.</p>
            </div>
          </motion.div>
        );

      case OnboardingStep.PROFILE_SETUP:
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 py-4"
          >
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Tell us a bit about yourself
              </p>
            </div>

            <form onSubmit={handleProfileSetup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  maxLength={50}
                  disabled={isSubmitting}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  required
                  maxLength={20}
                  disabled={isSubmitting}
                  className={errors.username ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  Letters, numbers, and underscores only
                </p>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary h-12 rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </form>
          </motion.div>
        );

      case OnboardingStep.COMPLETE:
        return (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6 py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-primary" />
            </motion.div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                {isExistingUser ? 'Welcome Back!' : 'Welcome to GIG3!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isExistingUser 
                  ? 'You\'re all set and ready to go'
                  : 'Your account has been created successfully'
                }
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Redirecting...
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            GIG3
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentStep === OnboardingStep.COMPLETE 
              ? 'Authentication successful'
              : 'Secure wallet-based authentication'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {currentStep !== OnboardingStep.COMPLETE && renderStepIndicator()}
          
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
