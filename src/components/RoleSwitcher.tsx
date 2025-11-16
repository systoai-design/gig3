import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeftRight, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function RoleSwitcher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasBuyer, setHasBuyer] = useState(false);
  const [hasSeller, setHasSeller] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (error) return;
      const roles = data?.map((r) => r.role) || [];
      setHasBuyer(roles.includes("buyer"));
      setHasSeller(roles.includes("seller"));
    };
    load();
  }, [user]);

  if (!user || !(hasBuyer && hasSeller)) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Switch role">
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Switch Role
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        <DropdownMenuItem onClick={() => navigate("/dashboard/buyer")}> 
          <ShoppingBag className="h-4 w-4 mr-2" />Buyer Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/dashboard/seller")}>
          <LayoutDashboard className="h-4 w-4 mr-2" />Creator Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
