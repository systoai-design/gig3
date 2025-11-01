import { Button } from "@/components/ui/button";
import { Search, Menu, User, LogOut, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { supabase } from "@/integrations/supabase/client";
import { useWalletMonitor } from "@/hooks/useWalletMonitor";
import { AuthDialog } from "@/components/AuthDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<'signin' | 'signup' | 'wallet'>('signin');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);
  
  // Monitor wallet changes and auto-signout if needed
  useWalletMonitor();

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
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <a href="/" className="text-3xl font-bold text-primary hover:opacity-80 transition-opacity">
              GIG3
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/explore" className="text-base text-gray-700 dark:text-gray-300 hover:text-primary font-medium transition-colors">
                Explore
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
                className="w-full pl-10 pr-4 py-2 border border-input rounded-full bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {!isSeller && user && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/become-seller')} className="text-gray-700 dark:text-gray-300 hover:text-primary">
                Become a Seller
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
                          Seller Dashboard
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
              <Button 
                size="sm" 
                onClick={() => {
                  setAuthDialogTab('wallet');
                  setAuthDialogOpen(true);
                }}
                className="bg-gradient-primary hover:opacity-90 text-white border-0"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
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
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-full bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <a href="/explore" className="text-sm font-medium text-foreground hover:text-primary">
                Explore
              </a>
              {!isSeller && user && (
                <a href="/become-seller" className="text-sm font-medium text-foreground hover:text-primary">
                  Become a Seller
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
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-primary hover:opacity-90 text-white border-0"
                  onClick={() => {
                    setAuthDialogTab('wallet');
                    setAuthDialogOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        defaultTab={authDialogTab}
      />
    </nav>
  );
};
