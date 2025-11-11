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
      
      <ScrollReveal animation="fadeUp" delay={0}>
        <Categories />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp" delay={0}>
        <PopularServices />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp" delay={0}>
        <PromoBanner />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp" delay={0}>
        <GuaranteeSection />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp" delay={0}>
        <FeaturedGigs />
      </ScrollReveal>
      
      <ScrollReveal animation="fadeUp" delay={0}>
        <HowItWorks />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
};

export default Index;
