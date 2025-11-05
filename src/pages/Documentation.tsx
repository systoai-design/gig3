import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Book, Rocket, Wallet, ShoppingBag, FileText, Shield } from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation</h1>
              <p className="text-xl text-muted-foreground">
                Everything You Need to Know About GIG3
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <ScrollReveal animation="fadeUp" delay={0.1}>
              <div className="bg-card border rounded-3xl p-6 hover:border-primary/50 transition-colors">
                <Rocket className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Getting Started</h3>
                <p className="text-muted-foreground mb-4">
                  Learn the basics of using GIG3, from creating an account to your first transaction.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Creating your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Connecting your Solana wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Setting up your profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Understanding the platform layout</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.15}>
              <div className="bg-card border rounded-3xl p-6 hover:border-primary/50 transition-colors">
                <Wallet className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Wallet Integration</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive guide to wallet setup, security, and managing your SOL.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Supported wallet providers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Security best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Buying SOL for transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Wallet troubleshooting</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div className="bg-card border rounded-3xl p-6 hover:border-primary/50 transition-colors">
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">For Creators</h3>
                <p className="text-muted-foreground mb-4">
                  Complete guide to selling services and building your freelance business.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Creating compelling gigs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Pricing strategies and packages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Managing orders and deliveries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Building your portfolio</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.25}>
              <div className="bg-card border rounded-3xl p-6 hover:border-primary/50 transition-colors">
                <ShoppingBag className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">For Buyers</h3>
                <p className="text-muted-foreground mb-4">
                  Everything you need to know about finding and hiring talented creators.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Finding the right creator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Placing and managing orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Reviewing deliveries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Handling revisions and feedback</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.3}>
              <div className="bg-card border rounded-3xl p-6 hover:border-primary/50 transition-colors">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Smart Contract Escrow</h3>
                <p className="text-muted-foreground mb-4">
                  Understanding how our blockchain-based escrow protects your transactions.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>How escrow works</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Payment flow and timelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Dispute resolution process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Fee structure breakdown</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.35}>
              <div className="bg-card border rounded-3xl p-6 hover:border-primary/50 transition-colors">
                <Book className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">Platform Features</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed documentation of all platform features and capabilities.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Messaging system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Reviews and ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>PRO membership benefits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Search and discovery</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fadeUp" delay={0.4}>
            <div className="bg-card border rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Common Topics</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Account Management</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Profile customization</li>
                    <li>• Privacy settings</li>
                    <li>• Notification preferences</li>
                    <li>• Account security</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Payments & Withdrawals</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Understanding SOL payments</li>
                    <li>• Platform fee breakdown</li>
                    <li>• Instant withdrawal process</li>
                    <li>• Transaction history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Communication</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Messaging best practices</li>
                    <li>• Setting expectations</li>
                    <li>• Handling difficult situations</li>
                    <li>• Professional etiquette</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Troubleshooting</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Common wallet issues</li>
                    <li>• Transaction problems</li>
                    <li>• Platform errors</li>
                    <li>• Getting support</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.5}>
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border text-center mt-12">
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Check our FAQ or contact support.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="/support" 
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                  Visit Support Center
                </a>
                <a 
                  href="/community-standards" 
                  className="inline-block px-6 py-3 bg-card border rounded-full font-semibold hover:bg-accent transition-colors"
                >
                  Community Standards
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Documentation;
