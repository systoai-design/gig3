import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, Sparkles, Shield, TrendingUp, Award, Zap } from "lucide-react";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const SubscriptionDialog = ({ open, onOpenChange, onSuccess }: SubscriptionDialogProps) => {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');

  const handleSubscribe = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setStep('payment');

    try {
      // Get payment instructions
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'create',
          walletAddress: publicKey.toBase58(),
        },
      });

      if (response.error) throw response.error;

      const { payment } = response.data;

      // Create transaction
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(payment.recipient),
          lamports: payment.amount_sol * LAMPORTS_PER_SOL,
        })
      );

      transaction.feePayer = publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      toast.info("Transaction sent, waiting for confirmation...");
      await connection.confirmTransaction(signature, 'confirmed');

      // Verify payment and create subscription
      const verifyResponse = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'verify',
          transactionSignature: signature,
        },
      });

      if (verifyResponse.error) throw verifyResponse.error;

      setStep('success');
      toast.success(verifyResponse.data.renewed ? "Pro subscription renewed!" : "Welcome to GIG3 Pro!");
      
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setStep('info');
      }, 2000);

    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || "Failed to process subscription");
      setStep('info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'info' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Upgrade to GIG3 Pro
              </DialogTitle>
              <DialogDescription>
                Get verified Pro status and unlock premium features
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-[35px] p-6 border border-primary/20">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary">0.5 SOL</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Verified PRO Badge</div>
                    <div className="text-sm text-muted-foreground">Stand out with a premium badge on your profile</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Priority in Search Results</div>
                    <div className="text-sm text-muted-foreground">Get featured at the top of search listings</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Money-Back Guarantee</div>
                    <div className="text-sm text-muted-foreground">Eligible for GIG3's quality guarantee program</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Pro-Only Gigs</div>
                    <div className="text-sm text-muted-foreground">Create exclusive high-value services</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Premium Support</div>
                    <div className="text-sm text-muted-foreground">Priority customer service and assistance</div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Maybe Later
              </Button>
              <Button onClick={handleSubscribe} disabled={loading || !publicKey}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'payment' && (
          <div className="py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-lg font-semibold">Processing Payment...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please confirm the transaction in your wallet
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-semibold">Welcome to GIG3 Pro!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your Pro badge is now active
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};