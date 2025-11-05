import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Users, AlertTriangle, Ban, Shield } from "lucide-react";

const CommunityStandards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Community Standards</h1>
              <p className="text-xl text-muted-foreground">
                Building a Respectful and Professional Community
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-12">
            <ScrollReveal animation="fadeUp" delay={0.1}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Users className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Our Values</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  GIG3 is built on trust, respect, and professionalism. We expect all community members to:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Treat others with respect and professionalism</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Deliver high-quality work that meets agreed specifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Communicate clearly and honestly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Honor commitments and deadlines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Resolve conflicts professionally and constructively</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Ban className="h-10 w-10 text-destructive" />
                  <h2 className="text-2xl font-bold">Prohibited Content & Conduct</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  The following are strictly prohibited on GIG3:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Illegal Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Any services that violate laws, including hacking, fraud, identity theft, drug-related activities, 
                      weapons, or any illegal goods/services.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Intellectual Property Violations</h3>
                    <p className="text-sm text-muted-foreground">
                      Offering or delivering plagiarized work, copyrighted material without permission, trademark infringement, 
                      or unauthorized use of others' intellectual property.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Harassment & Abuse</h3>
                    <p className="text-sm text-muted-foreground">
                      Threatening behavior, hate speech, discriminatory language, sexual harassment, doxxing, or any form of bullying.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Spam & Manipulation</h3>
                    <p className="text-sm text-muted-foreground">
                      Fake reviews, rating manipulation, spam messaging, phishing attempts, or any deceptive practices.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Adult Content</h3>
                    <p className="text-sm text-muted-foreground">
                      Sexually explicit material, adult services, or any NSFW content not appropriate for a professional marketplace.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Circumventing the Platform</h3>
                    <p className="text-sm text-muted-foreground">
                      Attempting to move transactions off-platform, sharing contact information prematurely, or avoiding platform fees.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.3}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <AlertTriangle className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Enforcement & Consequences</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Violations of community standards will result in actions including:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-yellow-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Warning</h4>
                      <p className="text-sm text-muted-foreground">First-time minor violations receive a formal warning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-orange-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Content Removal</h4>
                      <p className="text-sm text-muted-foreground">Offending gigs or content are removed from the platform</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-red-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Account Suspension</h4>
                      <p className="text-sm text-muted-foreground">Temporary suspension for repeated or moderate violations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-destructive">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Permanent Ban</h4>
                      <p className="text-sm text-muted-foreground">Severe or repeated violations result in permanent account termination</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.4}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Shield className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Reporting Violations</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  If you encounter content or behavior that violates our community standards:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Use the "Report" button on gigs, profiles, or messages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Provide specific details and evidence when reporting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>Our team reviews all reports within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>False or malicious reports may result in action against the reporter</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.5}>
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border">
                <h2 className="text-2xl font-bold mb-4">Building Together</h2>
                <p className="leading-relaxed">
                  Our community standards evolve based on feedback and emerging challenges. We're committed to maintaining 
                  a safe, professional environment where creators can thrive and clients can find quality services. 
                  Thank you for being part of the GIG3 community and helping us build the future of decentralized work.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityStandards;
