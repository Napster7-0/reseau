"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Toolbar } from './layout/toolbar';
import { TabNavigation } from './layout/tab-navigation';
import { StockStatusTab } from './status/stock-status-tab';
import { JournalTab } from './journal/other-tabs';
import { InventoryView } from './inventory/inventory-view';
import { StockMovementForm } from './movement/stock-movement-form';
import { FilterModal } from '../_ui/filter-modal';
import { OrderModal } from '../_ui/order-modal';
import { getProducts, getWarehouses, getInventories } from '@/lib/api';
import { Product } from '@/types/core';
import { Warehouse, Inventory } from '@/types/stock';

export function StockView() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Etat du Stock');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  
  // États pour les données
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données nécessaires
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, warehousesData, inventoriesData] = await Promise.all([
          getProducts(),
          getWarehouses(),
          getInventories()
        ]);
        setProducts(productsData);
        setWarehouses(warehousesData);
        setInventories(inventoriesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Simule le nombre total d'éléments selon l'onglet actif
  const getTotalCount = () => {
    switch (activeTab) {
      case 'Etat du Stock': return products.length;
      case 'Mouvements de stock': return products.length; // Pour le formulaire de mouvement
      case 'Inventaire': return inventories.length;
      case 'Journal de mouvement': return 189;
      default: return 0;
    }
  };

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

  const toggleStar = useCallback((itemId: string) => {
    console.log('Toggle star for item:', itemId);
    // Cette logique devrait être gérée par chaque composant d'onglet
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing data for tab:', activeTab);
  }, [activeTab]);

  const handleFilter = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  const handleCreateOrder = useCallback(() => {
    setIsOrderModalOpen(true);
  }, []);

  const handleApplyFilters = useCallback((filters: any) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  }, []);

  const handleCreateOrderSubmit = useCallback((order: any) => {
    console.log('Created order:', order);
    // Ici vous pourriez ajouter la logique pour créer la commande
  }, []);

  // Fonction pour rendre le contenu de l'onglet actif
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Chargement des données...</div>
        </div>
      );
    }

    const commonProps = {
      selectedItems,
      hoveredItem,
      onSelectItem: handleSelectItem,
      onToggleStar: toggleStar,
      onHoverItem: setHoveredItem
    };

    switch (activeTab) {
      case 'Etat du Stock':
        return <StockStatusTab {...commonProps} />;
      case 'Mouvements de stock':
        return (
          <div className="h-full p-4">
            <StockMovementForm 
              products={products} 
              warehouses={warehouses} 
            />
          </div>
        );
      case 'Inventaire':
        return (
          <div className="h-full p-4">
            <InventoryView 
              initialInventories={inventories}
              products={products}
              warehouses={warehouses}
            />
          </div>
        );
      case 'Journal de mouvement':
        return <JournalTab {...commonProps} />;
      default:
        return <div className="flex items-center justify-center h-full text-[#5f6368]">
          Onglet non implémenté
        </div>;
    }
  };

  const isAllSelected = selectedItems.length > 0; // Simplifié pour la démo
  const isPartiallySelected = selectedItems.length > 0;

  return (
    <div className="h-full bg-white rounded-5 flex flex-col font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]">
      <Toolbar
        isAllSelected={isAllSelected}
        isPartiallySelected={isPartiallySelected}
        selectedCount={selectedItems.length}
        totalCount={getTotalCount()}
        currentPage={1}
        totalPages={4}
        onSelectAll={handleSelectAll}
        onRefresh={handleRefresh}
        onFilter={handleFilter}
        onCreateOrder={handleCreateOrder}
      />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderTabContent()}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onCreateOrder={handleCreateOrderSubmit}
      />
    </div>
  );
}