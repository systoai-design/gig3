import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Code2, Shield, Zap, FileCode } from "lucide-react";

const SmartContracts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Smart Contracts</h1>
              <p className="text-xl text-muted-foreground">
                Trustless Escrow on Solana
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border mb-12">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground">
                GIG3's escrow system is powered by a custom Solana program (smart contract) written in Rust using the Anchor framework. 
                This ensures transparent, secure, and efficient handling of payments between buyers and creators.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Shield className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Security Features</h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Immutable Code:</span>
                      <span className="text-muted-foreground"> Once deployed, the smart contract logic cannot be altered</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Decentralized Execution:</span>
                      <span className="text-muted-foreground"> No single party can unilaterally release or withhold funds</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Transparent Transactions:</span>
                      <span className="text-muted-foreground"> All transactions are recorded on-chain and publicly verifiable</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Audited Security:</span>
                      <span className="text-muted-foreground"> Contract follows Solana security best practices</span>
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.3}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Zap className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">How It Works</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Order Creation</h4>
                      <p className="text-sm text-muted-foreground">
                        Buyer initiates an order, creating an escrow account on-chain. SOL is transferred from buyer's 
                        wallet to the escrow program-derived address (PDA).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Funds Locked</h4>
                      <p className="text-sm text-muted-foreground">
                        Payment is secured in the escrow account. Neither party can access funds until delivery and approval.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Work Delivered</h4>
                      <p className="text-sm text-muted-foreground">
                        Creator completes and submits work. Delivery proof is recorded off-chain in the database.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-primary">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Approval & Release</h4>
                      <p className="text-sm text-muted-foreground">
                        Upon buyer approval (or auto-approval after 7 days), the smart contract splits payment: 
                        95% to creator, 5% platform fee, and closes the escrow account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.4}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Code2 className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Technical Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Program Architecture</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Built with Anchor framework for type safety and ease of development. Uses Program Derived Addresses (PDAs) 
                      for secure, deterministic escrow account generation.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-xl text-xs font-mono">
                      Framework: Anchor v0.29<br/>
                      Language: Rust<br/>
                      Network: Solana Mainnet Beta
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Key Instructions</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <code className="text-primary">initialize_escrow</code>
                        <span className="text-muted-foreground">- Create escrow and lock funds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="text-primary">release_escrow</code>
                        <span className="text-muted-foreground">- Release funds to creator on approval</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <code className="text-primary">cancel_escrow</code>
                        <span className="text-muted-foreground">- Return funds to buyer (dispute resolution)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.5}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <FileCode className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Source Code</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  The GIG3 escrow smart contract is open source and available for review. You can find the complete 
                  Solana program code in our repository.
                </p>
                <div className="bg-muted/50 p-4 rounded-2xl">
                  <p className="text-sm text-muted-foreground mb-2">Repository Location:</p>
                  <code className="text-sm break-all">/solana-program/programs/gig3-escrow/</code>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.6}>
              <div className="bg-card border rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-4">Fee Structure</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                    <span className="font-semibold">Creator Receives</span>
                    <span className="text-primary font-bold">95%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                    <span className="font-semibold">Platform Fee</span>
                    <span className="text-primary font-bold">5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                    <span className="font-semibold">Solana Network Fee</span>
                    <span className="text-muted-foreground text-sm">~0.000005 SOL (minimal)</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SmartContracts;
