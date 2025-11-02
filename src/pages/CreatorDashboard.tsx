import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Package, DollarSign, Star, Edit, Eye, Trash2 } from 'lucide-react';
import { ProSubscriptionBanner } from '@/components/ProSubscriptionBanner';
import { ProBadge } from '@/components/ProBadge';
import { useProStatus } from '@/hooks/useProStatus';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalGigs: 0, activeGigs: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const { data: proStatus } = useProStatus(user?.id);

  useEffect(() => {
    if (user) {
      checkSellerRole();
    }
  }, [user]);

  const checkSellerRole = async () => {
    try {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'seller')
        .maybeSingle();

      if (error) {
        console.error('Error checking seller role:', error);
        toast.error('Failed to verify seller status');
        navigate('/');
        return;
      }

      if (!roleData) {
        toast.error('You need to be a creator to access this page');
        navigate('/become-creator');
        return;
      }

      fetchDashboardData();
    } catch (error) {
      console.error('Error checking creator role:', error);
      toast.error('Failed to load creator dashboard');
      navigate('/');
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch gigs
      const { data: gigsData, error: gigsError } = await supabase
        .from('gigs')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (gigsError) throw gigsError;
      setGigs(gigsData || []);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', user?.id);

      if (ordersError) throw ordersError;

      setStats({
        totalGigs: gigsData?.length || 0,
        activeGigs: gigsData?.filter(g => g.status === 'active').length || 0,
        totalOrders: ordersData?.length || 0,
      });
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGig = async (gigId: string) => {
    if (!confirm('Are you sure you want to delete this gig?')) return;

    try {
      const { error } = await supabase
        .from('gigs')
        .delete()
        .eq('id', gigId);

      if (error) throw error;

      toast.success('Gig deleted successfully');
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete gig');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold">Creator Dashboard</h1>
            {proStatus?.isPro && (
              <ProBadge size="lg" proSince={proStatus.proSince} />
            )}
          </div>
          <Button onClick={() => navigate('/create-gig')}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Gig
          </Button>
        </div>

        {/* Pro Subscription Banner */}
        <div className="mb-8">
          <ProSubscriptionBanner />
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGigs}</div>
              <p className="text-xs text-muted-foreground">{stats.activeGigs} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.0</div>
              <p className="text-xs text-muted-foreground">0 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Gigs List */}
        <Card>
          <CardHeader>
            <CardTitle>My Gigs</CardTitle>
          </CardHeader>
          <CardContent>
            {gigs.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't created any gigs yet</p>
                <Button onClick={() => navigate('/create-gig')}>
                  Create Your First Gig
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {gigs.map((gig) => (
                  <div key={gig.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <img 
                      src={gig.images?.[0] || '/placeholder.svg'} 
                      alt={gig.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{gig.title}</h3>
                        <Badge variant={gig.status === 'active' ? 'default' : 'secondary'}>
                          {gig.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{gig.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{gig.category}</span>
                        <span className="font-semibold text-foreground">{gig.price_sol} SOL</span>
                        <span>{gig.delivery_days} days</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/gigs/${gig.id}`)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/edit-gig/${gig.id}`)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteGig(gig.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
