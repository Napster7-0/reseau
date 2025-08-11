"use client";

import React, { useState } from 'react';
import { GenericTable, TableColumn, GenericTableItem } from '@/components/_ui/generic-list';

// Définition des colonnes pour le tableau de stock
const stockColumns: TableColumn[] = [
  {
    key: 'code',
    label: 'Code',
    width: 'w-24',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'libelle',
    label: 'Libellé',
    width: 'w-64',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'enStock',
    label: 'En Stock',
    width: 'w-20',
    align: 'right',
    sortable: true,
    type: 'number'
  },
  {
    key: 'cmup',
    label: 'CMUP',
    width: 'w-24',
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
    key: 'prix',
    label: 'Prix',
    width: 'w-24',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'valSupGros',
    label: 'Val SupGros',
    width: 'w-28',
    align: 'right',
    sortable: true,
    type: 'currency'
  },
  {
    key: 'prixGros',
    label: 'Prix',
    width: 'w-24',
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
    key: 'demi',
    label: 'Demi',
    width: 'w-20',
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
  }
];

// Données d'exemple basées sur votre image
const mockStockData: GenericTableItem[] = [
  {
    id: '1',
    code: '110004',
    libelle: 'LUSTRE EN CRISTAL REF',
    enStock: 1.00,
    cmup: 94998.00,
    valStock: 94998.00,
    prix: 140000.00,
    valSupGros: 140000.00,
    prixGros: 150000.00,
    valGros: 150000.00,
    demi: 160000.00,
    valDemi: 160000.00,
    isStarred: false
  },
  {
    id: '2',
    code: 'A17401',
    libelle: 'ABAT-JOUR WC ROND',
    enStock: 1.00,
    cmup: 3714.00,
    valStock: 3714.00,
    prix: 10000.00,
    valSupGros: 10000.00,
    prixGros: 11000.00,
    valGros: 11000.00,
    demi: 11500.00,
    valDemi: 11500.00,
    isStarred: true
  },
  {
    id: '3',
    code: 'A0004',
    libelle: 'ABATTANT WC BLANC',
    enStock: 29.00,
    cmup: 2221.00,
    valStock: 64409.00,
    prix: 3500.00,
    valSupGros: 101500.00,
    prixGros: 4000.00,
    valGros: 116000.00,
    demi: 4500.00,
    valDemi: 130500.00,
    isStarred: false
  },
  {
    id: '4',
    code: 'B0005',
    libelle: 'ABATTANT WC BLANC',
    enStock: 1.00,
    cmup: 4650.00,
    valStock: 4650.00,
    prix: 7950.00,
    valSupGros: 7950.00,
    prixGros: 8100.00,
    valGros: 8100.00,
    demi: 8200.00,
    valDemi: 8200.00,
    isStarred: false
  },
  {
    id: '5',
    code: 'A230004',
    libelle: 'ABSORBEUR D ENERGIE',
    enStock: 1.00,
    cmup: 10999.00,
    valStock: 10999.00,
    prix: 12500.00,
    valSupGros: 12500.00,
    prixGros: 15000.00,
    valGros: 15000.00,
    demi: 16000.00,
    valDemi: 16000.00,
    isStarred: false
  }
];

interface StockTableViewProps {
  onItemSelected?: (items: string[]) => void;
  onItemView?: (itemId: string) => void;
  onItemEdit?: (itemId: string) => void;
  onItemDelete?: (itemId: string) => void;
}

export function StockTableView({ 
  onItemSelected, 
  onItemView, 
  onItemEdit, 
  onItemDelete 
}: StockTableViewProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [items, setItems] = useState<GenericTableItem[]>(mockStockData);

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedItems, itemId]
      : selectedItems.filter(id => id !== itemId);
    
    setSelectedItems(newSelected);
    onItemSelected?.(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? items.map(item => item.id) : [];
    setSelectedItems(newSelected);
    onItemSelected?.(newSelected);
  };

  const handleToggleStar = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, isStarred: !item.isStarred }
        : item
    ));
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

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-hidden">
        <GenericTable
          items={items}
          columns={stockColumns}
          selectedItems={selectedItems}
          hoveredItem={hoveredItem}
          showSelection={true}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onToggleStar={handleToggleStar}
          onHoverItem={setHoveredItem}
          onSort={handleSort}
          onView={onItemView}
          onEdit={onItemEdit}
          onDelete={onItemDelete}
        />
      </div>
      
      {selectedItems.length > 0 && (
        <div className="px-4 py-2 bg-[#e8f0fe] border-t border-[#e8eaed] text-sm text-[#1a73e8]">
          {selectedItems.length} élément(s) sélectionné(s)
        </div>
      )}
    </div>
  );
}
