import { Github, Twitter, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassmorphicCard } from "@/components/animations/GlassmorphicCard";
import { motion } from "framer-motion";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { useTheme } from "next-themes";
import gig3LogoLight from "@/assets/gig3_logo_light.png";
import gig3LogoDark from "@/assets/gig3_logo_6.png";

export const Footer = () => {
  const { resolvedTheme } = useTheme();
  
  const footerLinks = {
    platform: [
      { label: "About", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Trust & Safety", href: "/trust-safety" },
      { label: "Help & Support", href: "/support" },
    ],
    creators: [
      { label: "Become a Creator", href: "/become-creator" },
      { label: "Creator Guidelines", href: "/creator-guidelines" },
      { label: "Community Standards", href: "/community-standards" },
      { label: "Success Stories", href: "/success-stories" },
    ],
    resources: [
      { label: "Documentation", href: "/documentation" },
      { label: "API", href: "/api-docs" },
      { label: "Smart Contracts", href: "/smart-contracts" },
      { label: "Blog", href: "/blog" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-b from-muted/30 to-background border-t overflow-hidden">
      <NoiseTexture opacity={0.03} />
      
      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <picture>
                <img 
                  src={gig3LogoLight}
                  alt="GIG3 logo light"
                  className="h-12 w-auto transition-opacity duration-300 dark:hidden" 
                />
                <img 
                  src={gig3LogoDark}
                  alt="GIG3 logo dark"
                  className="h-12 w-auto transition-opacity duration-300 hidden dark:block" 
                />
              </picture>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              The decentralized freelance marketplace. Secure payments, transparent escrow, powered by Solana.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "https://x.com/Gig3dotfun", label: "Twitter" },
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: MessageCircle, href: "#", label: "Discord" }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries({ Platform: footerLinks.platform, Creators: footerLinks.creators, Resources: footerLinks.resources }).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-foreground mb-4 text-base">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block relative group">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 GIG3. Built on Solana. Powered by x402 Protocol</p>
            <div className="flex flex-wrap justify-center gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((text) => (
                <Link key={text} to={`/${text.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
