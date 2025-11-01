import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const walletSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20)
});

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'signin' | 'signup' | 'wallet';
}

export function AuthDialog({ open, onOpenChange, defaultTab = 'signin' }: AuthDialogProps) {
  const { signUp, signIn, signInWithWallet, signUpWithWallet, signOut, user } = useAuth();
  const { publicKey, signMessage, connected } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [walletRegistered, setWalletRegistered] = useState<boolean | null>(null);
  const [checkingWallet, setCheckingWallet] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update active tab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Close dialog when user successfully authenticates
  useEffect(() => {
    if (user && open) {
      onOpenChange(false);
    }
  }, [user, open, onOpenChange]);

  // Check if wallet is registered when connected
  useEffect(() => {
    const checkWalletRegistration = async () => {
      // If user is already logged in, check if wallet matches
      if (user && connected && publicKey) {
        const userWalletAddress = user.user_metadata?.wallet_address;
        const currentWalletAddress = publicKey.toBase58();
        
        if (userWalletAddress && userWalletAddress !== currentWalletAddress) {
          // Different wallet - sign out current user
          toast.info('Different wallet detected. Please authenticate with this wallet.');
          await signOut();
          setWalletRegistered(null);
          return;
        }
      }

      if (connected && publicKey && !user && open && activeTab === 'wallet') {
        setCheckingWallet(true);
        try {
          const message = `Sign this message to authenticate with GIG3: ${Date.now()}`;
          const encodedMessage = new TextEncoder().encode(message);
          
          if (!signMessage) {
            throw new Error('Wallet does not support message signing');
          }

          const signature = await signMessage(encodedMessage);
          const signatureBase58 = bs58.encode(signature);

          // Try to sign in to check if wallet is registered
          const { error } = await signInWithWallet(
            publicKey.toBase58(),
            signatureBase58,
            message
          );

          if (error && error.message.includes('not registered')) {
            setWalletRegistered(false);
          } else if (!error) {
            // Successfully signed in
            setWalletRegistered(true);
            toast.success('Welcome back!');
          } else {
            setWalletRegistered(false);
          }
        } catch (error) {
          console.error('Error checking wallet:', error);
          setWalletRegistered(false);
        } finally {
          setCheckingWallet(false);
        }
      } else if (!connected) {
        setWalletRegistered(null);
      }
    };

    checkWalletRegistration();
  }, [connected, publicKey, user, signOut, open, activeTab]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    try {
      signUpSchema.parse(data);
      const { error } = await signUp(data.email, data.password, data.username, data.name);
      if (!error) {
        toast.success('Account created successfully!');
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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    try {
      signInSchema.parse(data);
      const { error } = await signIn(data.email, data.password);
      if (!error) {
        toast.success('Signed in successfully!');
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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalletSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      username: formData.get('username') as string
    };

    try {
      walletSignupSchema.parse(data);
      
      if (!publicKey || !signMessage) {
        throw new Error('Wallet not connected');
      }

      const message = `Sign this message to create your GIG3 account: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      const { error } = await signUpWithWallet(
        publicKey.toBase58(),
        signatureBase58,
        message,
        data.name,
        data.username
      );

      if (!error) {
        toast.success('Account created successfully!');
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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            GIG3
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  required
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4">
            {!connected ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your Solana wallet to sign up or sign in
                </p>
                <WalletMultiButton className="!bg-gradient-primary" />
              </div>
            ) : checkingWallet ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Checking wallet...</p>
              </div>
            ) : walletRegistered === false ? (
              <form onSubmit={handleWalletSignup} className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Complete your registration
                </p>
                <div className="space-y-2">
                  <Label htmlFor="wallet-name">Full Name</Label>
                  <Input
                    id="wallet-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet-username">Username</Label>
                  <Input
                    id="wallet-username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    required
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Complete Registration'}
                </Button>
              </form>
            ) : walletRegistered === true ? (
              <div className="text-center space-y-4 py-4">
                <p className="text-sm text-success">
                  ✓ Wallet authenticated successfully!
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <WalletMultiButton className="!bg-gradient-primary" />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
