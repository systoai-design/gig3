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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Users, Package, ShoppingCart, AlertTriangle, DollarSign, TrendingUp, FileText } from 'lucide-react';

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
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [refundPercentage, setRefundPercentage] = useState(100);
  const [showResolutionDialog, setShowResolutionDialog] = useState(false);

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

  const handleDisputeResolution = async (orderId: string, action: 'refund' | 'release', notes: string, refundPercent: number) => {
    try {
      // First, update admin_notes in the order
      const { error: updateError } = await supabase
        .from('orders')
        .update({ admin_notes: notes })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Then invoke the dispute resolution function
      const { data, error } = await supabase.functions.invoke('handle-dispute', {
        body: {
          orderId,
          action,
          reason: notes || `Admin resolved: ${action}`,
          refundPercentage: refundPercent
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Dispute resolved: ${action === 'refund' ? `${refundPercent}% refund issued` : 'funds released to seller'}`);
      setShowResolutionDialog(false);
      setSelectedDispute(null);
      setResolutionNotes('');
      setRefundPercentage(100);
      fetchDashboardData();
    } catch (error: any) {
      console.error('Dispute resolution error:', error);
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
      <main className="container mx-auto px-4 pt-12 pb-24">
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
            <TabsTrigger value="escrow">Escrow Management</TabsTrigger>
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
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{dispute.gigs?.title}</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Buyer:</span>{' '}
                                <span className="font-medium">{dispute.profiles?.username}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Seller:</span>{' '}
                                <span className="font-medium">{dispute.seller?.username}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Amount:</span>{' '}
                                <span className="font-medium">{dispute.amount_sol} SOL</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Platform Fee:</span>{' '}
                                <span className="font-medium">{dispute.platform_fee_sol || 0} SOL</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Disputed:</span>{' '}
                                <span className="font-medium">
                                  {new Date(dispute.disputed_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            {/* Show proof if available */}
                            {dispute.proof_description && (
                              <div className="mt-3 p-3 bg-muted/50 rounded border">
                                <Label className="text-xs font-semibold">Seller's Proof:</Label>
                                <p className="text-sm mt-1 whitespace-pre-wrap">{dispute.proof_description}</p>
                                {dispute.proof_files && dispute.proof_files.length > 0 && (
                                  <div className="flex gap-2 mt-2">
                                    {dispute.proof_files.map((url: string, idx: number) => (
                                      <Button
                                        key={idx}
                                        variant="outline"
                                        size="sm"
                                        asChild
                                      >
                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                          <FileText className="h-4 w-4 mr-2" />
                                          View File {idx + 1}
                                        </a>
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Show admin notes if any */}
                            {dispute.admin_notes && (
                              <div className="mt-3 p-3 bg-green-500/10 rounded border border-green-500/20">
                                <Label className="text-xs font-semibold text-green-600 dark:text-green-400">Previous Admin Notes:</Label>
                                <p className="text-sm mt-1">{dispute.admin_notes}</p>
                              </div>
                            )}
                          </div>
                          <Badge variant="destructive">Disputed</Badge>
                        </div>
                        
                        <div className="flex gap-2 pt-2 border-t">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setShowResolutionDialog(true);
                            }}
                          >
                            Resolve Dispute
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/orders/${dispute.id}`)}
                          >
                            View Full Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escrow">
            <Card>
              <CardHeader>
                <CardTitle>Pending Escrow Releases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Orders with proof_submitted status will appear here for admin review.
                  Admins can manually release escrow or request changes.
                </p>
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

        {/* Dispute Resolution Dialog */}
        <Dialog open={showResolutionDialog} onOpenChange={setShowResolutionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Resolve Dispute</DialogTitle>
              <DialogDescription>
                Review the order details and choose how to resolve this dispute.
              </DialogDescription>
            </DialogHeader>
            
            {selectedDispute && (
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="p-4 bg-muted/50 rounded space-y-2">
                  <h4 className="font-semibold">{selectedDispute.gigs?.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Buyer: {selectedDispute.profiles?.username}</div>
                    <div>Seller: {selectedDispute.seller?.username}</div>
                    <div>Amount: {selectedDispute.amount_sol} SOL</div>
                    <div>Fee: {selectedDispute.platform_fee_sol || 0} SOL</div>
                  </div>
                </div>

                {/* Resolution Notes */}
                <div className="space-y-2">
                  <Label htmlFor="resolution-notes">Resolution Notes *</Label>
                  <Textarea
                    id="resolution-notes"
                    placeholder="Explain why you're resolving this way (visible to buyer and seller)..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    These notes will be saved to the order and visible to both parties.
                  </p>
                </div>

                {/* Refund Percentage Slider */}
                <div className="space-y-2">
                  <Label>Refund Percentage: {refundPercentage}%</Label>
                  <Slider
                    value={[refundPercentage]}
                    onValueChange={(value) => setRefundPercentage(value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Release to Seller (0%)</span>
                    <span>Partial Refund (50%)</span>
                    <span>Full Refund (100%)</span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    <div>Buyer receives: <strong>{((selectedDispute.amount_sol * refundPercentage) / 100).toFixed(4)} SOL</strong></div>
                    <div>Seller receives: <strong>{((selectedDispute.amount_sol * (100 - refundPercentage)) / 100).toFixed(4)} SOL</strong></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResolutionDialog(false);
                      setSelectedDispute(null);
                      setResolutionNotes('');
                      setRefundPercentage(100);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDisputeResolution(
                      selectedDispute.id,
                      'refund',
                      resolutionNotes,
                      refundPercentage
                    )}
                    disabled={!resolutionNotes.trim()}
                  >
                    Process {refundPercentage === 100 ? 'Full' : 'Partial'} Refund
                  </Button>
                  <Button
                    onClick={() => handleDisputeResolution(
                      selectedDispute.id,
                      'release',
                      resolutionNotes,
                      0
                    )}
                    disabled={!resolutionNotes.trim()}
                  >
                    Release to Seller
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}