"use client";

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  ChevronLeft,
  ChevronRight,
  Filter,
  ShoppingCart
} from 'lucide-react';

interface ToolbarProps {
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  selectedCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onSelectAll: (checked: boolean) => void;
  onRefresh: () => void;
  onFilter?: () => void;
  onCreateOrder?: () => void;
}

export function Toolbar({
  isAllSelected,
  isPartiallySelected,
  selectedCount,
  totalCount,
  currentPage,
  totalPages,
  onSelectAll,
  onRefresh,
  onFilter,
  onCreateOrder
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b bg-white">
      <Checkbox
        checked={isAllSelected}
        onCheckedChange={onSelectAll}
        className="mr-2 data-[state=indeterminate]:bg-[#1a73e8]"
        {...(isPartiallySelected && !isAllSelected ? { "data-state": "indeterminate" } : {})}
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onFilter}
        className="h-8 w-8 hover:bg-[#f1f3f4] rounded-full"
        title="Filtrer"
      >
        <Filter className="h-4 w-4 text-[#5f6368]" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onRefresh}
        className="h-8 w-8 hover:bg-[#f1f3f4] rounded-full"
        title="Actualiser"
      >
        <RefreshCw className="h-4 w-4 text-[#5f6368]" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onCreateOrder}
        className="h-8 w-8 hover:bg-[#f1f3f4] rounded-full"
        title="Passer une commande"
      >
        <ShoppingCart className="h-4 w-4 text-[#5f6368]" />
      </Button>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2 text-sm text-[#5f6368]">
        <span>1-50 sur {totalCount}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
