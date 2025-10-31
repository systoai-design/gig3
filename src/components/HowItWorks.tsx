import { Grid3x3, CheckCircle, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: Grid3x3,
    title: "Access a pool of top talent",
    description: "across 700 categories",
  },
  {
    icon: CheckCircle,
    title: "Enjoy a simple, easy-to-use",
    description: "matching experience",
  },
  {
    icon: Zap,
    title: "Get quality work done quickly",
    description: "and within budget",
  },
  {
    icon: MessageCircle,
    title: "Only pay when you're happy",
    description: "",
  },
];

export const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Make it all happen with freelancers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <Icon className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
                </div>
                <p className="text-gray-900 font-medium mb-1">
                  {benefit.title}
                </p>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-gray-900 text-white hover:bg-gray-800 font-semibold px-8"
          >
            Join now
          </Button>
        </div>
      </div>
    </section>
  );
};
