import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wallet, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

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
    has_packages?: boolean;
    packages?: Array<{
      name: string;
      description: string;
      price_sol: number;
      delivery_days: number;
      revisions: number;
      features: string[];
    }>;
  };
  selectedPackageIndex?: number;
}

export function OrderConfirmationDialog({ open, onOpenChange, gig, selectedPackageIndex = 0 }: OrderConfirmationDialogProps) {
  const { user } = useAuth();
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Get the selected package or use gig defaults
  const selectedPackage = gig.has_packages && gig.packages?.[selectedPackageIndex] 
    ? gig.packages[selectedPackageIndex]
    : null;
  
  const orderPrice = selectedPackage ? selectedPackage.price_sol : gig.price_sol;
  const orderDeliveryDays = selectedPackage ? selectedPackage.delivery_days : gig.delivery_days;

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      setIsAdmin(!!data);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const handleTestOrder = async () => {
    if (!user || !isAdmin) {
      toast.error('Admin access required');
      return;
    }

    try {
      setCreating(true);
      setTransactionStatus('Creating test order...');

      const { data, error } = await supabase
        .from('orders')
        .insert({
          gig_id: gig.id,
          buyer_id: user.id,
          seller_id: gig.seller_id,
          amount_sol: orderPrice,
          status: 'in_progress',
          transaction_signature: 'TEST_ORDER_' + Date.now(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Test order created successfully!');
      onOpenChange(false);
      navigate(`/orders/${data.id}`);
    } catch (error: any) {
      console.error('Test order error:', error);
      toast.error(error.message || 'Failed to create test order');
    } finally {
      setCreating(false);
      setTransactionStatus('');
    }
  };

  const handleCreateOrder = async () => {
    try {
      setCreating(true);
      setTransactionStatus('Preparing transaction...');

      if (!user) {
        toast.error('Please sign in to place an order');
        return;
      }

      if (!publicKey || !signTransaction) {
        toast.error('Please connect your wallet');
        return;
      }

      // Create escrow wallet public key
      const escrowWallet = new PublicKey('W6Qe25zGpwRpt7k8Hrg2RANF7N88XP7JU5BEeKaTrJ2');
      const amountLamports = orderPrice * LAMPORTS_PER_SOL;

      setTransactionStatus('Creating transaction...');

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: escrowWallet,
          lamports: amountLamports,
        })
      );

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      setTransactionStatus('Waiting for wallet approval...');

      // Sign transaction with wallet
      const signedTransaction = await signTransaction(transaction);

      setTransactionStatus('Sending transaction to Solana...');

      // Send transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      setTransactionStatus('Confirming transaction...');

      // Wait for confirmation
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');

      setTransactionStatus('Creating order...');

      // Call edge function to create order
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          gigId: gig.id,
          buyerId: user.id,
          sellerId: gig.seller_id,
          amount: orderPrice,
          deliveryDays: orderDeliveryDays,
          packageIndex: selectedPackageIndex,
          transactionSignature: signature,
          escrowWallet: escrowWallet.toBase58(),
        },
      });

      if (error) throw error;

      setTransactionStatus('Order created successfully!');
      toast.success('Order placed successfully!');
      
      // Redirect to order detail page
      navigate(`/orders/${data.orderId}`);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Order creation error:', error);
      if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
        toast.error('Transaction cancelled');
        setTransactionStatus('Transaction cancelled');
      } else {
        toast.error('Failed to place order: ' + error.message);
        setTransactionStatus('Failed: ' + error.message);
      }
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
              {selectedPackage && (
                <Badge variant="outline" className="mt-1">{selectedPackage.name} Package</Badge>
              )}
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
                {orderPrice} SOL
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Delivery Time</span>
              </div>
              <span className="text-sm font-medium">{orderDeliveryDays} days</span>
            </div>

            {selectedPackage && (
              <div className="border-t pt-3">
                <p className="text-sm font-medium mb-2">Includes:</p>
                <ul className="space-y-1">
                  {selectedPackage.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  <li className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{selectedPackage.revisions} revisions</span>
                  </li>
                </ul>
              </div>
            )}

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
            <span className="text-2xl font-bold text-primary">{orderPrice} SOL</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
            Cancel
          </Button>
          {isAdmin && (
            <Button 
              onClick={handleTestOrder} 
              disabled={creating}
              variant="secondary"
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {transactionStatus || 'Processing...'}
                </>
              ) : (
                '🧪 Create Test Order (Free)'
              )}
            </Button>
          )}
          <Button 
            onClick={handleCreateOrder} 
            disabled={creating || !connected}
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {transactionStatus || 'Processing...'}
              </>
            ) : (
              'Place Order & Pay'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
