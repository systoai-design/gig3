import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { OrderConfirmationDialog } from '@/components/OrderConfirmationDialog';
import { ReviewList } from '@/components/ReviewList';
import { toast } from 'sonner';
import { Star, Clock, Edit, Trash2, User } from 'lucide-react';

export default function GigDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const { data: gigData, error: gigError } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', id)
        .single();

      if (gigError) throw gigError;
      setGig(gigData);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', gigData.seller_id)
        .single();

      if (profileError) throw profileError;
      setSeller(profileData);
    } catch (error: any) {
      toast.error('Failed to load gig');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('gigs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Gig deleted successfully');
      navigate('/dashboard/seller');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete gig');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!gig) return null;

  const isOwner = user?.id === gig.seller_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img 
                  src={gig.images[selectedImage] || '/placeholder.svg'} 
                  alt={gig.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {gig.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {gig.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gig Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge>{gig.category}</Badge>
                <Badge variant="outline">{gig.status}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{gig.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{gig.price_sol} SOL</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{gig.delivery_days} day delivery</span>
                </div>

                {isOwner ? (
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => navigate(`/edit-gig/${gig.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Gig
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Gig
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your gig.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => setShowOrderDialog(true)}>
                    Order Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Seller Card */}
            {seller && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">About the Seller</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={seller.avatar_url} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{seller.username}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>5.0 (0 reviews)</span>
                      </div>
                    </div>
                  </div>
                  {seller.bio && (
                    <p className="text-sm text-muted-foreground">{seller.bio}</p>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/profile/${seller.id}`)}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <ReviewList sellerId={gig.seller_id} />
        </div>
      </main>
      <Footer />
      
      {gig && (
        <OrderConfirmationDialog 
          open={showOrderDialog}
          onOpenChange={setShowOrderDialog}
          gig={gig}
        />
      )}
    </div>
  );
}
