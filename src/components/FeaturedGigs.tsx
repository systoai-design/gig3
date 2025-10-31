import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Gig {
  id: string;
  title: string;
  price_sol: number;
  category: string;
  images: string[];
  seller_id: string;
}

export const FeaturedGigs = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setGigs(data || []);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading gigs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (gigs.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <PackageOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              No Gigs Available Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Be the first to create a gig and start offering your services on our Web3 marketplace!
            </p>
            <Button onClick={() => navigate('/become-seller')} size="lg">
              Become a Seller
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Services
            </h2>
            <p className="text-muted-foreground text-lg">
              Top-rated gigs from our community
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gigs.map((gig) => (
            <Card
              key={gig.id}
              className="group overflow-hidden border-border hover:shadow-large transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate(`/gig/${gig.id}`)}
            >
              <CardHeader className="p-0 relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {gig.images && gig.images.length > 0 ? (
                    <img
                      src={gig.images[0]}
                      alt={gig.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PackageOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Badge className="absolute bottom-3 left-3 bg-background/90 text-foreground border-border">
                  {gig.category}
                </Badge>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary"></div>
                  <span className="text-sm font-medium text-foreground">
                    Seller
                  </span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {gig.title}
                </h3>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Starting at</p>
                  <p className="text-lg font-bold text-foreground">{gig.price_sol} SOL</p>
                </div>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
