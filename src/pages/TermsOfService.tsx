import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using GIG3, you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Platform Description</h2>
                <p className="text-muted-foreground">
                  GIG3 is a decentralized marketplace connecting freelancers (creators) with clients (buyers) for digital services. 
                  Transactions are facilitated through smart contracts on the Solana blockchain.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. User Requirements</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You must be at least 18 years old to use this platform</li>
                  <li>You must have a valid Solana wallet to transact</li>
                  <li>You are responsible for maintaining the security of your wallet and private keys</li>
                  <li>You must provide accurate and truthful information</li>
                  <li>You must comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Creator Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Deliver services as described in your gig listings</li>
                  <li>Meet agreed-upon deadlines and quality standards</li>
                  <li>Communicate professionally with buyers</li>
                  <li>Only offer services you are legally allowed to provide</li>
                  <li>Respect intellectual property rights</li>
                  <li>Do not offer prohibited services (see Community Standards)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Buyer Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide clear requirements and specifications</li>
                  <li>Respond to creator communications in a timely manner</li>
                  <li>Review delivered work within the specified timeframe</li>
                  <li>Only request legal and ethical services</li>
                  <li>Treat creators with respect and professionalism</li>
                  <li>Honor payment obligations for completed work</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Payment Terms</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All payments are in SOL (Solana cryptocurrency)</li>
                  <li>Platform charges a 5% fee on completed transactions</li>
                  <li>Payments are held in smart contract escrow until work is approved</li>
                  <li>Orders auto-complete after 7 days if no action is taken</li>
                  <li>Refunds are at our discretion based on dispute resolution outcomes</li>
                  <li>You are responsible for any blockchain network fees</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
                <p className="text-muted-foreground mb-4">
                  Unless otherwise agreed in writing:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Creators retain rights to their portfolio work and samples</li>
                  <li>Upon payment, buyers receive the agreed-upon usage rights to delivered work</li>
                  <li>Creators may display completed work in portfolios unless confidentiality is required</li>
                  <li>Users must not infringe on others' intellectual property rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Dispute Resolution</h2>
                <p className="text-muted-foreground">
                  Disputes should first be resolved between parties. If resolution fails, either party may open a formal 
                  dispute. Our admin team will review evidence and make a binding decision. By using this platform, 
                  you agree to accept our dispute resolution decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Platform Modifications</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify, suspend, or discontinue any aspect of the platform at any time. 
                  We may also change fees with 30 days' notice to users.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Account Termination</h2>
                <p className="text-muted-foreground">
                  We may suspend or terminate accounts that violate these terms, our Community Standards, or engage in 
                  fraudulent activity. You may close your account at any time, subject to completing ongoing obligations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  GIG3 acts as a marketplace platform and is not liable for the quality, legality, or delivery of services. 
                  We are not responsible for user conduct, wallet security, or blockchain network issues. Our total liability 
                  is limited to the fees paid for the specific transaction in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Blockchain Risks</h2>
                <p className="text-muted-foreground">
                  You acknowledge that blockchain technology carries inherent risks including but not limited to: 
                  price volatility, network congestion, smart contract vulnerabilities, and irreversible transactions. 
                  You accept these risks by using the platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold GIG3 harmless from any claims, damages, or expenses arising from your 
                  use of the platform, violation of these terms, or infringement of others' rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">14. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms are governed by international law principles applicable to decentralized platforms. 
                  Disputes will be resolved through arbitration.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">15. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may update these Terms of Service. Continued use after changes constitutes acceptance. 
                  Material changes will be communicated via email or platform notification.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">16. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms, contact: <strong>legal@gig3.io</strong>
                </p>
              </section>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
