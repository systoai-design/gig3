import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wallet, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface OrderConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gig: {
    id: string;
    title: string;
    price_sol: number;
    delivery_days: number;
    seller_id: string;
    images: string[];
  };
}

export function OrderConfirmationDialog({ open, onOpenChange, gig }: OrderConfirmationDialogProps) {
  const { user } = useAuth();
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const handleCreateOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setCreating(true);

      // Create order in database (without blockchain transaction for now)
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          gig_id: gig.id,
          buyer_id: user.id,
          seller_id: gig.seller_id,
          amount_sol: gig.price_sol,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Order created! You can now proceed with payment.');
      onOpenChange(false);
      navigate(`/orders/${order.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Your Order</DialogTitle>
          <DialogDescription>
            Review the details before placing your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Gig Preview */}
          <div className="flex gap-4">
            {gig.images[0] && (
              <img 
                src={gig.images[0]} 
                alt={gig.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-base line-clamp-2">{gig.title}</h3>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Price</span>
              </div>
              <Badge variant="secondary" className="text-base">
                {gig.price_sol} SOL
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Delivery Time</span>
              </div>
              <span className="text-sm font-medium">{gig.delivery_days} days</span>
            </div>

            {connected && publicKey ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span>Wallet</span>
                </div>
                <span className="text-sm font-mono">
                  {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                </span>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Please connect your Solana wallet to proceed with payment
                </p>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">{gig.price_sol} SOL</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateOrder} 
            disabled={creating || !connected}
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
