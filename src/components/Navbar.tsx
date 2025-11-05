import { Button } from "@/components/ui/button";
import { Search, Menu, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { supabase } from "@/integrations/supabase/client";
import { useWalletMonitor } from "@/hooks/useWalletMonitor";
import { AuthDialog } from "@/components/AuthDialog";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import gig3LogoLight from "@/assets/gig3_logo_light.png";
import gig3LogoDark from "@/assets/gig3_logo_dark_v2.png";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  
  // Monitor wallet changes and auto-signout if needed
  useWalletMonitor();

  // Scroll-based navbar styling
  const { scrollY } = useScroll();
  const navbarBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.95)']
  );
  const navbarBgDark = useTransform(
    scrollY,
    [0, 100],
    ['rgba(5, 5, 5, 0.8)', 'rgba(5, 5, 5, 0.95)']
  );

  useEffect(() => {
    const checkSellerRole = async () => {
      if (!user) {
        setIsSeller(false);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'seller')
        .maybeSingle();

      setIsSeller(!!data);
    };

    checkSellerRole();
  }, [user]);

  return (
    <motion.nav 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl backdrop-blur-xl rounded-full shadow-lg border border-border/50 dark:shadow-primary/10"
    >
      <div className="container mx-auto px-6 relative bg-background/80 dark:bg-card/80 rounded-full transition-colors duration-300">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <motion.a 
              href="/" 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <picture>
                <img 
                  src={gig3LogoLight}
                  alt="GIG3 logo light"
                  className="h-8 w-auto transition-opacity duration-300 dark:hidden" 
                />
                <img 
                  src={gig3LogoDark}
                  alt="GIG3 logo dark"
                  className="h-8 w-auto transition-opacity duration-300 hidden dark:block" 
                />
              </picture>
            </motion.a>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/explore" className="relative group text-sm text-foreground font-medium transition-colors">
                Explore
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for services..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-[35px] bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {!isSeller && user && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/become-creator')} className="hover:text-primary">
                Become a Creator
              </Button>
            )}
            
            {user ? (
              <div className="flex items-center gap-2">
                {user?.user_metadata?.wallet_address && (
                  <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90" />
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/buyer')}>
                      My Orders
                    </DropdownMenuItem>
                    {isSeller && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/seller')}>
                          Creator Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/create-gig')}>
                          Create Gig
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <WalletMultiButton className="!bg-gradient-primary hover:!opacity-90 !text-white !border-0" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-primary/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-[35px] bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <a href="/explore" className="text-sm font-medium text-foreground hover:text-primary">
                Explore
              </a>
              {!isSeller && user && (
                <a href="/become-creator" className="text-sm font-medium text-foreground hover:text-primary">
                  Become a Creator
                </a>
              )}
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start text-destructive" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="w-full">
                  <WalletMultiButton className="!bg-gradient-primary hover:!opacity-90 !text-white !border-0 !w-full" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
      />
    </motion.nav>
  );
};
