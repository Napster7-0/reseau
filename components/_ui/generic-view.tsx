"use client";

import React, { useState, useCallback } from 'react';
import { GenericToolbar } from './generic-toolbar';
import { GenericTabNavigation } from './generic-tab-navigation';
import { FilterModal } from './filter-modal';
import { OrderModal } from './order-modal';

// Types génériques - renommés pour éviter les conflits
export interface ViewTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    className: string;
  };
  preview?: string;
}

export interface ViewToolbarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}

export interface GenericViewProps {
  // Configuration des onglets
  tabs: ViewTab[];
  defaultActiveTab?: string;
  
  // Configuration de la toolbar
  toolbarActions?: ViewToolbarAction[];
  showSelectAll?: boolean;
  showPagination?: boolean;
  
  // Fonction de rendu du contenu
  renderContent: (activeTab: string, commonProps: {
    selectedItems: string[];
    hoveredItem: string | null;
    onSelectItem: (itemId: string, checked: boolean) => void;
    onToggleStar: (itemId: string) => void;
    onHoverItem: (itemId: string | null) => void;
  }) => React.ReactNode;
  
  // Fonctions de données
  getTotalCount?: (activeTab: string) => number;
  onTabChange?: (activeTab: string) => void;
  
  // Modals customisables
  filterModal?: {
    enabled: boolean;
    component?: React.ComponentType<{
      isOpen: boolean;
      onClose: () => void;
      onApplyFilters: (filters: any) => void;
    }>;
  };
  
  orderModal?: {
    enabled: boolean;
    component?: React.ComponentType<{
      isOpen: boolean;
      onClose: () => void;
      onCreateOrder: (order: any) => void;
    }>;
  };
  
  // Callbacks personnalisés
  onApplyFilters?: (filters: any) => void;
  onCreateOrder?: (order: any) => void;
  onRefresh?: (activeTab: string) => void;
  onToggleStar?: (itemId: string, activeTab: string) => void;
  
  // Style personnalisé
  className?: string;
  containerClassName?: string;
}

export function GenericView({
  tabs,
  defaultActiveTab,
  toolbarActions = [],
  showSelectAll = true,
  showPagination = true,
  renderContent,
  getTotalCount = () => 0,
  onTabChange,
  filterModal = { enabled: false },
  orderModal = { enabled: false },
  onApplyFilters,
  onCreateOrder,
  onRefresh,
  onToggleStar,
  className = "",
  containerClassName = "h-full bg-white rounded-[10px] flex flex-col font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]"
}: GenericViewProps) {
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      // En réalité, cela devrait sélectionner tous les IDs de l'onglet actif
      setSelectedItems(['1', '2', '3', '4', '5']);
    } else {
      setSelectedItems([]);
    }
  }, []);

  const handleSelectItem = useCallback((itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  }, []);

  const handleToggleStar = useCallback((itemId: string) => {
    if (onToggleStar) {
      onToggleStar(itemId, activeTab);
    } else {
      console.log('Toggle star for item:', itemId, 'in tab:', activeTab);
    }
  }, [onToggleStar, activeTab]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh(activeTab);
    } else {
      console.log('Refreshing data for tab:', activeTab);
    }
  }, [onRefresh, activeTab]);

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
    setSelectedItems([]); // Reset selection when changing tabs
    if (onTabChange) {
      onTabChange(newTab);
    }
  }, [onTabChange]);

  const handleApplyFilters = useCallback((filters: any) => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    } else {
      console.log('Applied filters:', filters);
    }
  }, [onApplyFilters]);

  const handleCreateOrderSubmit = useCallback((order: any) => {
    if (onCreateOrder) {
      onCreateOrder(order);
    } else {
      console.log('Created order:', order);
    }
  }, [onCreateOrder]);

  // Fonction pour créer les actions de toolbar par défaut
  const getDefaultToolbarActions = (): ViewToolbarAction[] => {
    const actions: ViewToolbarAction[] = [];
    
    if (filterModal.enabled) {
      actions.push({
        id: 'filter',
        icon: <span>🔍</span>, // Remplacez par l'icône appropriée
        label: 'Filtrer',
        onClick: () => setIsFilterModalOpen(true)
      });
    }
    
    actions.push({
      id: 'refresh',
      icon: <span>🔄</span>, // Remplacez par l'icône appropriée
      label: 'Actualiser',
      onClick: handleRefresh
    });
    
    if (orderModal.enabled) {
      actions.push({
        id: 'order',
        icon: <span>🛒</span>, // Remplacez par l'icône appropriée
        label: 'Passer une commande',
        onClick: () => setIsOrderModalOpen(true)
      });
    }
    
    return actions;
  };

  const allToolbarActions = [...getDefaultToolbarActions(), ...toolbarActions];

  const commonProps = {
    selectedItems,
    hoveredItem,
    onSelectItem: handleSelectItem,
    onToggleStar: handleToggleStar,
    onHoverItem: setHoveredItem
  };

  const isAllSelected = selectedItems.length > 0; // Simplifié pour la démo
  const isPartiallySelected = selectedItems.length > 0;

  // Composants de modal par défaut ou personnalisés
  const FilterModalComponent = filterModal.component || FilterModal;
  const OrderModalComponent = orderModal.component || OrderModal;

  return (
    <div className={`${containerClassName} ${className}`}>
      <GenericToolbar
        isAllSelected={isAllSelected}
        isPartiallySelected={isPartiallySelected}
        selectedCount={selectedItems.length}
        totalCount={getTotalCount(activeTab)}
        currentPage={1}
        totalPages={4}
        onSelectAll={handleSelectAll}
        onRefresh={handleRefresh}
        onFilter={filterModal.enabled ? () => setIsFilterModalOpen(true) : undefined}
        onCreateOrder={orderModal.enabled ? () => setIsOrderModalOpen(true) : undefined}
        showSelectAll={showSelectAll}
        showPagination={showPagination}
        customActions={allToolbarActions}
      />

      <GenericTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {renderContent(activeTab, commonProps)}

      {filterModal.enabled && (
        <FilterModalComponent
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      )}

      {orderModal.enabled && (
        <OrderModalComponent
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          onCreateOrder={handleCreateOrderSubmit}
        />
      )}
    </div>
  );
}
