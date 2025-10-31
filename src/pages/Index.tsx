import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { PopularServices } from "@/components/PopularServices";
import { PromoBanner } from "@/components/PromoBanner";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { FeaturedGigs } from "@/components/FeaturedGigs";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Categories />
      <PopularServices />
      <PromoBanner />
      <GuaranteeSection />
      <FeaturedGigs />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
