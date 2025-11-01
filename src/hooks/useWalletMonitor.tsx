import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Monitors wallet connection changes and automatically signs out users
 * when their wallet address changes or disconnects
 */
export const useWalletMonitor = () => {
  const { publicKey, connected } = useWallet();
  const { user, signOut } = useAuth();
  const previousWalletRef = useRef<string | null>(null);

  useEffect(() => {
    const currentWalletAddress = publicKey?.toBase58() || null;
    const userWalletAddress = user?.user_metadata?.wallet_address;

    // Skip if no user or user doesn't have a wallet account
    if (!user || !userWalletAddress) {
      previousWalletRef.current = currentWalletAddress;
      return;
    }

    // User has a wallet account - monitor for changes
    if (connected && currentWalletAddress) {
      // Check if wallet changed to a different address
      if (userWalletAddress !== currentWalletAddress) {
        toast.info('Wallet changed. Please sign in with the new wallet.');
        signOut();
        return;
      }
    } else if (!connected && previousWalletRef.current) {
      // Wallet was disconnected
      toast.info('Wallet disconnected. Please reconnect to continue.');
      signOut();
    }

    previousWalletRef.current = currentWalletAddress;
  }, [publicKey, connected, user, signOut]);
};
