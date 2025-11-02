import { useState, useEffect } from 'react';
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
  const { publicKey, connected, signMessage } = useWallet();
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
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    if (!connected || !publicKey || !signMessage) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setCreating(true);
      setTransactionStatus('Initiating x402 payment flow...');

      // Step 1: Request order creation (server responds with 402)
      const orderRequest = {
        gigId: gig.id,
        buyerId: user.id,
        sellerId: gig.seller_id,
        amount: orderPrice,
        packageName: selectedPackage?.name,
      };

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const initialResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(orderRequest),
        }
      );

      // Step 2: Handle HTTP 402 Payment Required
      if (initialResponse.status === 402) {
        const paymentInstructions = await initialResponse.json();
        console.log('x402 payment instructions received:', paymentInstructions);

        setTransactionStatus('Preparing payment...');

        // Create x402 payment message
        const paymentMessage = JSON.stringify({
          protocol: 'x402',
          version: '1.0',
          blockchain: paymentInstructions.blockchain,
          network: paymentInstructions.network,
          token: paymentInstructions.token,
          amount: paymentInstructions.amount,
          recipients: paymentInstructions.recipients,
          metadata: paymentInstructions.metadata,
          timestamp: Date.now(),
          payer: publicKey.toBase58(),
        });

        setTransactionStatus('Waiting for wallet signature...');
        toast.info('Please sign the payment message in your wallet');

        // Sign the payment message (x402 signature proof)
        const messageBytes = new TextEncoder().encode(paymentMessage);
        const signature = await signMessage(messageBytes);
        
        // Convert signature to base64
        const signatureBase64 = btoa(String.fromCharCode(...signature));

        setTransactionStatus('Verifying payment...');

        // Step 3: Submit payment proof back to server
        const paymentProof = {
          signature: signatureBase64,
          publicKey: publicKey.toBase58(),
          message: paymentMessage,
          protocol: 'x402-solana',
          timestamp: Date.now(),
        };

        const finalResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
              'X-Payment': JSON.stringify(paymentProof),
            },
            body: JSON.stringify(orderRequest),
          }
        );

        if (!finalResponse.ok) {
          const error = await finalResponse.json();
          throw new Error(error.error || 'Payment verification failed');
        }

        const result = await finalResponse.json();
        console.log('x402 payment verified, order created:', result);

        toast.success('Payment verified! Order placed successfully.');
        onOpenChange(false);
        navigate(`/orders/${result.order.id}`);
        
      } else if (initialResponse.ok) {
        // Unexpected success without payment
        const result = await initialResponse.json();
        toast.success('Order created successfully!');
        onOpenChange(false);
        navigate(`/orders/${result.order.id}`);
      } else {
        const error = await initialResponse.json();
        throw new Error(error.error || 'Failed to initiate payment');
      }
      
    } catch (error: any) {
      console.error('x402 payment error:', error);
      
      if (error.message?.includes('User rejected')) {
        toast.error('Payment signature cancelled by user');
      } else {
        toast.error(error.message || 'Failed to process payment');
      }
    } finally {
      setCreating(false);
      setTransactionStatus('');
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
              'Place Order & Pay with x402'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
