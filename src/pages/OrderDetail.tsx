import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Calendar, DollarSign, Package, ExternalLink } from 'lucide-react';

interface Order {
  id: string;
  gig_id: string;
  buyer_id: string;
  seller_id: string;
  amount_sol: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  transaction_signature: string | null;
  created_at: string;
  gigs: {
    title: string;
    images: string[];
    delivery_days: number;
  };
  buyer_profile: {
    username: string;
    avatar_url: string | null;
  };
  seller_profile: {
    username: string;
    avatar_url: string | null;
  };
}

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          gigs (title, images, delivery_days),
          buyer_profile:profiles!orders_buyer_id_fkey (username, avatar_url),
          seller_profile:profiles!orders_seller_id_fkey (username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check if user is part of this order
      if (data.buyer_id !== user?.id && data.seller_id !== user?.id) {
        toast.error('Unauthorized');
        navigate('/');
        return;
      }

      setOrder(data as any);
    } catch (error: any) {
      toast.error('Failed to load order');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      case 'disputed': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (!order) return null;

  const isBuyer = user?.id === order.buyer_id;
  const otherParty = isBuyer ? order.seller_profile : order.buyer_profile;
  const role = isBuyer ? 'Buyer' : 'Seller';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Order Details</h1>
            <p className="text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Gig Information */}
          <Card>
            <CardHeader>
              <CardTitle>Gig Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {order.gigs.images?.[0] && (
                  <img 
                    src={order.gigs.images[0]} 
                    alt={order.gigs.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{order.gigs.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{order.amount_sol} SOL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{order.gigs.delivery_days} days delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Role</p>
                  <p className="font-semibold">{role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {isBuyer ? 'Seller' : 'Buyer'}
                  </p>
                  <p className="font-semibold">{otherParty.username}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {order.transaction_signature && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transaction</p>
                  <a 
                    href={`https://explorer.solana.com/tx/${order.transaction_signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <span className="font-mono text-sm">{order.transaction_signature.slice(0, 8)}...{order.transaction_signature.slice(-8)}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {order.status === 'pending' && (
                  <Button className="flex-1" disabled>
                    Awaiting Payment
                  </Button>
                )}
                {order.status === 'in_progress' && isBuyer && (
                  <Button variant="outline" className="flex-1" disabled>
                    Waiting for Delivery
                  </Button>
                )}
                {order.status === 'in_progress' && !isBuyer && (
                  <Button className="flex-1" disabled>
                    Mark as Delivered (Coming Soon)
                  </Button>
                )}
                {order.status === 'completed' && (
                  <Button variant="outline" disabled>
                    Order Completed
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => navigate(isBuyer ? '/dashboard/buyer' : '/dashboard/seller')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
