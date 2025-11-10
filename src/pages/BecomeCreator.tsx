import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, Wallet, Shield, Zap, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { FormProgressBar } from '@/components/animations/FormProgressBar';

const SKILL_OPTIONS = [
  'Design & Graphics',
  'Web Development',
  'Smart Contracts',
  'NFT Creation',
  'Content Writing',
  'Social Media',
  'Video Editing',
  'Marketing',
  'Consulting',
  'Other',
];

export default function BecomeCreator() {
  const { user } = useAuth();
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAlreadySeller, setIsAlreadySeller] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const [formData, setFormData] = useState({
    bio: '',
    skills: [] as string[],
    portfolioLinks: [''],
    agreeToTerms: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    checkSellerRole();
  }, [user]);

  const checkSellerRole = async () => {
    if (!user) return;

    try {
      // Check both user_roles and seller_profiles to prevent duplicate submissions
      const [roleData, profileData] = await Promise.all([
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'seller')
          .maybeSingle(),
        supabase
          .from('seller_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (roleData.data || profileData.data) {
        setIsAlreadySeller(true);
        toast.info('You are already a creator!');
      }
    } catch (error) {
      console.error('Error checking creator role:', error);
    } finally {
      setCheckingRole(false);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handlePortfolioLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.portfolioLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, portfolioLinks: newLinks }));
  };

  const addPortfolioLink = () => {
    if (formData.portfolioLinks.length < 5) {
      setFormData(prev => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, ''],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    if (!connected || !publicKey) {
      toast.error('Please connect your wallet to continue');
      return;
    }

    if (formData.bio.length < 50) {
      toast.error('Bio must be at least 50 characters');
      return;
    }

    if (formData.skills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);

      // Filter out empty portfolio links
      const validPortfolioLinks = formData.portfolioLinks.filter(link => link.trim() !== '');

      // Update profile with wallet address
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: formData.bio,
          wallet_address: publicKey.toBase58(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create or update seller profile using upsert to handle edge cases
      const { error: sellerProfileError } = await supabase
        .from('seller_profiles')
        .upsert({
          user_id: user.id,
          skills: formData.skills,
          portfolio_links: validPortfolioLinks,
        }, {
          onConflict: 'user_id'
        });

      if (sellerProfileError) throw sellerProfileError;

      // Grant seller role (use upsert to handle duplicates gracefully)
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'seller',
        }, {
          onConflict: 'user_id,role',
          ignoreDuplicates: true
        });

      if (roleError) throw roleError;

      toast.success('Congratulations! You are now a creator on GIG3!');
      
      // Small delay to ensure database updates are complete
      setTimeout(() => {
        navigate('/dashboard/seller');
      }, 500);
    } catch (error: any) {
      console.error('Become seller error:', error);
      toast.error(error.message || 'Failed to become a seller');
    } finally {
      setLoading(false);
    }
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (isAlreadySeller) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-navbar pt-8 pb-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                You're Already a Creator!
              </CardTitle>
              <CardDescription>
                You already have creator access on GIG3
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Head to your creator dashboard to create gigs and manage your orders.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/dashboard/seller')}>
                  Go to Creator Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/create-gig')}>
                  Create a Gig
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FormProgressBar 
        walletConnected={connected && !!publicKey}
        bioValid={formData.bio.length >= 50}
        skillsValid={formData.skills.length > 0}
        termsAgreed={formData.agreeToTerms}
      />
      
      <main className="pt-navbar pt-8 pb-12">
        {/* Hero Section */}
        <ScrollReveal>
          <section className="pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Join the Builder Economy on <span className="gradient-text">GIG3</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Turn your skills into SOL - earn cryptocurrency by offering your services on Web3
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Benefits */}
        <ScrollReveal>
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Instant Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Get paid in SOL instantly when orders are completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure Escrow</h3>
                <p className="text-sm text-muted-foreground">
                  Funds are held safely until work is delivered
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Low Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Keep more of your earnings with blockchain efficiency
                </p>
              </CardContent>
            </Card>
              </StaggerContainer>

              {/* Application Form */}
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>Creator Application</CardTitle>
                  <CardDescription>
                    Complete your profile to start offering services on GIG3
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Wallet Connection */}
                    <div id="wallet-section" className="space-y-2 scroll-mt-32">
                      <Label className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Solana Wallet
                      </Label>
                  <div className="flex items-center gap-4">
                    <WalletMultiButton />
                    {connected && publicKey && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your wallet will receive payments for completed orders
                  </p>
                    </div>

                    {/* Bio */}
                    <div id="bio-section" className="space-y-2 scroll-mt-32">
                      <Label htmlFor="bio">
                        Bio / About You <span className="text-destructive">*</span>
                      </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell buyers about your experience and what makes you unique... (minimum 50 characters)"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="min-h-[120px]"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.bio.length} / 50 characters minimum
                  </p>
                    </div>

                    {/* Skills */}
                    <div id="skills-section" className="space-y-3 scroll-mt-32">
                      <Label>
                        Skills & Services <span className="text-destructive">*</span>
                      </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SKILL_OPTIONS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <label
                          htmlFor={skill}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                    </div>

                    {/* Portfolio Links */}
                    <div id="portfolio-section" className="space-y-3 scroll-mt-32">
                      <Label>Portfolio Links (Optional)</Label>
                  {formData.portfolioLinks.map((link, index) => (
                    <Input
                      key={index}
                      type="url"
                      placeholder="https://your-portfolio.com"
                      value={link}
                      onChange={(e) => handlePortfolioLinkChange(index, e.target.value)}
                    />
                  ))}
                  {formData.portfolioLinks.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPortfolioLink}
                    >
                      + Add Another Link
                    </Button>
                  )}
                    </div>

                    {/* Terms Agreement */}
                    <div id="terms-section" className="flex items-start space-x-2 scroll-mt-32">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        I agree to the GIG3 creator terms and conditions
                      </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={loading || !connected}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Become a Creator
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        </ScrollReveal>

        <Footer />
      </main>
    </div>
  );
}
