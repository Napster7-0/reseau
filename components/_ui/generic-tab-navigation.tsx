"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export interface GenericTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    className: string;
  };
  preview?: string;
}

interface GenericTabNavigationProps {
  tabs: GenericTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  overflowMenuClassName?: string;
}

export function GenericTabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  tabClassName = "",
  activeTabClassName = "",
  overflowMenuClassName = ""
}: GenericTabNavigationProps) {
  const [visibleTabs, setVisibleTabs] = useState<GenericTab[]>([]);
  const [overflowTabs, setOverflowTabs] = useState<GenericTab[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fonction pour calculer les onglets visibles et en overflow
  const calculateVisibleTabs = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const overflowButtonWidth = 40; // Largeur approximative du bouton "..."
    const tabWidth = 200; // Largeur fixe des onglets
    const maxVisibleTabs = Math.floor((containerWidth - overflowButtonWidth) / tabWidth);
    
    if (maxVisibleTabs >= tabs.length) {
      setVisibleTabs(tabs);
      setOverflowTabs([]);
    } else {
      const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
      
      if (activeTabIndex < maxVisibleTabs) {
        setVisibleTabs(tabs.slice(0, maxVisibleTabs));
        setOverflowTabs(tabs.slice(maxVisibleTabs));
      } else {
        // S'assurer que l'onglet actif est visible
        const startIndex = Math.max(0, activeTabIndex - maxVisibleTabs + 1);
        setVisibleTabs(tabs.slice(startIndex, startIndex + maxVisibleTabs));
        setOverflowTabs([
          ...tabs.slice(0, startIndex),
          ...tabs.slice(startIndex + maxVisibleTabs)
        ]);
      }
    }
  };

  useEffect(() => {
    calculateVisibleTabs();
    
    const handleResize = () => calculateVisibleTabs();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [tabs, activeTab]);

  const renderTab = (tab: GenericTab, isActive: boolean = false) => {
    const baseTabClass = `
      relative flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer
      border-b-2 min-w-[200px] max-w-[200px] group
      ${tabClassName}
    `;
    
    const activeClass = isActive
      ? `border-[#1a73e8] text-[#1a73e8] bg-[#e8f0fe] ${activeTabClassName}`
      : `border-transparent text-[#5f6368] hover:text-[#3c4043] hover:bg-[#f1f3f4]`;

    return (
      <TooltipProvider key={tab.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`${baseTabClass} ${activeClass}`}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div className="flex-shrink-0">
                  {tab.icon}
                </div>
                <span className="truncate">
                  {tab.label}
                </span>
                {tab.badge && (
                  <Badge 
                    variant="secondary" 
                    className={`flex-shrink-0 h-5 px-1.5 text-xs ${tab.badge.className}`}
                  >
                    {tab.badge.text}
                  </Badge>
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p className="font-medium">{tab.label}</p>
              {tab.preview && (
                <p className="text-xs text-muted-foreground mt-1">{tab.preview}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={`border-b border-[#e8eaed] bg-white ${className}`}>
      <div ref={containerRef} className="flex items-center">
        {/* Onglets visibles */}
        <div className="flex">
          {visibleTabs.map(tab => renderTab(tab, tab.id === activeTab))}
        </div>

        {/* Menu overflow */}
        {overflowTabs.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`ml-2 h-12 w-10 p-0 text-[#5f6368] hover:bg-[#f1f3f4] ${overflowMenuClassName}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {overflowTabs.map(tab => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 ${tab.id === activeTab ? 'bg-[#e8f0fe] text-[#1a73e8]' : ''}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-auto h-5 px-1.5 text-xs ${tab.badge.className}`}
                    >
                      {tab.badge.text}
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

// Export pour la compatibilité avec l'ancien composant
export { GenericTabNavigation as TabNavigation };
