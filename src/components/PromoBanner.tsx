import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-2xl overflow-hidden">
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
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
              >
                Find an expert
              </Button>
            </div>
            <div className="relative h-64 md:h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full max-w-md bg-gradient-to-br from-blue-400 via-purple-400 to-orange-400 rounded-2xl transform rotate-3 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};