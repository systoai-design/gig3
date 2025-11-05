import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Calendar, User, ArrowRight } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      title: "Introducing GIG3: The Future of Decentralized Freelancing",
      excerpt: "We're excited to announce the launch of GIG3, a revolutionary freelance marketplace built on Solana blockchain. Learn about our mission to empower creators with fair fees and instant payments.",
      author: "GIG3 Team",
      date: "2024-01-15",
      category: "Announcement"
    },
    {
      title: "Why We Chose Solana for GIG3's Infrastructure",
      excerpt: "Speed, low costs, and scalability. Discover why Solana's blockchain technology is the perfect foundation for a next-generation freelance platform and how it benefits both creators and buyers.",
      author: "Tech Team",
      date: "2024-01-20",
      category: "Technology"
    },
    {
      title: "Understanding Smart Contract Escrow: Your Money, Protected",
      excerpt: "How does blockchain-based escrow work? We break down the technical details in simple terms and explain why it's more secure than traditional payment methods.",
      author: "Security Team",
      date: "2024-01-25",
      category: "Education"
    },
    {
      title: "5 Tips for Success as a GIG3 Creator",
      excerpt: "From crafting the perfect gig description to pricing strategies that work - learn from successful creators who are already thriving on the platform.",
      author: "Community Team",
      date: "2024-02-01",
      category: "Creator Tips"
    },
    {
      title: "The Problem with Traditional Freelance Platforms",
      excerpt: "High fees, delayed payments, and opaque processes. We examine the issues plaguing legacy platforms and how Web3 technology solves them.",
      author: "GIG3 Team",
      date: "2024-02-05",
      category: "Industry"
    },
    {
      title: "Getting Started with Solana Wallets: A Beginner's Guide",
      excerpt: "New to crypto? No problem. This comprehensive guide walks you through setting up your first Solana wallet and making your first transaction on GIG3.",
      author: "Support Team",
      date: "2024-02-10",
      category: "Tutorial"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">GIG3 Blog</h1>
              <p className="text-xl text-muted-foreground">
                News, Updates, and Insights from the GIG3 Team
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {posts.map((post, index) => (
              <ScrollReveal key={index} animation="fadeUp" delay={0.1 * (index % 4)}>
                <article className="bg-card border rounded-3xl p-6 hover:border-primary/50 transition-all group cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fadeUp" delay={0.5}>
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-3xl border text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter to get the latest news, feature updates, and creator success stories 
                delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 rounded-full border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={0.6}>
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                <em>Blog posts represent planned content. Actual articles will be published as the platform grows.</em>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
