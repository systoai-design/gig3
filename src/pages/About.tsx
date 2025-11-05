import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Shield, Zap, DollarSign, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About GIG3</h1>
              <p className="text-xl text-muted-foreground">
                The Future of Decentralized Freelancing on Solana
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.1}>
            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-lg leading-relaxed mb-6">
                GIG3 is a revolutionary decentralized freelance marketplace built on the Solana blockchain. 
                We're reimagining how creators and clients connect, collaborate, and transact in the Web3 era.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                By leveraging blockchain technology, we eliminate traditional middlemen, reduce fees, 
                and provide unprecedented transparency and security for all participants in the gig economy.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.2}>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="p-6 rounded-3xl bg-card border">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Secure Escrow</h3>
                <p className="text-muted-foreground">
                  Smart contract escrow ensures funds are protected and released only when work is delivered and approved.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card border">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Built on Solana for near-instant transactions and minimal gas fees, making micropayments viable.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card border">
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Low Fees</h3>
                <p className="text-muted-foreground">
                  Only 5% platform fee compared to traditional platforms charging 20% or more. More earnings for creators.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card border">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                <p className="text-muted-foreground">
                  Built by creators, for creators. Our platform evolves based on community feedback and needs.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.3}>
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                To empower creators worldwide by providing a trustless, transparent, and efficient platform 
                where talent meets opportunity without unnecessary intermediaries. We believe in fair compensation, 
                transparent transactions, and giving power back to the creators who make the gig economy thrive.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
