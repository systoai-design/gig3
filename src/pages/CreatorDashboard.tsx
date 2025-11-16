import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Package, Eye, Edit, Trash2, CheckCircle2, ShoppingBag, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { ProSubscriptionBanner } from '@/components/ProSubscriptionBanner';
import { ProBadge } from '@/components/ProBadge';
import { ProfileCompletionChecklist } from '@/components/ProfileCompletionChecklist';
import { SellerWelcomeBanner } from '@/components/SellerWelcomeBanner';
import { useProStatus } from '@/hooks/useProStatus';
import { calculateProfileCompletion } from '@/lib/profileUtils';
import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<any[]>([]);
  const [incomingOrders, setIncomingOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalGigs: 0,
    activeGigs: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [completion, setCompletion] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
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
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      setProfile(profileData);

      // Fetch seller profile
      const { data: sellerData } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      setSellerProfile(sellerData);
      
      // Calculate completion
      if (profileData) {
        const completionPercent = calculateProfileCompletion(profileData, sellerData);
        setCompletion(completionPercent);
        
        // Check if onboarding should be shown
        const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
        if (completionPercent < 20 && !hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }

      // Fetch gigs
      const { data: gigsData, error: gigsError } = await supabase
        .from('gigs')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (gigsError) throw gigsError;
      setGigs(gigsData || []);

      // Fetch incoming orders (orders where user is the seller)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          gigs:gig_id (title, images),
          buyer_profile:buyer_id (id, username, name, avatar_url)
        `)
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setIncomingOrders(ordersData || []);

      const pendingCount = ordersData?.filter(o => ['pending', 'in_progress', 'delivered'].includes(o.status)).length || 0;

      setStats({
        totalGigs: gigsData?.length || 0,
        activeGigs: gigsData?.filter(g => g.status === 'active').length || 0,
        totalOrders: ordersData?.length || 0,
        pendingOrders: pendingCount,
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

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
    fetchDashboardData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in_progress': return 'secondary';
      case 'delivered': return 'outline';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'disputed': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-navbar pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-2 border-border">
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-navbar pt-16 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center gap-4 flex-1"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">Creator Dashboard</h1>
              {proStatus?.isPro && (
                <ProBadge size="lg" proSince={proStatus.proSince} />
              )}
            </div>
            <Button onClick={() => navigate('/create-gig')} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create New Gig
            </Button>
          </motion.div>
        </div>

        {/* Welcome Banner for First-Time Sellers */}
        {gigs.length === 0 && (
          <div className="mb-8">
            <SellerWelcomeBanner />
          </div>
        )}

        {/* Profile Completion Checklist */}
        {completion < 100 && profile && (
          <div className="mb-8">
            <ProfileCompletionChecklist
              completion={completion}
              profile={profile}
              sellerProfile={sellerProfile}
            />
          </div>
        )}

        {/* Pro Subscription Banner */}
        <div className="mb-8">
          <ProSubscriptionBanner />
        </div>

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StaggerItem>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Card className="hover-lift border-2 border-border hover:border-primary/40 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalGigs}</div>
                  <p className="text-xs text-muted-foreground">{stats.activeGigs} active</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Card className="hover-lift border-2 border-border hover:border-primary/40 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Gigs</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeGigs}</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Card className="hover-lift border-2 border-border hover:border-primary/40 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Card className="hover-lift border-2 border-border hover:border-primary/40 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs for Gigs, Orders, Messages */}
        <Tabs defaultValue="gigs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gigs">My Gigs ({stats.totalGigs})</TabsTrigger>
            <TabsTrigger value="orders">
              Incoming Orders ({stats.pendingOrders})
              {stats.pendingOrders > 0 && (
                <Badge variant="default" className="ml-2 h-5 px-1.5">
                  {stats.pendingOrders}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" onClick={() => navigate('/messages')}>
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gigs">
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle>Your Gigs</CardTitle>
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
                  <StaggerContainer className="space-y-4">
                    {gigs.map((gig) => (
                      <StaggerItem key={gig.id}>
                        <motion.div 
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border-2 border-border rounded-lg hover:bg-accent/50 hover:border-primary/30 transition-all"
                        >
                          <img 
                            src={gig.images?.[0] || '/placeholder.svg'} 
                            alt={gig.title}
                            className="w-full md:w-24 h-48 md:h-24 object-cover rounded"
                          />
                          <div className="flex-1 w-full">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold">{gig.title}</h3>
                              <Badge variant={gig.status === 'active' ? 'default' : 'secondary'}>
                                {gig.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{gig.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span>{gig.category}</span>
                              <span className="font-semibold text-foreground">{gig.price_sol} SOL</span>
                              <span>{gig.delivery_days} days</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="min-w-[44px] min-h-[44px]"
                              onClick={() => navigate(`/gigs/${gig.id}`)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="min-w-[44px] min-h-[44px]"
                              onClick={() => navigate(`/edit-gig/${gig.id}`)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="min-w-[44px] min-h-[44px]"
                              onClick={() => handleDeleteGig(gig.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle>Incoming Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {incomingOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button onClick={() => navigate('/explore')}>
                      Browse Marketplace
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incomingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 p-4 border-2 border-border rounded-lg hover:bg-accent/50 hover:border-primary/30 transition-all"
                      >
                        <img
                          src={order.gigs?.images?.[0] || '/placeholder.svg'}
                          alt={order.gigs?.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{order.gigs?.title}</h3>
                            <Badge variant={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Customer: {order.buyer_profile?.name || order.buyer_profile?.username}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="font-semibold">{order.amount_sol} SOL</span>
                            <span className="text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                            {order.expected_delivery_date && (
                              <span className="text-muted-foreground">
                                Due: {new Date(order.expected_delivery_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/messages')}
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Onboarding Wizard */}
      <OnboardingWizard
        open={showOnboarding}
        onClose={handleOnboardingComplete}
        userId={user?.id || ''}
        isSeller={true}
      />
    </div>
  );
}
