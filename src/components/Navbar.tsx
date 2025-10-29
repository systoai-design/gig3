import { Button } from "@/components/ui/button";
import { Search, Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <a href="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SolMarket
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Explore
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Become a Seller
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
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
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
              <a href="#" className="text-sm font-medium text-foreground hover:text-primary">
                Explore
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover:text-primary">
                Become a Seller
              </a>
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
                <>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button size="sm" className="bg-gradient-primary" onClick={() => navigate('/auth')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
