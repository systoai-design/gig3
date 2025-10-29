import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg4djhIMzZ6bTAgMGg4djhIMzZ6bTAgMGg4djhIMzZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-background/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
            <span className="text-xs font-semibold text-primary-foreground">🚀 Powered by Solana</span>
            <span className="text-xs text-primary-foreground/80">Zero Platform Fees</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Freelance Services
            <br />
            <span className="text-accent">On The Blockchain</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Connect with talented freelancers. Pay with crypto. Keep 100% of your earnings with secure escrow on Solana.
          </p>

          {/* Hero Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder='Try "logo design" or "web development"'
                className="w-full pl-12 pr-32 py-4 rounded-full border-2 border-primary-foreground/20 bg-background/95 text-foreground text-base focus:outline-none focus:border-primary-foreground shadow-large"
              />
              <Button
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-secondary hover:opacity-90 transition-opacity rounded-full"
              >
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-primary-foreground/70">Popular:</span>
            {["Logo Design", "WordPress", "AI Services", "Video Editing"].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 rounded-full border border-primary-foreground/20 bg-background/10 text-primary-foreground hover:bg-background/20 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};
