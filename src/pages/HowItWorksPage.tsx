import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { UserPlus, Search, ShoppingCart, Wallet, FileText, CheckCircle } from "lucide-react";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">How GIG3 Works</h1>
              <p className="text-xl text-muted-foreground">
                Simple, Secure, and Transparent Freelancing
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-20">
            <ScrollReveal animation="fadeUp" delay={0.1}>
              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">For Buyers</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">1. Browse & Discover</h3>
                    <p className="text-muted-foreground">
                      Explore thousands of gigs across various categories. Filter by price, delivery time, and ratings.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">2. Place Order</h3>
                    <p className="text-muted-foreground">
                      Select a package and place your order. Funds are held in secure smart contract escrow.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">3. Review & Approve</h3>
                    <p className="text-muted-foreground">
                      Review the delivered work and approve to release payment. Request revisions if needed.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">For Creators</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">1. Create Profile</h3>
                    <p className="text-muted-foreground">
                      Connect your wallet, set up your profile, and become a verified creator on the platform.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">2. Create Gigs</h3>
                    <p className="text-muted-foreground">
                      List your services with detailed descriptions, pricing packages, and delivery timeframes.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">3. Get Paid</h3>
                    <p className="text-muted-foreground">
                      Deliver quality work and get paid instantly in SOL when buyers approve. Only 5% platform fee.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.3}>
              <div className="bg-card border rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Smart Contract Escrow Protection</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Payment Locked in Escrow</h3>
                      <p className="text-muted-foreground">When a buyer places an order, payment is locked in a smart contract escrow on Solana blockchain.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Creator Delivers Work</h3>
                      <p className="text-muted-foreground">The creator works on the project and submits the deliverables before the deadline.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Buyer Reviews & Approves</h3>
                      <p className="text-muted-foreground">Buyer reviews the work and can approve, request revisions, or open a dispute if needed.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Funds Released Automatically</h3>
                      <p className="text-muted-foreground">Once approved (or auto-approved after 7 days), the smart contract releases 95% to creator, 5% platform fee.</p>
                    </div>
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

export default HowItWorksPage;
