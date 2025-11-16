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

      // User has a wallet account - monitor for changes
      if (connected && currentWalletAddress) {
        // Clear any pending disconnect timeout (wallet reconnected)
        if (disconnectTimeoutRef.current) {
          clearTimeout(disconnectTimeoutRef.current);
          disconnectTimeoutRef.current = null;
          hasShownDisconnectWarning.current = false;
        }

        // Check if wallet changed to a different address
        // Only compare if we have a previous wallet and it's different
        if (previousWalletRef.current && 
            userWalletAddress.toLowerCase() !== currentWalletAddress.toLowerCase() &&
            previousWalletRef.current.toLowerCase() === userWalletAddress.toLowerCase()) {
          toast.info('Wallet changed. Please sign in with the new wallet.');
          signOut();
          return;
        }
      } else if (!connected && previousWalletRef.current && userWalletAddress) {
        // Wallet disconnected - wait 5 seconds before signing out
        // Longer grace period to handle page refreshes and wallet reconnections
        if (!disconnectTimeoutRef.current && !hasShownDisconnectWarning.current) {
          hasShownDisconnectWarning.current = true;
          disconnectTimeoutRef.current = setTimeout(() => {
            // Only sign out if still disconnected after grace period
            if (!connected) {
              toast.info('Wallet disconnected. You have been signed out.');
              signOut();
            }
          }, 5000); // 5 second grace period
        }
      }

      previousWalletRef.current = currentWalletAddress;
    }, 500); // 500ms debounce for more stability
    
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
