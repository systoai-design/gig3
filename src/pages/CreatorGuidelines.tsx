import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Target, Lightbulb, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";

const CreatorGuidelines = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Creator Guidelines</h1>
              <p className="text-xl text-muted-foreground">
                Best Practices for Success on GIG3
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-12">
            <ScrollReveal animation="fadeUp" delay={0.1}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Target className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Creating Compelling Gigs</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Clear, Specific Titles</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Use descriptive titles that clearly state what you offer. Include key details buyers search for.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-600">✓ Good:</span> "Professional Logo Design with 3 Concepts & Unlimited Revisions"<br/>
                      <span className="text-red-600">✗ Bad:</span> "I will design logos"
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Detailed Descriptions</h3>
                    <p className="text-sm text-muted-foreground">
                      Explain exactly what's included, your process, delivery timeframe, and what makes your service unique. 
                      Include any requirements you need from buyers.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">High-Quality Images</h3>
                    <p className="text-sm text-muted-foreground">
                      Use professional portfolio images that showcase your best work. First impression matters!
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Strategic Pricing</h3>
                    <p className="text-sm text-muted-foreground">
                      Offer tiered packages (Basic, Standard, Premium) to capture different budget levels. 
                      Price competitively while valuing your expertise.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <MessageSquare className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Professional Communication</h2>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Respond quickly:</span>
                      <span className="text-muted-foreground"> Reply to messages within 24 hours to show reliability</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Set clear expectations:</span>
                      <span className="text-muted-foreground"> Confirm requirements and delivery timeline upfront</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Keep buyers updated:</span>
                      <span className="text-muted-foreground"> Share progress updates, especially for longer projects</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Stay professional:</span>
                      <span className="text-muted-foreground"> Even if issues arise, maintain courtesy and professionalism</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Use platform messaging:</span>
                      <span className="text-muted-foreground"> Keep all communication on GIG3 for record-keeping</span>
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.3}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <TrendingUp className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Delivering Quality Work</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Meet Deadlines</h3>
                    <p className="text-sm text-muted-foreground">
                      Deliver on or before the promised date. If delays occur, communicate proactively and request extensions early.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Exceed Expectations</h3>
                    <p className="text-sm text-muted-foreground">
                      Go the extra mile when possible. Small bonuses or extra polish can lead to great reviews and repeat customers.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Quality Over Quantity</h3>
                    <p className="text-sm text-muted-foreground">
                      Focus on delivering excellent work rather than rushing through orders. Quality builds reputation.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Offer Revisions</h3>
                    <p className="text-sm text-muted-foreground">
                      Include reasonable revisions in your packages. Be clear about what's covered and handle feedback constructively.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.4}>
              <div className="bg-card border rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Lightbulb className="h-10 w-10 text-primary" />
                  <h2 className="text-2xl font-bold">Growing Your Business</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Build Your Portfolio</h3>
                    <p className="text-sm text-muted-foreground">
                      Showcase diverse, high-quality examples. Update regularly with recent work to show current capabilities.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Collect Positive Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      Deliver great experiences to earn 5-star reviews. Politely ask satisfied clients to leave feedback.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Optimize Gig SEO</h3>
                    <p className="text-sm text-muted-foreground">
                      Use relevant keywords in titles and descriptions that buyers might search for. Include specific skills and deliverables.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Consider PRO Membership</h3>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to PRO for enhanced visibility, analytics, and a professional badge that builds trust.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Specialize & Niche Down</h3>
                    <p className="text-sm text-muted-foreground">
                      Becoming an expert in a specific niche can help you command higher prices and attract ideal clients.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.5}>
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border">
                <h2 className="text-2xl font-bold mb-4">Success Mindset</h2>
                <p className="leading-relaxed mb-4">
                  Building a successful freelance business on GIG3 takes time and consistency. Focus on:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Continuous improvement of your skills and offerings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Building long-term relationships with repeat clients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Maintaining professionalism even in challenging situations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Learning from feedback and adapting your approach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Contributing positively to the GIG3 community</span>
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

export default CreatorGuidelines;
