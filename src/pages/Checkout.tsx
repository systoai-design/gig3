import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Copy, ExternalLink, Wallet, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { createEscrowTransfer, ESCROW_WALLET } from '@/lib/solana/escrow';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loading, clearCart } = useCart();
  const { publicKey, sendTransaction } = useWallet();
  const [sendingPayment, setSendingPayment] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item.gig) return total;
      let price = item.gig.price_sol;
      if (item.package_index !== null && item.gig.packages && item.gig.packages[item.package_index]) {
        price = item.gig.packages[item.package_index].price;
      }
      return total + (price * item.quantity);
    }, 0);
  };

  const totalAmount = calculateTotal();
  const escrowWalletAddress = ESCROW_WALLET.toBase58();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleSendPayment = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (totalAmount === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    try {
      setSendingPayment(true);
      toast.info('Preparing transaction...');
      
      const connection = new Connection(
        import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'confirmed'
      );

      // Create transfer transaction
      const transaction = await createEscrowTransfer(
        connection,
        publicKey,
        ESCROW_WALLET,
        totalAmount
      );

      toast.info('Please approve the transaction in your wallet...');
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      toast.info('Payment sent! Confirming on blockchain...');
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast.success('Payment confirmed! Creating your orders...');

      // Automatically create orders for each cart item
      const orderPromises = cartItems.map(async (item) => {
        if (!item.gig) return null;

        let price = item.gig.price_sol;
        let deliveryDays = 7;
        
        if (item.package_index !== null && item.gig.packages && item.gig.packages[item.package_index]) {
          const pkg = item.gig.packages[item.package_index];
          price = pkg.price;
          deliveryDays = pkg.delivery_days || 7;
        }

        const { data, error } = await supabase.functions.invoke('create-order', {
          body: {
            gigId: item.gig_id,
            buyerId: user.id,
            sellerId: item.gig.seller_id,
            amount: price * item.quantity,
            deliveryDays,
            packageIndex: item.package_index,
            transactionSignature: signature,
            escrowWallet: escrowWalletAddress,
          },
        });

        if (error) throw error;
        return data;
      });

      await Promise.all(orderPromises);
      
      // Clear cart
      await clearCart();

      toast.success(`Successfully created ${cartItems.length} order(s)!`);
      navigate('/dashboard/buyer');
      
    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
        toast.error('Transaction cancelled');
      } else {
        toast.error(error.message || 'Failed to complete payment');
      }
    } finally {
      setSendingPayment(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-navbar flex items-center justify-center">
          <p>Loading cart...</p>
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-navbar flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/explore')}>Browse Services</Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-navbar pt-8 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>

          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
                  if (!item.gig) return null;

                  let price = item.gig.price_sol;
                  let packageName = 'Basic Package';

                  if (item.package_index !== null && item.gig.packages && item.gig.packages[item.package_index]) {
                    const pkg = item.gig.packages[item.package_index];
                    price = pkg.price;
                    packageName = pkg.name;
                  }

                  return (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <img
                        src={item.gig.images?.[0] || '/placeholder.svg'}
                        alt={item.gig.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.gig.title}</h3>
                        <p className="text-xs text-muted-foreground">{packageName}</p>
                        <p className="text-sm font-medium mt-1">
                          {item.quantity} × {price.toFixed(2)} SOL
                        </p>
                      </div>
                      <p className="font-bold">{(price * item.quantity).toFixed(2)} SOL</p>
                    </div>
                  );
                })}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{totalAmount.toFixed(2)} SOL</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Fee (0%)</span>
                    <span>0.00 SOL</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">{totalAmount.toFixed(2)} SOL</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <div className="space-y-6">
              {/* Wallet Connection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Step 1: Connect Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!publicKey ? (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your Solana wallet to continue
                      </p>
                      <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-secondary rounded">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Wallet Connected</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Send Payment */}
              {publicKey && (
                <Card>
                  <CardHeader>
                    <CardTitle>Step 2: Complete Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Escrow Wallet Address</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={escrowWalletAddress}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(escrowWalletAddress)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary rounded space-y-2">
                      <p className="text-sm font-medium">Amount to Send:</p>
                      <p className="text-2xl font-bold text-primary">
                        {totalAmount.toFixed(2)} SOL
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSendPayment}
                      disabled={sendingPayment}
                    >
                      {sendingPayment ? 'Processing Payment...' : 'Pay & Create Orders'}
                    </Button>

                    {sendingPayment && (
                      <p className="text-xs text-muted-foreground text-center">
                        Please approve the transaction in your wallet and wait while we create your orders...
                      </p>
                    )}

                    {!sendingPayment && (
                      <p className="text-xs text-muted-foreground text-center">
                        Funds will be held in escrow until work is delivered and approved
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
