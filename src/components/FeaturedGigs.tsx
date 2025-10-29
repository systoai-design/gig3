import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredGigs = [
  {
    id: 1,
    title: "I will create a stunning modern logo design",
    seller: "designpro_sol",
    rating: 4.9,
    reviews: 234,
    price: "0.5 SOL",
    image: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&h=300&fit=crop",
    category: "Graphics & Design",
  },
  {
    id: 2,
    title: "I will develop a responsive website with React",
    seller: "webdev_master",
    rating: 5.0,
    reviews: 189,
    price: "2.5 SOL",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    category: "Programming & Tech",
  },
  {
    id: 3,
    title: "I will edit your video professionally",
    seller: "video_wizard",
    rating: 4.8,
    reviews: 156,
    price: "1.2 SOL",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
    category: "Video & Animation",
  },
  {
    id: 4,
    title: "I will write SEO optimized content",
    seller: "content_queen",
    rating: 4.9,
    reviews: 298,
    price: "0.8 SOL",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
    category: "Writing & Translation",
  },
];

export const FeaturedGigs = () => {
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
          {featuredGigs.map((gig) => (
            <Card
              key={gig.id}
              className="group overflow-hidden border-border hover:shadow-large transition-all duration-300 hover:-translate-y-2"
            >
              <CardHeader className="p-0 relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={gig.image}
                    alt={gig.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <button className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors">
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                </button>
                <Badge className="absolute bottom-3 left-3 bg-background/90 text-foreground border-border">
                  {gig.category}
                </Badge>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary"></div>
                  <span className="text-sm font-medium text-foreground">
                    {gig.seller}
                  </span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {gig.title}
                </h3>
                
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-foreground">
                    {gig.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({gig.reviews})
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Starting at</p>
                  <p className="text-lg font-bold text-foreground">{gig.price}</p>
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
