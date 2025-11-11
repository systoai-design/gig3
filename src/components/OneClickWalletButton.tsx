import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import bs58 from 'bs58';
import { WelcomeModal } from './WelcomeModal';

interface OneClickWalletButtonProps {
  className?: string;
}

export const OneClickWalletButton = ({ className }: OneClickWalletButtonProps) => {
  const { select, wallets, connect, publicKey, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const { signInWithWallet, signUpWithWallet } = useAuth();
  const [hasPhantom, setHasPhantom] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if Phantom wallet is available
    const phantom = wallets.find(wallet => wallet.adapter.name === 'Phantom');
    setHasPhantom(!!phantom && phantom.readyState === 'Installed');
  }, [wallets]);

  // Handle wallet authentication after connection
  useEffect(() => {
    const authenticate = async () => {
      if (!publicKey || !signMessage || isAuthenticating) return;

      setIsAuthenticating(true);
      
      try {
        // Generate message with nonce
        const message = `Sign in to GIG3\nNonce: ${Date.now()}\nOrigin: ${window.location.origin}`;
        const encodedMessage = new TextEncoder().encode(message);
        
        // Request signature
        const signature = await signMessage(encodedMessage);
        const signatureBase58 = bs58.encode(signature);
        
        // Attempt sign in
        const { error } = await signInWithWallet(
          publicKey.toBase58(),
          signatureBase58,
          message
        );
        
        if (error) {
          // Check if wallet is not registered
          if (error.message?.includes('not registered') || error.message?.includes('Wallet not found')) {
            // Auto-create account with generated credentials
            const walletShort = publicKey.toBase58().slice(0, 8);
            const username = `user_${walletShort}`;
            const name = `User ${walletShort}`;
            
            const signUpResult = await signUpWithWallet(
              publicKey.toBase58(),
              signatureBase58,
              message,
              name,
              username
            );
            
            if (signUpResult.error) {
              toast.error('Failed to create account: ' + signUpResult.error.message);
            } else {
              toast.success('Account created and signed in!');
              // Show welcome modal for new users
              setShowWelcome(true);
            }
          } else {
            toast.error('Sign in failed: ' + error.message);
          }
        } else {
          toast.success('Signed in successfully!');
        }
      } catch (error: any) {
        if (error.message?.includes('User rejected')) {
          toast.error('Wallet signature cancelled');
        } else {
          console.error('Authentication error:', error);
          toast.error('Authentication failed');
        }
      } finally {
        setIsAuthenticating(false);
      }
    };

    authenticate();
  }, [publicKey, signMessage, isAuthenticating, signInWithWallet, signUpWithWallet]);

  const handleConnect = async () => {
    if (!signMessage) {
      toast.error('Your wallet does not support message signing');
      return;
    }

    try {
      if (hasPhantom) {
        // Auto-select and connect to Phantom
        const phantom = wallets.find(wallet => wallet.adapter.name === 'Phantom');
        if (phantom) {
          select(phantom.adapter.name);
          await connect?.();
        }
      } else {
        // Open wallet modal
        setVisible(true);
      }
    } catch (error: any) {
      if (!error.message?.includes('User rejected')) {
        console.error('Connection error:', error);
        toast.error('Failed to connect wallet');
      }
    }
  };

  const getButtonLabel = () => {
    if (isAuthenticating) return 'Signing in...';
    return 'Connect Wallet';
  };

  return (
    <>
      <Button
        onClick={handleConnect}
        disabled={isAuthenticating}
        className={className}
        variant="default"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {getButtonLabel()}
      </Button>

      <WelcomeModal open={showWelcome} onClose={() => setShowWelcome(false)} />
    </>
  );
};
