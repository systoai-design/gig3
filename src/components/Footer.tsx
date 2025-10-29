import { Github, Twitter, MessageCircle } from "lucide-react";

export const Footer = () => {
  const footerLinks = {
    platform: [
      { label: "About", href: "#" },
      { label: "How It Works", href: "#" },
      { label: "Trust & Safety", href: "#" },
      { label: "Help & Support", href: "#" },
    ],
    freelancers: [
      { label: "Become a Seller", href: "#" },
      { label: "Seller Guidelines", href: "#" },
      { label: "Community Standards", href: "#" },
      { label: "Success Stories", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "API", href: "#" },
      { label: "Smart Contracts", href: "#" },
      { label: "Blog", href: "#" },
    ],
  };

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 inline-block">
              SolMarket
            </a>
            <p className="text-muted-foreground text-sm mb-4">
              The decentralized freelance marketplace powered by Solana. Zero fees, instant payments, secure escrow.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-full bg-background border border-border hover:border-primary transition-colors"
              >
                <Twitter className="h-4 w-4 text-foreground" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-background border border-border hover:border-primary transition-colors"
              >
                <Github className="h-4 w-4 text-foreground" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-background border border-border hover:border-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">For Freelancers</h4>
            <ul className="space-y-2">
              {footerLinks.freelancers.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 SolMarket. Built on Solana with ❤️
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
