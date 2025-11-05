import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Code, Terminal, Key, Book } from "lucide-react";

const ApiDocs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">API Documentation</h1>
              <p className="text-xl text-muted-foreground">
                Build on Top of GIG3
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border mb-12 text-center">
              <Code className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">API Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                We're working on a comprehensive API that will allow developers to integrate GIG3 
                functionality into their applications. Features will include:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Gig browsing and search</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Order placement and management</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>User profile data</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Transaction history</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Messaging integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Webhook notifications</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Terminal className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Smart Contract Integration</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  While our REST API is under development, you can already interact with GIG3's smart contracts 
                  directly on the Solana blockchain.
                </p>
                <div className="bg-muted/50 p-4 rounded-2xl font-mono text-sm mb-4">
                  <div className="text-muted-foreground mb-2">// Solana Program ID</div>
                  <div className="break-all">Coming Soon</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  See our <a href="/smart-contracts" className="text-primary hover:underline">Smart Contracts</a> page 
                  for detailed technical documentation on the escrow program.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.3}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Key className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Authentication</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  API authentication will use wallet-based signatures for secure, decentralized access control.
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">Planned Authentication Method:</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign messages with your Solana wallet to prove ownership and authenticate API requests. 
                      No central API keys or passwords needed.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.4}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Book className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Planned Endpoints</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs font-mono">GET</span>
                      <code className="text-sm">/api/gigs</code>
                    </div>
                    <p className="text-sm text-muted-foreground">List and search available gigs</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs font-mono">GET</span>
                      <code className="text-sm">/api/gigs/:id</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get detailed gig information</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded text-xs font-mono">POST</span>
                      <code className="text-sm">/api/orders</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Create a new order</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs font-mono">GET</span>
                      <code className="text-sm">/api/orders/:id</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get order status and details</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs font-mono">GET</span>
                      <code className="text-sm">/api/users/:address</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get user profile by wallet address</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.5}>
              <div className="bg-card border rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="text-muted-foreground mb-4">
                  Want to be notified when the API launches? Join our community and follow development updates.
                </p>
                <a 
                  href="mailto:api@gig3.io" 
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                  Contact for API Access
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ApiDocs;
