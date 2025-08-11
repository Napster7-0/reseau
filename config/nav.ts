import { 
  LayoutDashboard,
  File, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  HelpCircle,
  Truck,
  FileText,
  Users,
  Calculator,
  Wrench
} from "lucide-react";

export interface NavigationItem {
  name: string;
  icon: any;
  route: string;
  isActive?: boolean;
  isPrimary?: boolean;
  badge?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    name: "Tableau de bord",
    icon: LayoutDashboard,
    route: "/dashboard"
  },
  {
    name: "Fichier",
    icon: File,
    route: "/file",
    badge: "28"
  },
  {
    name: "Stock",
    icon: Package,
    route: "/stock"
  },
  {
    name: "Achats",
    icon: ShoppingCart,
    route: "/purchases"
  },
  {
    name: "Ventes",
    icon: TrendingUp,
    route: "/sales"
  },
  {
    name: "Livraison",
    icon: Truck,
    route: "/deliver"
  },
  {
    name: "Proformas",
    icon: FileText,
    route: "/proformas"
  },
  {
    name: "Commande client",
    icon: Users,
    route: "/customer-order"
  },
  {
    name: "Comptabilité",
    icon: Calculator,
    route: "/comptability"
  },
  {
    name: "outils",
    icon: Wrench,
    route: "/customer-order"
  },
  {
    name: "Administration",
    icon: Settings,
    route: "/administration",
    badge: "13"
  },
  {
    name: "Aide",
    icon: HelpCircle,
    route: "/help"
  }
];
