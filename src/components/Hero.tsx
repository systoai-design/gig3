import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Hero = () => {
  const navigate = useNavigate();
  const [showSpline, setShowSpline] = useState(false);

  useEffect(() => {
    // Delay loading Spline to improve initial page load
    const timer = setTimeout(() => setShowSpline(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const popularServices = [
    { label: "Website Development", icon: "→" },
    { label: "Logo Design", icon: "→" },
    { label: "Video Editing", icon: "→" },
    { label: "AI Services", icon: "→" },
    { label: "Smart Contracts", badge: "NEW", icon: "→" },
  ];

  const trustedBrands = [
    "Meta",
    "Google", 
    "Netflix",
    "PayPal",
    "Solana",
    "Coinbase"
  ];

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Spline 3D Background Animation - Lazy Loaded */}
      {showSpline && (
        <div className="absolute inset-0 w-full h-full">
          <iframe 
            src="https://my.spline.design/animatedpaperboat-U6wecpseljShuR13EAC0IwfN/" 
            frameBorder="0" 
            width="100%" 
            height="100%"
            className="w-full h-full"
            title="3D Background Animation"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-4xl">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Our freelancers
            <br />
            will take it from here
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative flex items-center bg-white rounded-lg shadow-2xl overflow-hidden">
                <input
                  type="text"
                  placeholder="Search for any service..."
                  className="flex-1 px-6 py-5 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate('/explore');
                    }
                  }}
                />
                <Button
                  size="lg"
                  onClick={() => navigate('/explore')}
                  className="m-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 rounded-md"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div className="flex flex-wrap gap-2 mb-12">
            {popularServices.map((service) => (
              <button
                key={service.label}
                onClick={() => navigate('/explore')}
                className="group relative px-4 py-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 hover:border-white/50 transition-all duration-200 flex items-center gap-2"
              >
                <span>{service.label}</span>
                {service.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-yellow-400 text-gray-900 rounded-full">
                    {service.badge}
                  </span>
                )}
                <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Trusted By Section */}
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <span className="text-sm font-medium text-white/70">Trusted by:</span>
            <div className="flex flex-wrap items-center gap-8">
              {trustedBrands.map((brand) => (
                <div
                  key={brand}
                  className="text-lg font-semibold text-white/80 hover:text-white transition-colors cursor-default"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};
