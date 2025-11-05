import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Shield, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";

const TrustSafety = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Trust & Safety</h1>
              <p className="text-xl text-muted-foreground">
                Your Security is Our Priority
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-12">
            <ScrollReveal animation="fadeUp" delay={0.1}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Shield className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Smart Contract Security</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  All transactions are secured by audited smart contracts on the Solana blockchain. 
                  Funds are held in escrow until work is delivered and approved, protecting both buyers and sellers.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Funds cannot be accessed without proper authorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Automatic release after approval or dispute resolution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Transparent on-chain transaction history</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Lock className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Wallet Authentication</h2>
                </div>
                <p className="text-muted-foreground">
                  We use secure wallet-based authentication. Your private keys never leave your wallet, 
                  and you maintain full control of your funds at all times. Connect with popular Solana wallets 
                  like Phantom, Solflare, and more.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.3}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <AlertTriangle className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Dispute Resolution</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    If issues arise between buyers and creators, our dispute resolution process ensures fair outcomes:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Initial Communication</h4>
                        <p className="text-sm text-muted-foreground">Parties are encouraged to resolve issues directly through platform messaging.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Formal Dispute</h4>
                        <p className="text-sm text-muted-foreground">Either party can open a formal dispute with evidence and reasoning.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Admin Review</h4>
                        <p className="text-sm text-muted-foreground">Our team reviews all evidence and makes a fair decision within 48-72 hours.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-primary">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Resolution</h4>
                        <p className="text-sm text-muted-foreground">Escrow is released according to the decision: full refund, partial refund, or full payment to creator.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.4}>
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border">
                <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Always communicate through the platform for a record of conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Review creator profiles, ratings, and past work before ordering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Provide clear requirements and expectations upfront</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Never share sensitive personal information or conduct transactions outside the platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Report suspicious activity or policy violations immediately</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrustSafety;
