import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code2, Rocket, Sparkles } from "lucide-react";

export const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary to-accent rounded-[35px] overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Need help with Vibe coding?
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Get matched with the right expert to keep building and marketing your project
              </p>
              <Button
                onClick={() => navigate('/explore')}
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 font-semibold rounded-[35px]"
              >
                Find an expert
              </Button>
            </div>
            <div className="relative h-64 md:h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-[35px] backdrop-blur-sm border border-white/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 p-8">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-float" style={{ animationDelay: '0s' }}>
                        <Code2 className="h-8 w-8 text-white" />
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-float" style={{ animationDelay: '0.2s' }}>
                        <Rocket className="h-8 w-8 text-white" />
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-float" style={{ animationDelay: '0.4s' }}>
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};