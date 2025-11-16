import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatisticsShowcase } from "@/components/StatisticsShowcase";
import { Categories } from "@/components/Categories";
import { PopularServices } from "@/components/PopularServices";
import { ForCreators } from "@/components/ForCreators";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { PromoBanner } from "@/components/PromoBanner";
import { ForClients } from "@/components/ForClients";
import { WhyChooseGig3 } from "@/components/WhyChooseGig3";
import { FeaturedGigs } from "@/components/FeaturedGigs";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ScrollProgressBar } from "@/components/animations/ScrollProgressBar";
import { AuthDialog } from "@/components/AuthDialog";

const Index = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Navbar />
      <Hero onOpenAuthDialog={() => setAuthDialogOpen(true)} />
      
      <ScrollReveal animation="fadeUp">
        <StatisticsShowcase />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <Categories />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <PopularServices />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <ForCreators onOpenAuthDialog={() => setAuthDialogOpen(true)} />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <FeaturedCreators />
      </ScrollReveal>
      
      <ScrollReveal animation="scale" delay={0.2}>
        <PromoBanner />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <ForClients />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <WhyChooseGig3 />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <FeaturedGigs onOpenAuthDialog={() => setAuthDialogOpen(true)} />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeLeft">
        <GuaranteeSection />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <HowItWorks />
      </ScrollReveal>
      
      <Footer />
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
      />
    </div>
  );
};

export default Index;
