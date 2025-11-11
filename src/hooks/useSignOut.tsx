import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Combined sign out hook that handles both wallet disconnection and auth sign out
 */
export const useSignOut = () => {
  const { signOut } = useAuth();
  const { disconnect, connected } = useWallet();
  
  const handleSignOut = async () => {
    try {
      // Disconnect wallet first if connected
      if (connected && disconnect) {
        await disconnect();
        console.log('Wallet disconnected during sign out');
      }
    } catch (error) {
      console.error('Error disconnecting wallet during sign out:', error);
      // Continue with sign out even if wallet disconnect fails
    }
    
    // Then sign out from auth
    await signOut();
  };
  
  return handleSignOut;
};
