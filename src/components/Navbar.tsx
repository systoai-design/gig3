import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, LogOut, LayoutDashboard, Briefcase, ShoppingCart, Heart, Settings, X, Shield, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { OneClickWalletButton } from '@/components/OneClickWalletButton';
import { supabase } from "@/integrations/supabase/client";
import { useWalletMonitor } from "@/hooks/useWalletMonitor";
import { AuthDialog } from "@/components/AuthDialog";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { useSignOut } from "@/hooks/useSignOut";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import gig3LogoLight from "@/assets/gig3_logo_light.png";
import gig3LogoDark from "@/assets/gig3_logo_dark_v2.png";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cartCount } = useCart();
  
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

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data);
    };

    checkAdminRole();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

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
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="relative group text-sm text-foreground font-medium transition-colors"
              >
                Explore
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-[35px] bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.open('https://x.com/Gig3dotfun', '_blank')}
              className="hover:text-primary"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            
            {!isSeller && user && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/become-creator')} className="hover:text-primary">
                Become a Creator
              </Button>
            )}
            
            {user && (
              <>
                <NotificationBell />
                <Button variant="ghost" size="icon" onClick={() => navigate('/favorites')}>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </>
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
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/favorites')}>
                      <Heart className="h-4 w-4 mr-2" />
                      Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/buyer')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    {isSeller && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/seller')}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Creator Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/seller?tab=gigs')}>
                          <Briefcase className="h-4 w-4 mr-2" />
                          My Gigs
                        </DropdownMenuItem>
                      </>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/dashboard/admin')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button onClick={() => setAuthDialogOpen(true)}>
                  Sign In
                </Button>
                <OneClickWalletButton />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 text-primary" />
                  ) : (
                    <Menu className="h-6 w-6 text-primary" />
                  )}
                </motion.div>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col space-y-6 mt-6">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full"
                  />
                </form>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium">Theme</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => window.open('https://x.com/Gig3dotfun', '_blank')}
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <ThemeToggle />
              </div>
            </div>

                <Separator />

                {/* Navigation Links */}
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="ghost" 
                    className="justify-start text-base" 
                    onClick={() => {
                      navigate('/explore');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Search className="h-5 w-5 mr-3" />
                    Explore Services
                  </Button>
                  
                  {!isSeller && user && (
                    <Button 
                      variant="ghost" 
                      className="justify-start text-base"
                      onClick={() => {
                        navigate('/become-creator');
                        setIsMenuOpen(false);
                      }}
                    >
                      <Briefcase className="h-5 w-5 mr-3" />
                      Become a Creator
                    </Button>
                  )}
                </div>

                {user && (
                  <>
                    <Separator />
                    
                    {/* User Actions */}
                    <div className="flex flex-col space-y-3">
                      <Button 
                        variant="ghost" 
                        className="justify-start text-base relative" 
                        onClick={() => {
                          navigate('/favorites');
                          setIsMenuOpen(false);
                        }}
                      >
                        <Heart className="h-5 w-5 mr-3" />
                        Favorites
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="justify-start text-base" 
                        onClick={() => {
                          navigate('/cart');
                          setIsMenuOpen(false);
                        }}
                      >
                        <ShoppingCart className="h-5 w-5 mr-3" />
                        Cart
                        {cartCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {cartCount}
                          </Badge>
                        )}
                      </Button>
                    </div>

                    <Separator />

                    {/* Account Links */}
                    <div className="flex flex-col space-y-3">
                      <Button 
                        variant="ghost" 
                        className="justify-start text-base"
                        onClick={() => {
                          navigate(`/profile/${user.id}`);
                          setIsMenuOpen(false);
                        }}
                      >
                        <User className="h-5 w-5 mr-3" />
                        My Profile
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="justify-start text-base"
                        onClick={() => {
                          navigate('/settings');
                          setIsMenuOpen(false);
                        }}
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        Settings
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="justify-start text-base"
                        onClick={() => {
                          navigate('/dashboard/buyer');
                          setIsMenuOpen(false);
                        }}
                      >
                        <LayoutDashboard className="h-5 w-5 mr-3" />
                        My Orders
                      </Button>
                      
                      {isSeller && (
                        <>
                          <Button 
                            variant="ghost" 
                            className="justify-start text-base"
                            onClick={() => {
                              navigate('/dashboard/seller');
                              setIsMenuOpen(false);
                            }}
                          >
                            <LayoutDashboard className="h-5 w-5 mr-3" />
                            Creator Dashboard
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            className="justify-start text-base"
                            onClick={() => {
                              navigate('/dashboard/seller?tab=gigs');
                              setIsMenuOpen(false);
                            }}
                          >
                            <Briefcase className="h-5 w-5 mr-3" />
                            My Gigs
                          </Button>
                        </>
                      )}
                      
                      {isAdmin && (
                        <Button 
                          variant="ghost" 
                          className="justify-start text-base"
                          onClick={() => {
                            navigate('/dashboard/admin');
                            setIsMenuOpen(false);
                          }}
                        >
                          <Shield className="h-5 w-5 mr-3" />
                          Admin Dashboard
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* Wallet & Sign Out */}
                    <div className="flex flex-col space-y-3">
                      {user?.user_metadata?.wallet_address && (
                        <div className="w-full">
                          <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !w-full !justify-center" />
                        </div>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        className="justify-start text-base text-destructive hover:text-destructive"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </>
                )}

                {!user && (
                  <>
                    <Separator />
                    <div className="flex flex-col space-y-3">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setAuthDialogOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        Sign In
                      </Button>
                      <OneClickWalletButton className="w-full" />
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
      />
    </motion.nav>
  );
};
