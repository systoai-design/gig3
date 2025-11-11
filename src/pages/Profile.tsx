import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { LayoutDashboard, Briefcase, Plus } from 'lucide-react';
import { ProfileBanner } from '@/components/profile/ProfileBanner';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { PortfolioGallery } from '@/components/profile/PortfolioGallery';
import { EducationSection } from '@/components/profile/EducationSection';
import { LanguagesCard } from '@/components/profile/LanguagesCard';
import { SkillsSection } from '@/components/profile/SkillsSection';

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) throw rolesError;
      setRoles(rolesData?.map(r => r.role) || []);

      // Fetch seller profile and gigs if user is a seller
      if (rolesData?.some(r => r.role === 'seller')) {
        const { data: sellerData } = await supabase
          .from('seller_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        setSellerProfile(sellerData);

        const { data: gigsData, error: gigsError } = await supabase
          .from('gigs')
          .select('*')
          .eq('seller_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (gigsError) throw gigsError;
        setGigs(gigsData || []);

        // Fetch total orders for stats
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', userId);

        setTotalOrders(count || 0);
      }
    } catch (error: any) {
      toast.error('Failed to load profile');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-navbar pt-8 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) return null;

  const isSeller = roles.includes('seller');
  const isOwnProfile = user?.id === userId;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Profile Banner & Header */}
      <div className="relative">
        <ProfileBanner
          bannerUrl={profile.banner_url}
          isOwnProfile={isOwnProfile}
          onEditClick={() => navigate('/settings?tab=media')}
        />

        <ProfileHeader
          profile={profile}
          roles={roles}
          isOwnProfile={isOwnProfile}
          onEditClick={() => navigate('/settings')}
          proMember={sellerProfile?.pro_member}
          proSince={sellerProfile?.pro_since}
        />
      </div>

      {/* Quick Actions for Sellers */}
      {isSeller && isOwnProfile && (
        <div className="container mx-auto px-4 pt-6">
          <div className="max-w-6xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/seller')}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Incoming Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/seller?tab=gigs')}
                    className="flex items-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    Manage Gigs
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/create-gig')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Gig
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-navbar pt-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              {profile.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">About</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills Section */}
              {isSeller && sellerProfile?.skills && (
                <SkillsSection skills={sellerProfile.skills} />
              )}

              {/* Portfolio Section */}
              {isSeller && sellerProfile?.portfolio_items && sellerProfile.portfolio_items.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Portfolio</h2>
                    <PortfolioGallery items={sellerProfile.portfolio_items as any[]} />
                  </CardContent>
                </Card>
              )}

              {/* Education & Certifications */}
              {isSeller && (
                <EducationSection
                  education={(sellerProfile?.education as any[]) || []}
                  certifications={(sellerProfile?.certifications as any[]) || []}
                />
              )}

              {/* Active Gigs */}
              {isSeller && gigs.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Active Services</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {gigs.map((gig) => (
                        <Card 
                          key={gig.id}
                          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => navigate(`/gig/${gig.id}`)}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={gig.images?.[0] || '/placeholder.svg'} 
                              alt={gig.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-2 left-2">{gig.category}</Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold line-clamp-2 mb-2">{gig.title}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{gig.delivery_days}d delivery</span>
                              <span className="font-bold">{gig.price_sol} SOL</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Stats Card (Sellers) */}
              {isSeller && (
                <ProfileStats sellerProfile={sellerProfile} totalOrders={totalOrders} />
              )}

              {/* Languages Card */}
              {profile.languages && profile.languages.length > 0 && (
                <LanguagesCard
                  languages={profile.languages}
                  proficiency={sellerProfile?.languages_proficiency as Record<string, string>}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
