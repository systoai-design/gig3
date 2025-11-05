import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  GIG3 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our decentralized freelance marketplace platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold mb-3">Wallet Information</h3>
                <p className="text-muted-foreground mb-4">
                  We collect your Solana wallet address when you connect to our platform. This is used for authentication and 
                  transaction processing. We do not have access to your private keys.
                </p>
                <h3 className="text-xl font-semibold mb-3">Profile Information</h3>
                <p className="text-muted-foreground mb-4">
                  Information you provide when creating your profile, including username, bio, skills, portfolio, and profile images.
                </p>
                <h3 className="text-xl font-semibold mb-3">Transaction Data</h3>
                <p className="text-muted-foreground mb-4">
                  Details of gigs, orders, payments, and communications through the platform. Blockchain transactions are public 
                  by nature and recorded on the Solana blockchain.
                </p>
                <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
                <p className="text-muted-foreground">
                  Information about how you interact with our platform, including pages visited, features used, and time spent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To provide, maintain, and improve our services</li>
                  <li>To process transactions and manage escrow</li>
                  <li>To communicate with you about orders, updates, and support</li>
                  <li>To detect and prevent fraud or unauthorized activity</li>
                  <li>To comply with legal obligations</li>
                  <li>To analyze platform usage and improve user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Other Users:</strong> Profile information is visible to other platform users</li>
                  <li><strong>Service Providers:</strong> Third-party services that help operate our platform (hosting, analytics, etc.)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We never sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your information. However, no method of transmission 
                  over the internet is 100% secure. Blockchain transactions are cryptographically secured and immutable. 
                  We use wallet-based authentication to ensure you maintain control of your private keys.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and update your profile information at any time</li>
                  <li>Request deletion of your account (subject to ongoing obligations)</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Export your data in a portable format</li>
                  <li>Object to certain data processing activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Blockchain Transparency</h2>
                <p className="text-muted-foreground">
                  By nature of blockchain technology, transactions on Solana are public and permanent. Your wallet address and 
                  transaction history can be viewed on the blockchain. We cannot delete or modify blockchain data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our platform is not intended for users under 18 years of age. We do not knowingly collect information from minors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy periodically. Continued use of the platform after changes constitutes acceptance 
                  of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                <p className="text-muted-foreground">
                  For questions about this Privacy Policy or your data, contact us at: <strong>privacy@gig3.io</strong>
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

export default PrivacyPolicy;
