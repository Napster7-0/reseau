"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { GenericTable, TableColumn, GenericTableItem } from '../../_ui/generic-list';
import { getProducts } from '@/lib/api';
import { Product } from '@/types/core';

// Définition des colonnes pour le tableau de stock
const stockColumns: TableColumn[] = [
  {
    key: 'code',
    label: 'Code',
    width: 'w-48',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'name',
    label: 'Libellé',
    width: 'w-48',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'stock',
    label: 'En Stock',
    width: 'w-24',
    align: 'right',
    sortable: true,
    type: 'number'
  },
  {
    key: 'costPrice',
    label: 'CMUP',
    width: 'w-28',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'valStock',
    label: 'Val Stock',
    width: 'w-28',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'salePrice',
    label: 'Prix Vente',
    width: 'w-32',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'wholesalePrice',
    label: 'Prix Gros',
    width: 'w-28',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'valGros',
    label: 'Val Gros',
    width: 'w-28',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'semiWholesalePrice',
    label: 'Demi-Gros',
    width: 'w-28',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'valDemi',
    label: 'Val Demi',
    width: 'w-28',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'saleRef',
    label: 'Réf Vente',
    width: 'w-24',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'minStock',
    label: 'Stock Min',
    width: 'w-20',
    align: 'right',
    sortable: true,
    type: 'number'
  },
  {
    key: 'maxStock',
    label: 'Stock Max',
    width: 'w-20',
    align: 'right',
    sortable: true,
    type: 'number'
  },
  {
    key: 'threshold',
    label: 'Seuil',
    width: 'w-20',
    align: 'right',
    sortable: true,
    type: 'number'
  }
];

// Fonction pour convertir un Product en GenericTableItem
const transformProductToTableItem = (product: Product): GenericTableItem => ({
  id: product.id,
  code: product.code,
  name: product.name,
  stock: product.stock,
  costPrice: product.costPrice,
  valStock: product.costPrice * product.stock,
  salePrice: product.salePrice,
  wholesalePrice: product.wholesalePrice,
  valGros: product.wholesalePrice * product.stock,
  semiWholesalePrice: product.semiWholesalePrice,
  valDemi: product.semiWholesalePrice * product.stock,
  saleRef: product.saleRef,
  minStock: product.minStock,
  maxStock: product.maxStock,
  threshold: product.threshold,
  isStarred: false,
  isImportant: product.stock <= (product.threshold || 0)
});

interface StockStatusTabProps {
  selectedItems: string[];
  hoveredItem: string | null;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onToggleStar: (itemId: string) => void;
  onHoverItem: (itemId: string | null) => void;
}

export function StockStatusTab({
  selectedItems,
  hoveredItem,
  onSelectItem,
  onToggleStar,
  onHoverItem
}: StockStatusTabProps) {
  const [items, setItems] = useState<GenericTableItem[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données des produits depuis l'API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await getProducts();
        const tableItems = products.map(transformProductToTableItem);
        setItems(tableItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
        console.error('Erreur lors du chargement des produits:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    const allIds = items.map(item => item.id);
    if (checked) {
      allIds.forEach(id => onSelectItem(id, true));
    } else {
      allIds.forEach(id => onSelectItem(id, false));
    }
  };

  const handleToggleStar = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, isStarred: !item.isStarred }
        : item
    ));
    onToggleStar(itemId);
  };

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);

    const sortedItems = [...items].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return newDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      
      if (newDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    setItems(sortedItems);
  };

  const handleView = useCallback((itemId: string) => {
    console.log('Voir détails stock:', itemId);
  }, []);

  const handleEdit = useCallback((itemId: string) => {
    console.log('Modifier stock:', itemId);
  }, []);

  const handleDelete = useCallback((itemId: string) => {
    console.log('Supprimer stock:', itemId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <GenericTable
      items={items}
      columns={stockColumns}
      selectedItems={selectedItems}
      hoveredItem={hoveredItem}
      showSelection={true}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSelectItem={onSelectItem}
      onSelectAll={handleSelectAll}
      onToggleStar={handleToggleStar}
      onHoverItem={onHoverItem}
      onSort={handleSort}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
