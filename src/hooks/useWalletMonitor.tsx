import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Monitors wallet connection changes and automatically signs out users
 * when their wallet address changes or disconnects.
 * Includes a 3-second grace period to prevent sign-out during temporary disconnects.
 */
export const useWalletMonitor = () => {
  const { publicKey, connected } = useWallet();
  const { user, signOut } = useAuth();
  const previousWalletRef = useRef<string | null>(null);
  const disconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount to prevent false positives
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousWalletRef.current = publicKey?.toBase58() || null;
      return;
    }

    const currentWalletAddress = publicKey?.toBase58() || null;
    const userWalletAddress = user?.user_metadata?.wallet_address;

    // Skip if no user or user doesn't have a wallet account
    if (!user || !userWalletAddress) {
      previousWalletRef.current = currentWalletAddress;
      return;
    }

    // User has a wallet account - monitor for changes
    if (connected && currentWalletAddress) {
      // Clear any pending disconnect timeout (wallet reconnected)
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current);
        disconnectTimeoutRef.current = null;
      }

      // Check if wallet changed to a different address
      if (userWalletAddress !== currentWalletAddress) {
        toast.info('Wallet changed. Please sign in with the new wallet.');
        signOut();
        return;
      }
    } else if (!connected && previousWalletRef.current && userWalletAddress) {
      // Wallet disconnected - wait 3 seconds before signing out
      // This prevents sign-out during temporary disconnects (page navigation, etc.)
      if (!disconnectTimeoutRef.current) {
        disconnectTimeoutRef.current = setTimeout(() => {
          toast.info('Wallet disconnected. You have been signed out.');
          signOut();
        }, 3000); // 3 second grace period
      }
    }

    previousWalletRef.current = currentWalletAddress;
  }, [publicKey, connected, user, signOut]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current);
      }
    };
  }, []);
};
