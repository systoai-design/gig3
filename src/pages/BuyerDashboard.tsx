import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Package, Clock, Heart, DollarSign, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { OnboardingWizard } from '@/components/OnboardingWizard';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkOnboarding();
      fetchOrders();
      fetchFavorites();
    }
  }, [user]);

  const checkOnboarding = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);

      // Simple completion check for buyers - if they have name and bio
      const hasBasicInfo = profileData?.name && profileData?.bio;
      const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
      
      if (!hasBasicInfo && !hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
    checkOnboarding();
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          gigs:gig_id (title, images),
          profiles:seller_id (username)
        `)
        .eq('buyer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      
      // Calculate total spent
      const spent = data?.reduce((sum, order) => {
        if (order.status === 'completed') {
          return sum + Number(order.amount_sol);
        }
        return sum;
      }, 0) || 0;
      setTotalSpent(spent);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('favorites')
        .select(`
          *,
          gigs:gig_id (*, profiles:seller_id (username))
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      fetchFavorites();
    } catch (error: any) {
      console.error('Error removing favorite:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in_progress': return 'secondary';
      case 'delivered': return 'outline';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
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

  const activeOrders = orders.filter(o => ['pending', 'in_progress'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-navbar pt-16 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-4xl font-bold">My Orders</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-border hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders.length}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.length}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpent.toFixed(2)} SOL</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Orders, Favorites, and Messages */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="favorites">Saved Gigs ({favorites.length})</TabsTrigger>
            <TabsTrigger value="messages" onClick={() => navigate('/messages')}>
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                    <Button onClick={() => navigate('/explore')}>
                      Browse Services
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center gap-4 p-4 border-2 border-border rounded-lg hover:bg-accent/50 hover:border-primary/30 transition-all">
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
                            Seller: {order.profiles?.username}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="font-semibold">{order.amount_sol} SOL</span>
                            <span className="text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle>Saved Gigs</CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't saved any gigs yet</p>
                    <Button onClick={() => navigate('/explore')}>
                      Browse Services
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((fav) => (
                      <Card key={fav.id} className="border-2 border-border overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all">
                        <div className="relative h-48">
                          <img 
                            src={fav.gigs?.images?.[0] || '/placeholder.svg'} 
                            alt={fav.gigs?.title}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            onClick={() => removeFavorite(fav.id)}
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-semibold line-clamp-2">{fav.gigs?.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {fav.gigs?.profiles?.username}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold">{fav.gigs?.price_sol} SOL</span>
                            <Button 
                              size="sm"
                              onClick={() => navigate(`/gigs/${fav.gig_id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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
        isSeller={false}
      />
    </div>
  );
}
