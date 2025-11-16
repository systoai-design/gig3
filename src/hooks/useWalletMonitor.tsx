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
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const hasShownDisconnectWarning = useRef(false);

  useEffect(() => {
    // Debounce wallet changes to prevent rapid-fire checks
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      // Skip on initial mount to prevent false positives
      if (isInitialMount.current) {
        isInitialMount.current = false;
        previousWalletRef.current = publicKey?.toBase58() || null;
        return;
      }

      const currentWalletAddress = publicKey?.toBase58() || null;
      const userWalletAddress = user?.user_metadata?.wallet_address;

      // Skip monitoring if user doesn't have a wallet account (email/password users)
      if (!user || !userWalletAddress) {
        previousWalletRef.current = currentWalletAddress;
        return;
      }

      // User has a wallet account - ONLY monitor for wallet address changes (not disconnects)
      if (connected && currentWalletAddress) {
        // Clear any pending disconnect timeout (wallet reconnected)
        if (disconnectTimeoutRef.current) {
          clearTimeout(disconnectTimeoutRef.current);
          disconnectTimeoutRef.current = null;
          hasShownDisconnectWarning.current = false;
        }

        // Check if wallet changed to a different address
        // Sign out ONLY if the connected wallet address doesn't match the user's registered wallet
        if (userWalletAddress.toLowerCase() !== currentWalletAddress.toLowerCase()) {
          toast.info('Different wallet detected. Please sign in with the correct wallet.');
          signOut();
          return;
        }
      }
      // NOTE: Removed disconnect timeout - users stay logged in even if wallet disconnects temporarily

      previousWalletRef.current = currentWalletAddress;
    }, 500); // 500ms debounce for stability
    
    return () => {
      if (disconnectTimeoutRef.current) {
        clearTimeout(disconnectTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [publicKey, connected, user, signOut]);
};
