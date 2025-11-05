import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files stored on your device when you visit websites. They help websites remember 
                  your preferences, authenticate your session, and provide analytics about site usage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
                <p className="text-muted-foreground mb-4">GIG3 uses cookies for:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Authentication:</strong> To keep you logged in and verify your wallet connection</li>
                  <li><strong>Preferences:</strong> To remember your settings like theme (dark/light mode)</li>
                  <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
                  <li><strong>Security:</strong> To detect and prevent fraudulent activity</li>
                  <li><strong>Performance:</strong> To optimize page loading and functionality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
                    <p className="text-muted-foreground">
                      Required for the platform to function. These cannot be disabled as they're necessary for basic operations 
                      like authentication and security.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Functional Cookies</h3>
                    <p className="text-muted-foreground">
                      Enable enhanced functionality like remembering your preferences (theme, language, etc.). 
                      These improve your experience but are not strictly necessary.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Analytics Cookies</h3>
                    <p className="text-muted-foreground">
                      Help us understand how visitors use our platform. We use this data to improve user experience. 
                      These cookies collect aggregated, anonymous data.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Performance Cookies</h3>
                    <p className="text-muted-foreground">
                      Monitor platform performance and identify areas for optimization. Help us ensure fast loading times 
                      and smooth functionality.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  We may use services from trusted third parties that set their own cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Analytics Providers:</strong> To track usage statistics</li>
                  <li><strong>Wallet Providers:</strong> For wallet connection and authentication</li>
                  <li><strong>Content Delivery Networks (CDN):</strong> To deliver content efficiently</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  These third parties have their own privacy policies governing cookie usage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Cookie Duration</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Session Cookies</h3>
                    <p className="text-muted-foreground">
                      Temporary cookies deleted when you close your browser. Used for essential functions during your session.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Persistent Cookies</h3>
                    <p className="text-muted-foreground">
                      Remain on your device for a set period or until you delete them. Used to remember preferences 
                      and provide analytics over time.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Managing Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  You can control cookies through:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</li>
                  <li><strong>Do Not Track:</strong> We respect Do Not Track signals from your browser</li>
                  <li><strong>Opt-Out Links:</strong> Third-party services may provide opt-out mechanisms</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Note: Disabling cookies may affect platform functionality. Essential cookies cannot be disabled 
                  without preventing platform use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Browser-Specific Instructions</h2>
                <p className="text-muted-foreground mb-4">
                  To manage cookies in your browser:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                  <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Web3 and Local Storage</h2>
                <p className="text-muted-foreground">
                  In addition to cookies, we use browser local storage to cache wallet connection information 
                  and improve performance. This data remains local to your device and can be cleared through 
                  browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Cookie Policy as our practices or regulations change. Continued use of 
                  the platform constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about our cookie usage, contact: <strong>privacy@gig3.io</strong>
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

export default CookiePolicy;
