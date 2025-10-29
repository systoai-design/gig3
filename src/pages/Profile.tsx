import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Star, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Fetch gigs if user is a seller
      if (rolesData?.some(r => r.role === 'seller')) {
        const { data: gigsData, error: gigsError } = await supabase
          .from('gigs')
          .select('*')
          .eq('seller_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (gigsError) throw gigsError;
        setGigs(gigsData || []);
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
        <main className="container mx-auto px-4 py-12">
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-4xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {roles.map(role => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>5.0 (0 reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {profile.wallet_address && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Wallet: </span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {profile.wallet_address.slice(0, 8)}...{profile.wallet_address.slice(-8)}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Gigs */}
          {isSeller && (
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Active Services</h2>
                {gigs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No active services at the moment
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {gigs.map((gig) => (
                      <Card 
                        key={gig.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/gigs/${gig.id}`)}
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
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
