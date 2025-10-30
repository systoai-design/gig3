import { Search, ShoppingCart, Shield, Zap } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Discover",
    description: "Explore thousands of services from talented freelancers across the blockchain",
    color: "from-primary to-primary-light",
  },
  {
    icon: ShoppingCart,
    title: "Place Your Order",
    description: "Choose your gig and pay securely with SOL or USDC via your crypto wallet",
    color: "from-secondary to-accent",
  },
  {
    icon: Shield,
    title: "Secure Escrow",
    description: "Funds are held safely in a Solana smart contract until work is completed",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Get Your Delivery",
    description: "Receive your completed work and release funds instantly on the blockchain",
    color: "from-emerald-500 to-teal-500",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simple, secure, and transparent. Experience the future of freelancing with blockchain technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Connection line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-border to-transparent"></div>
                )}
                
                <div className="relative bg-card border border-border rounded-2xl p-6 text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-medium">
                    {index + 1}
                  </div>
                  
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-4 mt-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a 
              href="/become-seller"
              className="px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity shadow-medium inline-block"
            >
              Start Selling Today
            </a>
            <a
              href="/explore"
              className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary/5 transition-colors inline-block"
            >
              Browse Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
