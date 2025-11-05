import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MessageSquare, Mail, Book, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Support Center</h1>
              <p className="text-xl text-muted-foreground">
                We're Here to Help
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-card border rounded-3xl p-6 text-center">
                <MessageSquare className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Coming Soon</p>
              </div>

              <div className="bg-card border rounded-3xl p-6 text-center">
                <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@gig3.io</p>
              </div>

              <div className="bg-card border rounded-3xl p-6 text-center">
                <Book className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm text-muted-foreground">Comprehensive guides</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.2}>
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-card border rounded-3xl px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    How do I connect my wallet?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Click the "Connect Wallet" button in the top right corner. Select your preferred Solana wallet 
                    (Phantom, Solflare, etc.) and approve the connection. Your wallet address will be used for authentication 
                    and receiving payments.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-card border rounded-3xl px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    What are the platform fees?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    GIG3 charges only 5% platform fee on completed transactions. This is significantly lower than traditional 
                    freelance platforms that charge 20% or more. There are no listing fees or subscription requirements for basic creators.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-card border rounded-3xl px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    How does the escrow system work?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    When a buyer places an order, payment is locked in a smart contract escrow on Solana. The funds are held 
                    securely until the creator delivers the work and the buyer approves it. If there's a dispute, our admin team 
                    reviews and decides the outcome. Orders auto-complete after 7 days if no issues are raised.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-card border rounded-3xl px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    Can I get a refund if I'm not satisfied?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes. If the delivered work doesn't match the agreed requirements, you can request revisions or open a dispute. 
                    Our team will review the case and may issue a full or partial refund depending on the circumstances. Always 
                    communicate your requirements clearly at the start.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-card border rounded-3xl px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    How do I become a creator?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Connect your wallet, go to "Become a Creator" in the menu, and fill out your profile with your skills and 
                    portfolio. Once approved, you can create gigs and start receiving orders. Make sure to follow our creator 
                    guidelines and community standards.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-card border rounded-3xl px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    What is PRO membership?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    PRO membership offers enhanced visibility, priority support, advanced analytics, and a special badge on your 
                    profile. PRO creators get featured more prominently in search results and category pages, leading to more orders.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-card border rounded-3xl px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    How long does it take to receive payment?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Payments are released immediately upon buyer approval via smart contract. The SOL is transferred directly to 
                    your wallet address. There are no holding periods or withdrawal limits - you have instant access to your earnings.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="bg-card border rounded-3xl px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    What happens if there's a dispute?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Either party can open a dispute within the order page. Both parties submit evidence and their perspective. 
                    Our admin team reviews all information and makes a decision within 48-72 hours. The decision is final and 
                    the escrow is released accordingly.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.3}>
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border text-center">
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Reach out to our support team.
              </p>
              <a 
                href="mailto:support@gig3.io" 
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Support;
