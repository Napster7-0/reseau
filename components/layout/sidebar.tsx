"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { navigationItems, NavigationItem } from "@/config/nav";

export function Sidebar() {
  const { isCollapsed } = useSidebar();
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState("/inbox");

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    router.push(route);
  };

  return (
    <aside
      className={cn(
        "h-screen bg-[#f6f8fc] flex flex-col transition-all duration-300",
        "font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]", // Padding top pour le header fixé
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Navigation */}
      <div className="flex-1 pt-6 pb-4">
        <nav className={cn("space-y-1", isCollapsed ? "px-2" : "px-4")}>
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.route;
            const isPrimary = item.isPrimary;
            
            return (
              <div key={item.name} className="relative group">
                {isPrimary ? (
                  // Bouton "Nouveau message" spécial
                  <Button
                    variant="default"
                    className={cn(
                      "w-full h-12 rounded-full transition-all duration-200 ease-in-out shadow-md",
                      "bg-[#c2e7ff] hover:bg-[#a8daff] text-[#001d35] font-medium",
                      "hover:shadow-lg",
                      isCollapsed && "w-12 px-0 justify-center"
                    )}
                    onClick={() => handleNavigation(item.route)}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      !isCollapsed && "mr-3"
                    )} />
                    {!isCollapsed && (
                      <span className="text-[14px] leading-5">
                        {item.name}
                      </span>
                    )}
                  </Button>
                ) : (
                  // Boutons de navigation normaux
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full h-8 rounded-r-full transition-all duration-150 ease-in-out",
                      isCollapsed 
                        ? "justify-center px-0 mx-auto rounded-full" 
                        : "justify-start px-3 rounded-r-full",
                      // États Gmail avec couleurs bleues
                      isActive && !isCollapsed && "bg-[#d3e3fd] text-[#1a73e8] font-medium hover:bg-[#d3e3fd]",
                      isActive && isCollapsed && "bg-[#d3e3fd] text-[#1a73e8] hover:bg-[#d3e3fd]",
                      !isActive && "text-[#3c4043] hover:bg-[#f1f3f4] font-normal",
                      "hover:shadow-sm"
                    )}
                    onClick={() => handleNavigation(item.route)}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-colors duration-150",
                      !isCollapsed && "mr-3",
                      isActive ? "text-[#1a73e8]" : "text-[#5f6368]"
                    )} />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className={cn(
                          "text-left text-[14px] leading-5 transition-colors duration-150",
                          isActive ? "text-[#1a73e8] font-medium" : "text-[#3c4043] font-normal"
                        )}>
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="text-[13px] text-[#5f6368] font-normal">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Button>
                )}
                
                {/* Tooltip Gmail-style pour le mode réduit */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}