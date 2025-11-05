import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Quote, TrendingUp } from "lucide-react";

const SuccessStories = () => {
  const stories = [
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      earnings: "12.5 SOL",
      orders: 47,
      quote: "GIG3 changed my freelance career. The low fees mean I keep more of what I earn, and the escrow system gives me confidence that I'll get paid for my work.",
      achievement: "Built a steady client base and now works full-time as a freelancer"
    },
    {
      name: "Marcus Rodriguez",
      role: "Web Developer",
      earnings: "28.3 SOL",
      orders: 32,
      quote: "The transparency of blockchain transactions and instant payments after approval make GIG3 superior to traditional platforms. No more waiting weeks for payouts!",
      achievement: "Transitioned from corporate job to full-time freelancing on GIG3"
    },
    {
      name: "Aisha Patel",
      role: "Content Writer",
      earnings: "8.7 SOL",
      orders: 89,
      quote: "I love the community here. Buyers are respectful, payments are fast, and the dispute resolution actually works fairly. It's the future of freelancing.",
      achievement: "Earned enough to travel while working remotely"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h1>
              <p className="text-xl text-muted-foreground">
                Real Creators, Real Results on GIG3
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-8 mb-16">
            {stories.map((story, index) => (
              <ScrollReveal key={index} animation="fadeUp" delay={0.1 * (index + 1)}>
                <div className="bg-card border rounded-3xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{story.name}</h3>
                      <p className="text-muted-foreground">{story.role}</p>
                    </div>
                    <Quote className="h-8 w-8 text-primary/30" />
                  </div>

                  <blockquote className="text-lg mb-6 italic">
                    "{story.quote}"
                  </blockquote>

                  <div className="flex flex-wrap gap-6 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">{story.earnings}</div>
                      <div className="text-sm text-muted-foreground">Total Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{story.orders}</div>
                      <div className="text-sm text-muted-foreground">Completed Orders</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-primary/5 p-4 rounded-2xl">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm"><strong>Achievement:</strong> {story.achievement}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fadeUp" delay={0.5}>
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border text-center">
              <h2 className="text-2xl font-bold mb-4">Start Your Success Story</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of creators earning on GIG3. Low fees, instant payments, and a supportive community 
                await you.
              </p>
              <a 
                href="/become-creator" 
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Become a Creator
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.6}>
            <div className="mt-12 p-6 bg-card border rounded-3xl">
              <p className="text-sm text-muted-foreground text-center">
                <em>Note: Earnings and statistics represent sample data for illustrative purposes. 
                Actual results vary based on skills, effort, and market demand.</em>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SuccessStories;
