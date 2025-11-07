import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Search, Star, Clock, ShoppingCart, CheckCircle2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProBadge } from '@/components/ProBadge';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Smart Contract Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Video Editing',
  'Marketing',
  'Other'
];

const DELIVERY_OPTIONS = [1, 3, 7, 14, 30];

export default function Explore() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [proOnly, setProOnly] = useState(searchParams.get('pro') === 'true');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [selectedDeliveryDays, setSelectedDeliveryDays] = useState<number[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();

  // Update search query when URL params change
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchGigs();
  }, [searchQuery, selectedCategories, sortBy, proOnly, priceRange, selectedDeliveryDays, minRating]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('gigs')
        .select(`
          *,
          profiles:seller_id (username, avatar_url),
          seller_profiles!inner (pro_member, pro_since)
        `)
        .eq('status', 'active');

      // Pro filter
      if (proOnly) {
        query = query.eq('seller_profiles.pro_member', true);
      }

      // Search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Category filter
      if (selectedCategories.length > 0) {
        query = query.in('category', selectedCategories);
      }

      // Price range filter
      query = query.gte('price_sol', priceRange[0]).lte('price_sol', priceRange[1]);

      // Delivery days filter
      if (selectedDeliveryDays.length > 0) {
        query = query.in('delivery_days', selectedDeliveryDays);
      }

      // Sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-low':
          query = query.order('price_sol', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price_sol', { ascending: false });
          break;
        case 'delivery':
          query = query.order('delivery_days', { ascending: true });
          break;
        case 'popular':
          query = query.order('order_count', { ascending: false });
          break;
        case 'best-selling':
          query = query.order('view_count', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch reviews for rating filter
      if (minRating > 0 && data) {
        const gigsWithReviews = await Promise.all(
          data.map(async (gig) => {
            const { data: reviews } = await supabase
              .from('reviews')
              .select('rating')
              .eq('reviewee_id', gig.seller_id);

            const avgRating = reviews && reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0;

            return { ...gig, avg_rating: avgRating, review_count: reviews?.length || 0 };
          })
        );

        const filtered = gigsWithReviews.filter((gig) => gig.avg_rating >= minRating);
        setGigs(filtered);
      } else if (data) {
        // Fetch review counts without filtering
        const gigsWithReviews = await Promise.all(
          data.map(async (gig) => {
            const { data: reviews } = await supabase
              .from('reviews')
              .select('rating')
              .eq('reviewee_id', gig.seller_id);

            const avgRating = reviews && reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0;

            return { ...gig, avg_rating: avgRating, review_count: reviews?.length || 0 };
          })
        );
        setGigs(gigsWithReviews);
      } else {
        setGigs([]);
      }
    } catch (error: any) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURLParams();
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleDeliveryDay = (days: number) => {
    setSelectedDeliveryDays(prev =>
      prev.includes(days)
        ? prev.filter(d => d !== days)
        : [...prev, days]
    );
  };

  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (proOnly) params.set('pro', 'true');
    setSearchParams(params);
  };

  useEffect(() => {
    updateURLParams();
  }, [selectedCategories, sortBy, proOnly]);

  const handleAddToCart = (gigId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(gigId);
  };

  const handleToggleFavorite = (gigId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(gigId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-navbar pb-12">
        <h1 className="text-4xl font-bold mb-8">Explore Services</h1>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Sidebar Filters */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Filters</h3>
              
              {/* Pro Only */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pro-only"
                    checked={proOnly}
                    onCheckedChange={(checked) => setProOnly(checked as boolean)}
                  />
                  <Label htmlFor="pro-only" className="text-sm cursor-pointer font-medium">
                    Show Pro Freelancers Only
                  </Label>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-2 block">Price Range (SOL)</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]} SOL</span>
                  <span>{priceRange[1]} SOL</span>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-2 block">Delivery Time</Label>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map(days => (
                    <div key={days} className="flex items-center space-x-2">
                      <Checkbox
                        id={`delivery-${days}`}
                        checked={selectedDeliveryDays.includes(days)}
                        onCheckedChange={() => toggleDeliveryDay(days)}
                      />
                      <Label htmlFor={`delivery-${days}`} className="text-sm cursor-pointer">
                        {days} {days === 1 ? 'day' : 'days'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-2 block">Minimum Rating</Label>
                <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="5">5 Stars Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={category} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedCategories([]);
                setSearchQuery('');
                setSortBy('newest');
                setProOnly(false);
                setPriceRange([0, 100]);
                setSelectedDeliveryDays([]);
                setMinRating(0);
              }}
            >
              Clear All Filters
            </Button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Search Bar and Sort */}
            <div className="flex gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="delivery">Fastest Delivery</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="best-selling">Best Selling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${gigs.length} services found`}
            </p>

            {/* Gigs Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96" />
                ))}
              </div>
            ) : gigs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No services found matching your criteria</p>
                <Button onClick={() => {
                  setSelectedCategories([]);
                  setSearchQuery('');
                  setPriceRange([0, 100]);
                  setSelectedDeliveryDays([]);
                  setMinRating(0);
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => {
                  const seller = gig.profiles;
                  const sellerProfile = gig.seller_profiles;
                  const avgRating = gig.avg_rating || 0;
                  const reviewCount = gig.review_count || 0;

                  return (
                    <Card
                      key={gig.id}
                      className="overflow-hidden hover:shadow-2xl transition-all group border border-border/50 relative"
                    >
                      <div className="relative">
                        <img
                          src={gig.images?.[0] || '/placeholder.svg'}
                          alt={gig.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onClick={() => navigate(`/gig/${gig.id}`)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/90 hover:bg-background shadow-md"
                          onClick={(e) => handleToggleFavorite(gig.id, e)}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isFavorited(gig.id) ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </Button>
                      </div>
                      
                      <CardContent className="p-5" onClick={() => navigate(`/gig/${gig.id}`)}>
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={seller?.avatar_url || ''} />
                            <AvatarFallback>
                              {seller?.username?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {seller?.username}
                          </span>
                          {sellerProfile?.pro_member && (
                            <ProBadge />
                          )}
                        </div>

                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                          {gig.title}
                        </h3>

                        <div className="flex items-center gap-4 mb-3 text-sm">
                          {reviewCount > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{avgRating.toFixed(1)}</span>
                              <span className="text-muted-foreground">({reviewCount})</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{gig.delivery_days} days</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Starting at</p>
                            <p className="text-2xl font-bold text-primary">
                              {gig.price_sol.toFixed(2)} <span className="text-sm">SOL</span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleAddToCart(gig.id, e)}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/gig/${gig.id}`);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
