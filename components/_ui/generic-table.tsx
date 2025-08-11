"use client";

import React, { useState, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  StarOff,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown
} from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'status';
  format?: (value: any) => string;
}

export interface GenericTableItem {
  id: string;
  isStarred?: boolean;
  isImportant?: boolean;
  [key: string]: any; // Propriétés dynamiques selon les colonnes
}

interface TableHeaderProps {
  columns: TableColumn[];
  onSort?: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  showSelection?: boolean;
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
}

function TableHeader({
  columns,
  onSort,
  sortColumn,
  sortDirection,
  showSelection = true,
  selectedCount,
  totalCount,
  onSelectAll
}: TableHeaderProps) {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="flex items-center bg-[#f8f9fa] border-b border-[#e8eaed] px-4 py-3 text-sm font-medium text-[#202124] min-w-max">
      {showSelection && (
        <div className="flex items-center justify-center w-12 flex-shrink-0">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            className="opacity-70"
          />
        </div>
      )}
      
      {columns.map((column) => (
        <div
          key={column.key}
          className={`flex items-center ${column.width || 'flex-1 min-w-32'} flex-shrink-0 ${
            column.align === 'center' ? 'justify-center' : 
            column.align === 'right' ? 'justify-end' : 'justify-start'
          }`}
        >
          {column.sortable && onSort ? (
            <Button
              variant="ghost"
              className="h-auto p-1 font-medium text-[#202124] hover:text-[#1a73e8]"
              onClick={() => onSort(column.key)}
            >
              {column.label}
              {sortColumn === column.key && (
                <ArrowUpDown className={`ml-1 h-3 w-3 ${
                  sortDirection === 'desc' ? 'rotate-180' : ''
                }`} />
              )}
            </Button>
          ) : (
            <span>{column.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

interface TableRowProps {
  item: GenericTableItem;
  columns: TableColumn[];
  isSelected: boolean;
  isHovered: boolean;
  showSelection?: boolean;
  onSelect: (itemId: string, checked: boolean) => void;
  onToggleStar?: (itemId: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onView?: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
}

function TableRow({
  item,
  columns,
  isSelected,
  isHovered,
  showSelection = true,
  onSelect,
  onToggleStar,
  onMouseEnter,
  onMouseLeave,
  onView,
  onEdit,
  onDelete
}: TableRowProps) {
  const [actionPosition, setActionPosition] = React.useState<number>(0);
  const rowRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      setActionPosition(rect.top + rect.height / 2);
    }
    onMouseEnter();
  };

  const formatValue = (value: any, column: TableColumn) => {
    if (column.format) {
      return column.format(value);
    }
    
    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        }).format(value || 0);
      case 'number':
        return new Intl.NumberFormat('fr-FR').format(value || 0);
      case 'date':
        return value ? new Date(value).toLocaleDateString('fr-FR') : '';
      default:
        return value || '';
    }
  };

  const getCellColor = (value: any, column: TableColumn) => {
    if (column.type === 'number' || column.type === 'currency') {
      const numValue = parseFloat(value);
      if (numValue < 0) return 'text-red-600';
      if (numValue === 0) return 'text-yellow-600';
    }
    return 'text-[#202124]';
  };

  return (
    <div
      ref={rowRef}
      className={`relative flex items-center px-4 py-2 border-b border-gray-100 hover:bg-[#f8f9fa] cursor-pointer group transition-all duration-150 min-w-max ${
        isSelected ? 'bg-[#e8f0fe]' : 'bg-white'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showSelection && (
        <div className="flex items-center justify-center w-12 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(item.id, !!checked)}
              className="opacity-60 group-hover:opacity-100"
            />
            
            {onToggleStar && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 opacity-60 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(item.id);
                }}
              >
                {item.isStarred ? (
                  <Star className="h-3 w-3 fill-[#fbbc04] text-[#fbbc04]" />
                ) : (
                  <StarOff className="h-3 w-3 text-[#5f6368] hover:text-[#fbbc04]" />
                )}
              </Button>
            )}
          </div>
          
          {item.isImportant && (
            <div className="w-1 h-4 bg-[#fbbc04] rounded-full ml-1" />
          )}
        </div>
      )}
      
      {columns.map((column) => (
        <div
          key={column.key}
          className={`${column.width || 'flex-1 min-w-32'} flex-shrink-0 ${
            column.align === 'center' ? 'text-center' : 
            column.align === 'right' ? 'text-right' : 'text-left'
          } ${getCellColor(item[column.key], column)} text-sm px-2`}
        >
          {formatValue(item[column.key], column)}
        </div>
      ))}
      
      {/* Actions au survol à l'extrême droite de l'écran */}
      <div 
        className="fixed right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-inherit p-1 z-50"
        style={{ 
          top: `${actionPosition}px`, 
          transform: 'translateY(-50%)'
        }}
      >
        <div className="flex items-center gap-1">
          {onView && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 hover:bg-gray-100" 
              onClick={(e) => {
                e.stopPropagation();
                onView(item.id);
              }}
            >
              <Eye className="h-3 w-3 text-[#5f6368]" />
            </Button>
          )}
          {onEdit && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 hover:bg-gray-100" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item.id);
              }}
            >
              <Edit className="h-3 w-3 text-[#5f6368]" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 hover:bg-red-50 hover:text-red-600" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface GenericTableProps {
  items: GenericTableItem[];
  columns: TableColumn[];
  selectedItems: string[];
  hoveredItem: string | null;
  showSelection?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSelectItem: (itemId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStar?: (itemId: string) => void;
  onHoverItem: (itemId: string | null) => void;
  onSort?: (column: string) => void;
  onView?: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
}

export function GenericTable({
  items,
  columns,
  selectedItems,
  hoveredItem,
  showSelection = true,
  sortColumn,
  sortDirection,
  onSelectItem,
  onSelectAll,
  onToggleStar,
  onHoverItem,
  onSort,
  onView,
  onEdit,
  onDelete
}: GenericTableProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <TableHeader
            columns={columns}
            onSort={onSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            showSelection={showSelection}
            selectedCount={selectedItems.length}
            totalCount={items.length}
            onSelectAll={onSelectAll}
          />
          
          <div className="flex-1 overflow-y-auto">
            {items.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                columns={columns}
                isSelected={selectedItems.includes(item.id)}
                isHovered={hoveredItem === item.id}
                showSelection={showSelection}
                onSelect={onSelectItem}
                onToggleStar={onToggleStar}
                onMouseEnter={() => onHoverItem(item.id)}
                onMouseLeave={() => onHoverItem(null)}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
