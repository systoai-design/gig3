import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OneClickWalletButtonProps {
  className?: string;
}

export const OneClickWalletButton = ({ className }: OneClickWalletButtonProps) => {
  const { select, wallets, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    // Check if Phantom wallet is available
    const phantom = wallets.find(wallet => wallet.adapter.name === 'Phantom');
    setHasPhantom(!!phantom && phantom.readyState === 'Installed');
  }, [wallets]);

  const handleConnect = () => {
    if (hasPhantom) {
      // Auto-select Phantom if available
      const phantom = wallets.find(wallet => wallet.adapter.name === 'Phantom');
      if (phantom) {
        select(phantom.adapter.name);
      }
    } else {
      // Fall back to wallet modal if Phantom not detected
      setVisible(true);
    }
  };

  if (connected) {
    return null;
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={connecting}
      className={className}
      variant="default"
    >
      <Wallet className="h-4 w-4 mr-2" />
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};
