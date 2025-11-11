import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/BackButton';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Clock, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Gig {
  id: string;
  title: string;
  price_sol: number;
  images: string[];
  delivery_days: number;
  seller_id: string;
  seller?: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
  avg_rating?: number;
  review_count?: number;
}

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorited, loading: favLoading } = useFavorites();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteGigs = async () => {
      if (favLoading) return;

      if (favorites.size === 0) {
        setGigs([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('gigs')
          .select(`
            *,
            seller:profiles!seller_id(id, name, username, avatar_url)
          `)
          .in('id', Array.from(favorites))
          .eq('status', 'active');

        if (error) throw error;

        // Fetch reviews separately for each gig
        const gigsWithReviews = await Promise.all(
          (data || []).map(async (gig) => {
            const { data: reviews } = await supabase
              .from('reviews')
              .select('rating')
              .eq('reviewee_id', gig.seller_id);

            const avgRating = reviews && reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0;

            return {
              ...gig,
              avg_rating: avgRating,
              review_count: reviews?.length || 0,
            };
          })
        );

        setGigs(gigsWithReviews);
      } catch (error) {
        console.error('Error fetching favorite gigs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteGigs();
  }, [favorites, favLoading]);


  if (loading || favLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-navbar pt-8 pb-20">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-navbar pt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <BackButton />
            <h1 className="text-4xl font-bold">My Favorites</h1>
          </div>

          {gigs.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                Browse services and save your favorites by clicking the heart icon
              </p>
              <Button onClick={() => navigate('/explore')}>
                Browse Services
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gigs.map((gig) => {
                const avgRating = gig.avg_rating || 0;
                const reviewCount = gig.review_count || 0;

                return (
                  <Card key={gig.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={gig.images?.[0] || '/placeholder.svg'}
                        alt={gig.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(gig.id);
                        }}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorited(gig.id) ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      {gig.seller && (
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={gig.seller.avatar_url || ''} />
                            <AvatarFallback>
                              {gig.seller.name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {gig.seller.username}
                          </span>
                        </div>
                      )}

                      <h3
                        className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                        onClick={() => navigate(`/gig/${gig.id}`)}
                      >
                        {gig.title}
                      </h3>

                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        {reviewCount > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-foreground">
                              {avgRating.toFixed(1)}
                            </span>
                            <span>({reviewCount})</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{gig.delivery_days} days</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {gig.price_sol.toFixed(2)} SOL
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/gig/${gig.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
