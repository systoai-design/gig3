import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageList } from '@/components/MessageList';
import { ReviewDialog } from '@/components/ReviewDialog';
import { OrderTimeline } from '@/components/OrderTimeline';
import { ProofUpload } from '@/components/ProofUpload';
import { ProofReview } from '@/components/ProofReview';
import { OrderStatusIndicator } from '@/components/OrderStatusIndicator';
import { toast } from 'sonner';
import { ArrowLeft, ExternalLink, MessageSquare, Clock as ClockIcon, AlertTriangle, FileText } from 'lucide-react';

interface Order {
  id: string;
  gig_id: string;
  buyer_id: string;
  seller_id: string;
  amount_sol: number;
  status: 'pending' | 'in_progress' | 'proof_submitted' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
  transaction_signature: string | null;
  created_at: string;
  payment_confirmed_at?: string | null;
  delivered_at?: string | null;
  completed_at?: string | null;
  disputed_at?: string | null;
  proof_description?: string | null;
  proof_files?: string[];
  revision_requested?: boolean;
  revision_notes?: string | null;
  expected_delivery_date?: string | null;
  gig: {
    id: string;
    title: string;
    description: string;
    category: string;
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
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchOrder();
    checkExistingReview();
  }, [id]);

  const checkExistingReview = async () => {
    if (!user || !id) return;
    
    try {
      const { data } = await supabase
        .from('reviews')
        .select('id')
        .eq('order_id', id)
        .eq('reviewer_id', user.id)
        .single();
      
      setHasReview(!!data);
    } catch (error) {
      // No review found
    }
  };

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          gig:gigs!orders_gig_id_fkey (
            id,
            title,
            description,
            category,
            images,
            delivery_days
          ),
          buyer_profile:profiles!orders_buyer_id_fkey (username, avatar_url),
          seller_profile:profiles!orders_seller_id_fkey (username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      // Check authorization
      if (orderData.buyer_id !== user?.id && orderData.seller_id !== user?.id) {
        toast.error('You are not authorized to view this order');
        navigate('/');
        return;
      }

      setOrder(orderData as any);
    } catch (error: any) {
      toast.error('Failed to load order details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDelivery = async () => {
    setApproving(true);
    try {
      console.log('Approving delivery for order:', id);
      
      const { data, error } = await supabase.functions.invoke('approve-delivery', {
        body: { orderId: id }
      });

      console.log('Approval response:', { data, error });

      // Check both error sources
      if (error) {
        // Network or function error
        throw new Error(
          error.message || 'Failed to connect to payment service. Please try again.'
        );
      }
      
      if (data?.error) {
        // Business logic error from the function
        const errorMsg = data.error;
        if (errorMsg.includes('authorization') || errorMsg.includes('Unauthorized')) {
          throw new Error('Authentication failed. Please refresh the page and try again.');
        } else if (errorMsg.includes('buyer')) {
          throw new Error('Only the buyer can approve this delivery.');
        } else if (errorMsg.includes('proof')) {
          throw new Error('The seller must submit proof of work before approval.');
        } else if (errorMsg.includes('escrow')) {
          throw new Error('Failed to release escrow payment. Please contact support.');
        } else {
          throw new Error(errorMsg);
        }
      }

      toast.success('✓ Payment released! The seller will receive the funds shortly.');
      await fetchOrder(); // await to ensure UI updates
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || 'Failed to approve delivery. Please try again or contact support.');
    } finally {
      setApproving(false);
    }
  };

  const handleRequestRevision = async (notes: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          revision_requested: true,
          revision_notes: notes,
          status: 'in_progress'
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Revision requested');
      fetchOrder();
    } catch (error: any) {
      toast.error(error.message || 'Failed to request revision');
    }
  };

  const handleDispute = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'disputed' })
        .eq('id', id);

      if (error) throw error;

      toast.success('Dispute filed. Admin will review.');
      fetchOrder();
    } catch (error: any) {
      toast.error(error.message || 'Failed to file dispute');
    }
  };

  const handleCancelDispute = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'proof_submitted',
          disputed_at: null
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Dispute cancelled. Order returned to review.');
      fetchOrder();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel dispute');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in_progress': return 'secondary';
      case 'proof_submitted': return 'outline';
      case 'delivered': return 'outline';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'disputed': return 'destructive';
      default: return 'default';
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-navbar pt-8 pb-12">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  const isBuyer = user?.id === order.buyer_id;
  const isSeller = user?.id === order.seller_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-navbar pt-8 pb-12">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(isBuyer ? '/dashboard/buyer' : '/dashboard/seller')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Order Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Gig Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img 
                    src={order.gig.images?.[0] || '/placeholder.svg'} 
                    alt={order.gig.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{order.gig.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {order.gig.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{order.gig.category}</Badge>
                      <span className="text-sm font-semibold">{order.amount_sol} SOL</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Role</p>
                    <p className="font-medium">{isBuyer ? 'Buyer' : 'Seller'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {order.transaction_signature && (
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction</p>
                      <a
                        href={`https://explorer.solana.com/tx/${order.transaction_signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View on Explorer
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Progress Indicator */}
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatusIndicator
                  currentStatus={order.status}
                  paymentConfirmedAt={order.payment_confirmed_at}
                  deliveredAt={order.delivered_at}
                  completedAt={order.completed_at}
                />
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline
                  currentStatus={order.status}
                  createdAt={order.created_at}
                  paymentConfirmedAt={order.payment_confirmed_at}
                  deliveredAt={order.delivered_at}
                  completedAt={order.completed_at}
                  disputedAt={order.disputed_at}
                />
              </CardContent>
            </Card>

            {/* Proof Upload/Review Section */}
            {isSeller && order.status === 'in_progress' && !order.revision_requested && (
              <ProofUpload orderId={order.id} onSuccess={fetchOrder} />
            )}

            {order.revision_requested && isSeller && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Revision Requested</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {order.revision_notes}
                  </p>
                  <ProofUpload orderId={order.id} onSuccess={fetchOrder} />
                </CardContent>
              </Card>
            )}

            {isBuyer && (order.status === 'proof_submitted' || order.status === 'delivered') && (order.proof_description || order.proof_files?.length > 0) && (
              <>
                {/* Auto-release warning */}
                {order.delivered_at && (
                  <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <ClockIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm mb-1">Auto-Release Notice</p>
                          <p className="text-sm text-muted-foreground">
                            If no action is taken, escrow will automatically be released to the seller{' '}
                            {(() => {
                              const deliveredDate = new Date(order.delivered_at);
                              const autoReleaseDate = new Date(deliveredDate);
                              autoReleaseDate.setDate(autoReleaseDate.getDate() + 7);
                              const daysRemaining = Math.ceil((autoReleaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                              return daysRemaining > 0 
                                ? `in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} (${autoReleaseDate.toLocaleDateString()})`
                                : 'soon';
                            })()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <ProofReview
                  proofDescription={order.proof_description || ''}
                  proofFiles={order.proof_files || []}
                  onApprove={handleApproveDelivery}
                  onRequestRevision={handleRequestRevision}
                  onDispute={handleDispute}
                  isLoading={approving}
                />
              </>
            )}

            {/* Disputed Order Actions */}
            {isBuyer && order.status === 'disputed' && (order.proof_description || order.proof_files?.length > 0) && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Order Disputed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This order is currently under dispute. An admin will review the case. 
                    If you'd like to cancel the dispute and review the proof again, click below.
                  </p>
                  
                  {/* Show proof for reference */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Submitted Proof</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {order.proof_description}
                    </p>
                    {order.proof_files && order.proof_files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {order.proof_files.map((url, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              View File {index + 1}
                            </a>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleCancelDispute}
                    className="w-full"
                  >
                    Cancel Dispute & Return to Review
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Messaging Section */}
            <Card>
              <Tabs defaultValue="messages" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="messages" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="messages" className="h-[500px]">
                  <MessageList 
                    orderId={order.id}
                    otherUserId={isBuyer ? order.seller_id : order.buyer_id}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Expected Delivery Date */}
                {order.expected_delivery_date && order.status === 'in_progress' && (
                  <div className="pb-4 mb-4 border-b">
                    <p className="text-sm text-muted-foreground">Expected Delivery</p>
                    <p className="font-medium">
                      {new Date(order.expected_delivery_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Review Button for Completed Orders */}
                {isBuyer && order.status === 'completed' && !hasReview && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowReviewDialog(true)}
                  >
                    Leave a Review
                  </Button>
                )}

                {/* View Gig */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/gigs/${order.gig.id}`)}
                >
                  View Gig
                </Button>

                {/* Contact Info */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">
                    {isBuyer ? 'Seller' : 'Buyer'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isBuyer ? order.seller_profile.username : order.buyer_profile.username}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {order && (
        <ReviewDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          orderId={order.id}
          sellerId={order.seller_id}
          onReviewSubmitted={() => {
            setHasReview(true);
            checkExistingReview();
          }}
        />
      )}
    </div>
  );
}
