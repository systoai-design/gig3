import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Eye, MousePointer, ShoppingCart, Heart, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CreatorAnalyticsProps {
  sellerId: string;
}

export const CreatorAnalytics = ({ sellerId }: CreatorAnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [stats, setStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    totalAddToCarts: 0,
    totalFavorites: 0,
    totalSales: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [gigPerformance, setGigPerformance] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [sellerId, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch analytics events
      const { data: analyticsData } = await supabase
        .from('gig_analytics')
        .select('*')
        .eq('seller_id', sellerId)
        .gte('created_at', startDate.toISOString());

      // Fetch sales data
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, gigs(title)')
        .eq('seller_id', sellerId)
        .in('status', ['completed', 'in_progress', 'delivered'])
        .gte('created_at', startDate.toISOString());

      // Calculate stats
      const viewCount = analyticsData?.filter(e => e.event_type === 'view').length || 0;
      const clickCount = analyticsData?.filter(e => e.event_type === 'click').length || 0;
      const addToCartCount = analyticsData?.filter(e => e.event_type === 'add_to_cart').length || 0;
      const favoriteCount = analyticsData?.filter(e => e.event_type === 'favorite').length || 0;
      const salesCount = ordersData?.length || 0;
      const revenue = ordersData?.reduce((sum, order) => sum + Number(order.amount_sol), 0) || 0;
      const conversionRate = viewCount > 0 ? (salesCount / viewCount) * 100 : 0;

      setStats({
        totalViews: viewCount,
        totalClicks: clickCount,
        totalAddToCarts: addToCartCount,
        totalFavorites: favoriteCount,
        totalSales: salesCount,
        totalRevenue: revenue,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      });

      // Prepare time series data
      const dateMap = new Map<string, { views: number; clicks: number }>();
      analyticsData?.forEach(event => {
        const date = new Date(event.created_at).toLocaleDateString();
        const current = dateMap.get(date) || { views: 0, clicks: 0 };
        if (event.event_type === 'view') current.views++;
        if (event.event_type === 'click') current.clicks++;
        dateMap.set(date, current);
      });

      const chartArray = Array.from(dateMap.entries()).map(([date, data]) => ({
        date,
        views: data.views,
        clicks: data.clicks,
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setChartData(chartArray);

      // Gig performance
      const gigMap = new Map<string, { title: string; views: number; sales: number }>();
      
      analyticsData?.forEach(event => {
        if (event.event_type === 'view') {
          const current = gigMap.get(event.gig_id) || { title: '', views: 0, sales: 0 };
          current.views++;
          gigMap.set(event.gig_id, current);
        }
      });

      ordersData?.forEach(order => {
        const current = gigMap.get(order.gig_id) || { title: order.gigs?.title || 'Unknown', views: 0, sales: 0 };
        current.title = order.gigs?.title || 'Unknown';
        current.sales++;
        gigMap.set(order.gig_id, current);
      });

      const gigArray = Array.from(gigMap.values())
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      setGigPerformance(gigArray);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Add to Cart</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAddToCarts.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFavorites.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} SOL</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Views & Clicks Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="clicks" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {gigPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Gigs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gigPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" />
                <Bar dataKey="sales" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
