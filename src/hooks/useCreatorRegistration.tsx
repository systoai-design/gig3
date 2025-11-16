import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useCreatorRegistration = () => {
  const { user } = useAuth();
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();

  const handleBecomeCreator = (onAuthRequired?: () => void) => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Please sign in to become a creator');
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        navigate('/auth');
      }
      return false;
    }

    // Check if wallet is connected
    if (!connected || !publicKey) {
      toast.error('Please connect your Solana wallet to continue');
      return false;
    }

    // All checks passed, navigate to become creator page
    navigate('/become-creator');
    return true;
  };

  return { handleBecomeCreator };
};
