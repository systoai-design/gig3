import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loading, removeFromCart, updateQuantity, clearCart } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item.gig) return total;
      
      let price = item.gig.price_sol;
      
      // If package_index is specified, use package price
      if (item.package_index !== null && item.gig.packages && item.gig.packages[item.package_index]) {
        price = item.gig.packages[item.package_index].price;
      }
      
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to checkout',
        variant: 'destructive',
      });
      return;
    }

    if (cartItems.length === 0) return;

    // Navigate to checkout page
    navigate('/checkout');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-navbar pt-8 pb-20">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
        <div className="min-h-screen bg-background pt-navbar pt-8 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Shopping Cart</h1>
            {cartItems.length > 0 && (
              <Button variant="outline" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Browse our marketplace to find amazing services
              </p>
              <Button onClick={() => navigate('/explore')}>
                Browse Services
              </Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => {
                  if (!item.gig) return null;

                  let price = item.gig.price_sol;
                  let packageName = null;

                  if (item.package_index !== null && item.gig.packages && item.gig.packages[item.package_index]) {
                    const pkg = item.gig.packages[item.package_index];
                    price = pkg.price;
                    packageName = pkg.name;
                  }

                  return (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={item.gig.images?.[0] || '/placeholder.svg'}
                            alt={item.gig.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {item.gig.title}
                            </h3>
                            {packageName && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Package: {packageName}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="ml-auto text-right">
                                <p className="text-2xl font-bold text-primary">
                                  {(price * item.quantity).toFixed(2)} SOL
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {price.toFixed(2)} SOL each
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-28">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Items ({cartItems.length})</span>
                        <span>{calculateTotal().toFixed(2)} SOL</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Platform Fee (5%)</span>
                        <span>{(calculateTotal() * 0.05).toFixed(2)} SOL</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total</span>
                          <span className="text-primary">
                            {(calculateTotal() * 1.05).toFixed(2)} SOL
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Multiple orders will be created for each item
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
