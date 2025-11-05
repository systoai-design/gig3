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
import { Search, Star, Clock, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProBadge } from '@/components/ProBadge';

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

  // Update search query when URL params change
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchGigs();
  }, [searchQuery, selectedCategories, sortBy, proOnly]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('gigs')
        .select(`
          *,
          profiles:seller_id (username, avatar_url),
          seller_profiles (pro_member, pro_since)
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
      }

      const { data, error } = await query;

      if (error) throw error;
      setGigs(data || []);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <h1 className="text-4xl font-bold mb-8">Explore Services</h1>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Sidebar Filters */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Filters</h3>
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
            </div>

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
              }}
            >
              Clear Filters
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
                  <Skeleton key={i} className="h-80" />
                ))}
              </div>
            ) : gigs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No services found matching your criteria</p>
                <Button onClick={() => {
                  setSelectedCategories([]);
                  setSearchQuery('');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <Card
                    key={gig.id}
                    className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border border-border/50"
                    onClick={() => navigate(`/gigs/${gig.id}`)}
                  >
                    {/* Image Section - Larger, more prominent */}
                    <div className="relative h-56 overflow-hidden bg-muted">
                      <img
                        src={gig.images?.[0] || '/placeholder.svg'}
                        alt={gig.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {gig.seller_profiles?.pro_member && (
                        <div className="absolute top-3 left-3">
                          <ProBadge size="sm" proSince={gig.seller_profiles.pro_since} />
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground border-0">
                        {gig.category}
                      </Badge>
                    </div>

                    {/* Content Section - Amazon-style */}
                    <CardContent className="p-4 space-y-3">
                      {/* Title - Prominent */}
                      <h3 className="font-semibold text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
                        {gig.title}
                      </h3>

                      {/* Seller Info */}
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={gig.profiles?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {gig.profiles?.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-muted-foreground">
                            {gig.profiles?.username || 'Anonymous'}
                          </span>
                          {gig.seller_profiles?.verified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          )}
                        </div>
                      </div>

                      {/* Rating - More prominent */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">5.0</span>
                        <span className="text-sm text-muted-foreground">(127)</span>
                      </div>

                      {/* Delivery Time Badge */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{gig.delivery_days} day delivery</span>
                      </div>

                      {/* Price & CTA - Emphasized like Amazon */}
                      <div className="pt-3 border-t flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Price</p>
                          <p className="text-2xl font-bold text-foreground">{gig.price_sol} <span className="text-base">SOL</span></p>
                        </div>
                        <Button 
                          size="sm" 
                          className="gap-2 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/gigs/${gig.id}`);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
