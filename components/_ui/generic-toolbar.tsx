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

export interface ToolbarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}

interface GenericToolbarProps {
  // Props standards
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  selectedCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onSelectAll: (checked: boolean) => void;
  onRefresh: () => void;
  
  // Props optionnelles pour la compatibilité descendante
  onFilter?: () => void;
  onCreateOrder?: () => void;
  
  // Nouvelles props pour la personnalisation
  showSelectAll?: boolean;
  showPagination?: boolean;
  showRefresh?: boolean;
  customActions?: ToolbarAction[];
  
  // Props de style
  className?: string;
  leftSectionClassName?: string;
  rightSectionClassName?: string;
}

export function GenericToolbar({
  isAllSelected,
  isPartiallySelected,
  selectedCount,
  totalCount,
  currentPage,
  totalPages,
  onSelectAll,
  onRefresh,
  onFilter,
  onCreateOrder,
  showSelectAll = true,
  showPagination = true,
  showRefresh = true,
  customActions = [],
  className = "",
  leftSectionClassName = "",
  rightSectionClassName = ""
}: GenericToolbarProps) {
  
  // Actions par défaut basées sur les props existantes
  const defaultActions: ToolbarAction[] = [];
  
  if (showRefresh) {
    defaultActions.push({
      id: 'refresh',
      icon: <RefreshCw className="h-4 w-4" />,
      label: 'Actualiser',
      onClick: onRefresh
    });
  }
  
  if (onFilter) {
    defaultActions.push({
      id: 'filter',
      icon: <Filter className="h-4 w-4" />,
      label: 'Filtrer',
      onClick: onFilter
    });
  }
  
  if (onCreateOrder) {
    defaultActions.push({
      id: 'create-order',
      icon: <ShoppingCart className="h-4 w-4" />,
      label: 'Passer une commande',
      onClick: onCreateOrder,
      variant: 'primary' as const
    });
  }
  
  const allActions = [...defaultActions, ...customActions];

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b border-[#e8eaed] bg-[#f8f9fa] ${className}`}>
      {/* Section gauche */}
      <div className={`flex items-center space-x-4 ${leftSectionClassName}`}>
        {showSelectAll && (
          <>
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              className="data-[state=checked]:bg-[#1a73e8] data-[state=checked]:border-[#1a73e8]"
            />
            <span className="text-sm text-[#5f6368] font-medium">
              {selectedCount > 0 ? `${selectedCount} sélectionné(s)` : `${totalCount} éléments`}
            </span>
          </>
        )}
      </div>    

      {/* Section droite */}
      <div className={`flex items-center space-x-2 ${rightSectionClassName}`}>
        {/* Actions personnalisées */}
        {allActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant === 'primary' ? 'default' : 'ghost'}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            className={`
              h-8 px-3 text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#3c4043]
              ${action.variant === 'primary' ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0] hover:text-white' : ''}
              ${action.variant === 'danger' ? 'text-[#d93025] hover:bg-[#fce8e6] hover:text-[#d93025]' : ''}
            `}
          >
            {action.icon}
            <span className="ml-1 hidden sm:inline">{action.label}</span>
          </Button>
        ))}

        {/* Pagination */}
        {showPagination && (
          <div className="flex items-center space-x-2 ml-4 border-l border-[#e8eaed] pl-4">
            <span className="text-sm text-[#5f6368]">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 text-[#5f6368] hover:bg-[#f1f3f4] disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 text-[#5f6368] hover:bg-[#f1f3f4] disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Export pour la compatibilité avec l'ancien composant
export { GenericToolbar as Toolbar };
