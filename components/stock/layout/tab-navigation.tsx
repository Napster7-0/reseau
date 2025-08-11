"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Package,
  ArrowRightLeft,
  Shuffle,
  BookOpen,
  MoreHorizontal
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    className: string;
  };
  preview?: string;
}

interface TabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  {
    id: 'Etat du Stock',
    label: 'Etat du Stock',
    icon: <Package className="h-4 w-4 text-[#1a73e8]" />
  },
  {
    id: 'Mouvements de stock',
    label: 'Mouvements de stock',
    icon: <ArrowRightLeft className="h-4 w-4 text-[#5f6368]" /> // Deux flèches opposées
  },
  {
    id: 'Journal de mouvement',
    label: 'Journal de mouvement',
    icon: <BookOpen className="h-4 w-4 text-[#5f6368]" />
  },
  {
    id: 'Inventaire',
    label: 'Inventaire',
    icon: <Shuffle className="h-4 w-4 text-[#5f6368]" /> // Icône pour inventaire
  }
];

// Largeur fixe basée sur "Journal de mouvement" (le plus long)
const TAB_WIDTH = 180; // en pixels

export function TabNavigation({ activeTab, onTabChange }: TabsProps) {
  const [visibleTabs, setVisibleTabs] = useState<Tab[]>([]);
  const [overflowTabs, setOverflowTabs] = useState<Tab[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateVisibleTabs = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const moreButtonWidth = 40; // Largeur approximative du bouton "More"
      const availableWidth = containerWidth - moreButtonWidth;
      const maxVisibleTabs = Math.floor(availableWidth / TAB_WIDTH);
      
      if (maxVisibleTabs >= tabs.length) {
        setVisibleTabs(tabs);
        setOverflowTabs([]);
      } else {
        setVisibleTabs(tabs.slice(0, maxVisibleTabs));
        setOverflowTabs(tabs.slice(maxVisibleTabs));
      }
    };

    calculateVisibleTabs();
    window.addEventListener('resize', calculateVisibleTabs);
    return () => window.removeEventListener('resize', calculateVisibleTabs);
  }, []);

  const TabItem = ({ tab, isOverflow = false }: { tab: Tab; isOverflow?: boolean }) => {
    const isActive = activeTab === tab.id;
    const tabContent = (
      <div 
        className={`flex items-center gap-2 px-3 py-3 cursor-pointer transition-colors ${
          isActive 
            ? 'border-b-2 border-[#1a73e8] bg-[#e8f0fe]' 
            : 'hover:bg-[#f8f9fa]'
        } ${!isOverflow ? 'min-w-0' : ''}`}
        style={!isOverflow ? { width: `${TAB_WIDTH}px` } : {}}
        onClick={() => onTabChange(tab.id)}
      >
        {React.cloneElement(tab.icon as React.ReactElement, {
          className: `h-4 w-4 ${isActive ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`
        })}
        
        {tab.badge && (
          <Badge variant="secondary" className={tab.badge.className}>
            {tab.badge.text}
          </Badge>
        )}
        
        <span className={`text-sm truncate ${
          isActive ? 'font-medium text-[#1a73e8]' : 'text-[#5f6368]'
        } ${tab.badge ? 'ml-1' : ''}`}>
          {tab.label}
        </span>
        
        {tab.preview && (
          <span className="text-xs text-[#9aa0a6] ml-1 truncate">{tab.preview}</span>
        )}
      </div>
    );

    if (isOverflow) {
      return tabContent;
    }

    return (
      <TooltipProvider key={tab.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            {tabContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tab.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div ref={containerRef} className="flex border-b bg-white overflow-hidden">
      {visibleTabs.map((tab) => (
        <TabItem key={tab.id} tab={tab} />
      ))}
      
      {overflowTabs.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-10 hover:bg-[#f8f9fa] rounded-none border-b-2 border-transparent"
            >
              <MoreHorizontal className="h-4 w-4 text-[#5f6368]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {overflowTabs.map((tab) => (
              <DropdownMenuItem
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`cursor-pointer ${
                  activeTab === tab.id ? 'bg-[#e8f0fe] text-[#1a73e8]' : ''
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  {React.cloneElement(tab.icon as React.ReactElement, {
                    className: `h-4 w-4 ${activeTab === tab.id ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`
                  })}
                  <span className="flex-1">{tab.label}</span>
                  {tab.badge && (
                    <Badge variant="secondary" className={tab.badge.className}>
                      {tab.badge.text}
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
