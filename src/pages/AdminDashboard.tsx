import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Package, ShoppingCart, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGigs: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeDisputes: 0,
    pendingApprovals: 0
  });
  const [disputes, setDisputes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    }
  }, [user]);

  const checkAdminRole = async () => {
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single();

      if (!roleData) {
        toast.error('Access denied: Admin privileges required');
        navigate('/');
        return;
      }

      fetchDashboardData();
    } catch (error) {
      console.error('Error checking admin role:', error);
      navigate('/');
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch gigs
      const { data: gigsData, count: gigsCount } = await supabase
        .from('gigs')
        .select('*', { count: 'exact' });

      // Fetch orders
      const { data: ordersData, count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact' });

      // Calculate revenue
      const revenue = ordersData?.reduce((sum: number, order: any) => {
        if (order.platform_fee_sol) {
          return sum + Number(order.platform_fee_sol);
        }
        return sum;
      }, 0) || 0;

      // Fetch disputes
      const { data: disputesData, count: disputesCount } = await supabase
        .from('orders')
        .select('*, gigs(*), profiles!buyer_id(username), seller:profiles!seller_id(username)')
        .eq('status', 'disputed');

      // Fetch pending seller applications
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*, seller_profiles(*)')
        .limit(50);

      setStats({
        totalUsers: usersCount || 0,
        totalGigs: gigsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue: revenue,
        activeDisputes: disputesCount || 0,
        pendingApprovals: gigsData?.filter(g => g.status === 'draft').length || 0
      });

      setDisputes(disputesData || []);
      setUsers(usersData || []);
      setGigs(gigsData || []);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisputeResolution = async (orderId: string, action: 'refund' | 'release') => {
    try {
      const { data, error } = await supabase.functions.invoke('handle-dispute', {
        body: {
          orderId,
          action,
          reason: `Admin resolved: ${action}`,
          refundPercentage: action === 'refund' ? 100 : 0
        }
      });

      if (error) throw error;

      toast.success(`Dispute resolved: ${action}`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to resolve dispute');
    }
  };

  const handleGigStatusUpdate = async (gigId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('gigs')
        .update({ status: status as any })
        .eq('id', gigId);

      if (error) throw error;

      toast.success(`Gig status updated to ${status}`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error('Failed to update gig status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
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
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGigs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} SOL</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDisputes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="disputes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="disputes">Disputes ({disputes.length})</TabsTrigger>
            <TabsTrigger value="gigs">Gigs Management</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle>Active Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                {disputes.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No active disputes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {disputes.map((dispute) => (
                      <div key={dispute.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{dispute.gigs?.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Buyer: {dispute.profiles?.username} | Seller: {dispute.seller?.username}
                            </p>
                            <p className="text-sm mt-2">Amount: {dispute.amount_sol} SOL</p>
                            {dispute.dispute_reason && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Reason: {dispute.dispute_reason}
                              </p>
                            )}
                          </div>
                          <Badge variant="destructive">Disputed</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDisputeResolution(dispute.id, 'refund')}
                          >
                            Refund Buyer
                          </Button>
                          <Button 
                            variant="default"
                            size="sm"
                            onClick={() => handleDisputeResolution(dispute.id, 'release')}
                          >
                            Release to Seller
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/orders/${dispute.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gigs">
            <Card>
              <CardHeader>
                <CardTitle>All Gigs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gigs.map((gig) => (
                    <div key={gig.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={gig.images?.[0] || '/placeholder.svg'} 
                        alt={gig.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{gig.title}</h3>
                        <p className="text-sm text-muted-foreground">{gig.category}</p>
                        <p className="text-sm font-semibold mt-1">{gig.price_sol} SOL</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={gig.status === 'active' ? 'default' : 'secondary'}>
                          {gig.status}
                        </Badge>
                        <Select
                          value={gig.status}
                          onValueChange={(value) => handleGigStatusUpdate(gig.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/gigs/${gig.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.name || user.username}</h3>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                        {user.seller_profiles && (
                          <Badge variant="secondary" className="mt-1">Seller</Badge>
                        )}
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/profile/${user.id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}