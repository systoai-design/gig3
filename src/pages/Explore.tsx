import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Star, ShoppingCart, User, Search, SlidersHorizontal, Clock } from "lucide-react";
import { ProBadge } from "@/components/ProBadge";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [filterOpen, setFilterOpen] = useState(false);
  
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
          profiles:seller_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'active');

      // Pro filter - fetch pro user ids and filter gigs by seller_id
      if (proOnly) {
        const { data: proUsers, error: proErr } = await supabase
          .from('seller_profiles')
          .select('user_id')
          .eq('pro_member', true);
        if (proErr) throw proErr;
        const proIds = (proUsers || []).map(u => u.user_id).filter(Boolean);
        if (proIds.length === 0) {
          setGigs([]);
          setLoading(false);
          return;
        }
        query = query.in('seller_id', proIds);
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

      // Fetch seller profiles in batch for pro badge and metadata
      const sellerIds = Array.from(new Set((data || []).map((g: any) => g.seller_id)));
      let sellerProfilesMap: Record<string, any> = {};
      if (sellerIds.length > 0) {
        const { data: sellerProfiles } = await supabase
          .from('seller_profiles')
          .select('user_id, pro_member, pro_since')
          .in('user_id', sellerIds);
        sellerProfilesMap = Object.fromEntries((sellerProfiles || []).map((sp: any) => [sp.user_id, sp]));
      }

      // Fetch reviews for rating filter
      if (minRating > 0 && data) {
        const gigsWithReviews = await Promise.all(
          data.map(async (gig: any) => {
            const { data: reviews } = await supabase
              .from('reviews')
              .select('rating')
              .eq('reviewee_id', gig.seller_id);

            const avgRating = reviews && reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0;

            return { ...gig, avg_rating: avgRating, review_count: reviews?.length || 0, seller_profile: sellerProfilesMap[gig.seller_id] };
          })
        );

        const filtered = gigsWithReviews.filter((gig: any) => gig.avg_rating >= minRating);
        setGigs(filtered);
      } else if (data) {
        // Fetch review counts without filtering
        const gigsWithReviews = await Promise.all(
          data.map(async (gig: any) => {
            const { data: reviews } = await supabase
              .from('reviews')
              .select('rating')
              .eq('reviewee_id', gig.seller_id);

            const avgRating = reviews && reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0;

            return { ...gig, avg_rating: avgRating, review_count: reviews?.length || 0, seller_profile: sellerProfilesMap[gig.seller_id] };
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

  const activeFilterCount = 
    selectedCategories.length + 
    (proOnly ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0) + 
    (selectedDeliveryDays.length > 0 ? 1 : 0) + 
    (minRating > 0 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Pro Only Filter */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Pro Only</Label>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="pro-only" 
            checked={proOnly}
            onCheckedChange={(checked) => setProOnly(checked as boolean)}
          />
          <Label htmlFor="pro-only" className="cursor-pointer">Show only Pro creators</Label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Price Range: {priceRange[0]} - {priceRange[1]} SOL
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={100}
          step={1}
          className="mb-2"
        />
      </div>

      {/* Delivery Time */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Delivery Time</Label>
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((days) => (
            <div key={days} className="flex items-center space-x-2">
              <Checkbox 
                id={`delivery-${days}`}
                checked={selectedDeliveryDays.includes(days)}
                onCheckedChange={() => toggleDeliveryDay(days)}
              />
              <Label htmlFor={`delivery-${days}`} className="cursor-pointer">
                {days} {days === 1 ? 'day' : 'days'}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Minimum Rating</Label>
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

      {/* Categories */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Categories</Label>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`category-${category}`} className="cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setSelectedCategories([]);
            setProOnly(false);
            setPriceRange([0, 100]);
            setSelectedDeliveryDays([]);
            setMinRating(0);
            setFilterOpen(false);
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

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
      
      <main className="container mx-auto px-4 pt-navbar pt-8 pb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          Explore Services
        </motion.h1>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
            <FilterContent />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Mobile Filter Button */}
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden w-full relative">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

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
                <Button type="submit" size={isMobile ? "icon" : "default"}>
                  <Search className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Search</span>
                </Button>
              </form>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="delivery">Fastest Delivery</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="best-selling">Best Selling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              {loading ? 'Loading...' : `${gigs.length} services found`}
            </p>

            {/* Gigs Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : gigs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-lg mb-4">No services found matching your criteria</p>
                <Button onClick={() => {
                  setSelectedCategories([]);
                  setSearchQuery('');
                  setPriceRange([0, 100]);
                  setSelectedDeliveryDays([]);
                  setMinRating(0);
                }}>
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {gigs.map((gig) => {
                  const seller = gig.profiles;
                  const sellerProfile = gig.seller_profile;
                  const avgRating = gig.avg_rating || 0;
                  const reviewCount = gig.review_count || 0;

                  return (
                    <StaggerItem key={gig.id}>
                      <motion.div
                        whileHover={{ y: -8 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="overflow-hidden hover-lift cursor-pointer h-full flex flex-col">
                          <div 
                            className="relative h-48 overflow-hidden"
                            onClick={() => navigate(`/gig/${gig.id}`)}
                          >
                            <img
                              src={gig.images?.[0] || '/placeholder.svg'}
                              alt={gig.title}
                              className="w-full h-full object-cover transition-transform hover:scale-110"
                              loading="lazy"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleToggleFavorite(gig.id, e)}
                              className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                              <Heart
                                className={`h-4 w-4 ${isFavorited(gig.id) ? 'fill-red-500 text-red-500' : ''}`}
                              />
                            </motion.button>
                          </div>

                          <CardContent 
                            className="p-4 flex-1 flex flex-col"
                            onClick={() => navigate(`/gig/${gig.id}`)}
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/profile/${gig.seller_id}`);
                                }}
                                className="flex items-start gap-2 hover:opacity-80 transition-opacity cursor-pointer flex-1 min-w-0"
                                type="button"
                              >
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage src={seller?.avatar_url || undefined} />
                                  <AvatarFallback>
                                    <User className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate hover:text-primary transition-colors">
                                    {seller?.username || 'Anonymous'}
                                  </p>
                                  {reviewCount > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{avgRating.toFixed(1)}</span>
                                      <span>({reviewCount})</span>
                                    </div>
                                  )}
                                </div>
                              </button>
                              {sellerProfile?.pro_member && (
                                <ProBadge />
                              )}
                            </div>

                            <h3 className="font-semibold line-clamp-2 mb-2 flex-1">
                              {gig.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {gig.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {gig.delivery_days}d
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-2 border-t">
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Starting at</span>
                                <span className="text-lg font-bold">{gig.price_sol.toFixed(2)} SOL</span>
                              </div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  onClick={(e) => handleAddToCart(gig.id, e)}
                                  className="min-w-[44px] min-h-[44px]"
                                >
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
