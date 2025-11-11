import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { PopularServices } from "@/components/PopularServices";
import { PromoBanner } from "@/components/PromoBanner";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { FeaturedGigs } from "@/components/FeaturedGigs";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ScrollProgressBar } from "@/components/animations/ScrollProgressBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Navbar />
      <Hero />
      
      <ScrollReveal animation="fadeUp">
        <Categories />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <PopularServices />
      </ScrollReveal>
      
      <ScrollReveal animation="scale" delay={0.2}>
        <PromoBanner />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeLeft">
        <GuaranteeSection />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <FeaturedGigs />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp">
        <HowItWorks />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
};

export default Index;
