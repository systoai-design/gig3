import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import bs58 from 'bs58';

/**
 * Monitors wallet connection changes, automatically signs in users when wallet connects,
 * and signs out users when their wallet address changes or disconnects.
 * Includes a 3-second grace period to prevent sign-out during temporary disconnects.
 */
export const useWalletMonitor = () => {
  const { publicKey, connected, signMessage } = useWallet();
  const { user, signOut, signInWithWallet } = useAuth();
  const previousWalletRef = useRef<string | null>(null);
  const disconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const isSigningIn = useRef(false);

  // Auto sign-in when wallet connects
  useEffect(() => {
    const attemptAutoSignIn = async () => {
      // Only try auto sign-in if:
      // 1. Wallet is connected
      // 2. User is not already authenticated
      // 3. We have publicKey
      // 4. Not already in the process of signing in
      if (!connected || !publicKey || user || isSigningIn.current) {
        return;
      }

      // Check if wallet supports message signing
      if (typeof signMessage !== 'function') {
        console.log('Wallet does not support message signing');
        return;
      }

      try {
        isSigningIn.current = true;
        const walletAddress = publicKey.toBase58();
        
        // Generate sign message
        const message = `Sign this message to authenticate with GIG3.\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;
        const messageBytes = new TextEncoder().encode(message);
        
        // Request signature
        const signature = await signMessage(messageBytes);
        const signatureBase58 = bs58.encode(signature);

        // Attempt sign in
        const { error } = await signInWithWallet(walletAddress, signatureBase58, message);
        
        if (error) {
          // If wallet not registered, silently ignore (user can manually sign up)
          if (error.message?.includes('not registered')) {
            console.log('Wallet not registered, user needs to sign up');
          } else {
            console.error('Auto sign-in failed:', error);
          }
        }
      } catch (error: any) {
        // Silently handle - don't spam user with errors if they reject signature
        if (error?.message?.includes('User rejected')) {
          console.log('User rejected signature request');
        } else {
          console.error('Auto sign-in error:', error);
        }
      } finally {
        isSigningIn.current = false;
      }
    };

    attemptAutoSignIn();
  }, [connected, publicKey, user, signMessage, signInWithWallet]);

  // Monitor for wallet changes and disconnects
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

      // TEMPORARY: Disable auto-signout to prevent false disconnections during page navigation
      const DISABLE_AUTO_SIGNOUT = true;
      if (DISABLE_AUTO_SIGNOUT) {
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
          console.log('Wallet changed, signing out');
          signOut();
          return;
        }
      } else if (!connected && previousWalletRef.current && userWalletAddress) {
        // Wallet disconnected - wait 3 seconds before signing out
        // This prevents sign-out during temporary disconnects (page navigation, etc.)
        if (!disconnectTimeoutRef.current) {
          disconnectTimeoutRef.current = setTimeout(() => {
            console.log('Wallet disconnected, signing out');
            signOut();
          }, 3000); // 3 second grace period
        }
      }

      previousWalletRef.current = currentWalletAddress;
    }, 2000); // Increased from 300ms to 2s to handle page transitions
    
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
