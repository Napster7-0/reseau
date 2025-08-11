"use client";

import React, { useState, useCallback } from 'react';
import { GenericTable, TableColumn, GenericTableItem } from '../../_ui/generic-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarDays, Filter, Search } from 'lucide-react';

// Composant d'en-tête avec filtres pour le journal
function JournalFiltersHeader() {
    const [dateFrom, setDateFrom] = useState('28-May-25');
    const [dateTo, setDateTo] = useState('28-May-25');
    const [movementSource, setMovementSource] = useState('all');
    const [warehouse, setWarehouse] = useState('all');
    const [customMovement, setCustomMovement] = useState('');

    return (
        <div className="bg-white border-b border-[#e8eaed] font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]">
            {/* En-tête principal */}
            <div className="flex items-center justify-between p-4 pt-2 border-b border-[#e8eaed]">
                <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-[#5f6368]" />
                    <h1 className="text-lg font-medium text-[#202124]">Critères d'analyse du journal</h1>
                </div>
                <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[80px]">Date entre:</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={dateFrom}
                                    onChange={e => setDateFrom(e.target.value)}
                                    className="h-9 w-32 border-[#dadce0] focus:border-[#1a73e8] text-sm"
                                    placeholder="DD-MMM-YY"
                                />
                                <span className="text-sm text-[#5f6368]">et</span>
                                <Input 
                                    value={dateTo}
                                    onChange={e => setDateTo(e.target.value)}
                                    className="h-9 w-32 border-[#dadce0] focus:border-[#1a73e8] text-sm"
                                    placeholder="DD-MMM-YY"
                                />
                            </div>
                        </div>
                    </div>
            </div>

            {/* Section des filtres */}
            <div className="p-4 space-y-4">
                {/* Première ligne : Dates et Source mouvement */}
                <div className="flex gap-8 items-center">
                    {/* Source mouvement */}
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[120px]">Source mouvement</Label>
                            <div className="space-y-3">
                                <RadioGroup value={movementSource} onValueChange={setMovementSource} className="space-y-3">
                                    <div className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="all" id="all" className="h-4 w-4" />
                                            <Label htmlFor="all" className="text-sm text-[#202124] cursor-pointer">Tout(e)s</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="exits" id="exits" className="h-4 w-4" />
                                            <Label htmlFor="exits" className="text-sm text-[#202124] cursor-pointer">Sorties</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="entries" id="entries" className="h-4 w-4" />
                                            <Label htmlFor="entries" className="text-sm text-[#202124] cursor-pointer">Entrées</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {/* Magasin */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[60px]">Magasin</Label>
                            <Select value={warehouse} onValueChange={setWarehouse}>
                                <SelectTrigger className="h-9 w-48 border-[#dadce0] focus:border-[#1a73e8] bg-white">
                                    <SelectValue placeholder="Toute" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toute</SelectItem>
                                    <SelectItem value="entrepot-a">Entrepôt A</SelectItem>
                                    <SelectItem value="entrepot-b">Entrepôt B</SelectItem>
                                    <SelectItem value="magasin-central">Magasin Central</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        className="border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]"
                    >
                        Réinitialiser
                    </Button>
                    <Button className="bg-[#1a73e8] hover:bg-[#1557b0] text-white">
                        <Search className="mr-2 h-4 w-4" />
                        Appliquer les filtres
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Colonnes pour les transferts
const transferColumns: TableColumn[] = [
  {
    key: 'transferNumber',
    label: 'N° Transfert',
    width: 'w-24',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'fromLocation',
    label: 'De',
    width: 'w-32',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'toLocation',
    label: 'Vers',
    width: 'w-32',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'quantity',
    label: 'Quantité',
    width: 'w-20',
    align: 'right',
    sortable: true,
    type: 'number'
  },
  {
    key: 'date',
    label: 'Date',
    width: 'w-24',
    align: 'center',
    sortable: true,
    type: 'date'
  },
  {
    key: 'status',
    label: 'Statut',
    width: 'w-24',
    align: 'center',
    sortable: true,
    type: 'text'
  }
];

// Colonnes pour les transformations
const transformationColumns: TableColumn[] = [
  {
    key: 'transformationNumber',
    label: 'N° Transformation',
    width: 'w-32',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'outputProduct',
    label: 'Produit Final',
    width: 'w-48',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'quantity',
    label: 'Quantité',
    width: 'w-20',
    align: 'right',
    sortable: true,
    type: 'number'
  },
  {
    key: 'date',
    label: 'Date',
    width: 'w-24',
    align: 'center',
    sortable: true,
    type: 'date'
  },
  {
    key: 'status',
    label: 'Statut',
    width: 'w-24',
    align: 'center',
    sortable: true,
    type: 'text'
  }
];

// Colonnes pour le journal
const journalColumns: TableColumn[] = [
  {
    key: 'movementNumber',
    label: 'N° Mouvement',
    width: 'w-32',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'type',
    label: 'Type',
    width: 'w-20',
    align: 'center',
    sortable: true,
    type: 'text'
  },
  {
    key: 'product',
    label: 'Produit',
    width: 'w-48',
    align: 'left',
    sortable: true,
    type: 'text'
  },
  {
    key: 'quantity',
    label: 'Quantité',
    width: 'w-20',
    align: 'right',
    sortable: true,
    type: 'number'
  },
  {
    key: 'date',
    label: 'Date/Heure',
    width: 'w-32',
    align: 'center',
    sortable: true,
    type: 'text'
  }
];

// Données mock pour chaque onglet
const transferData: GenericTableItem[] = [
  {
    id: '1',
    transferNumber: 'T001',
    fromLocation: 'Entrepôt A',
    toLocation: 'Entrepôt B',
    quantity: 10,
    date: '2024-08-03',
    status: 'Terminé',
    isStarred: false,
    isImportant: true
  },
  {
    id: '2',
    transferNumber: 'T002',
    fromLocation: 'Entrepôt B',
    toLocation: 'Entrepôt C',
    quantity: 5,
    date: '2024-08-02',
    status: 'En attente',
    isStarred: false,
    isImportant: false
  }
];

const transformationData: GenericTableItem[] = [
  {
    id: '1',
    transformationNumber: 'TR001',
    outputProduct: 'Kit Bureau Complet',
    quantity: 5,
    date: '2024-08-03',
    status: 'Terminé',
    isStarred: false,
    isImportant: true
  }
];

const journalData: GenericTableItem[] = [
  {
    id: '1',
    movementNumber: 'M001',
    type: 'Entrée',
    product: 'Dell XPS 13',
    quantity: 20,
    date: '3 août 14:30',
    isStarred: false,
    isImportant: false
  },
  {
    id: '2',
    movementNumber: 'M002',
    type: 'Sortie',
    product: 'Dell XPS 13',
    quantity: -5,
    date: '3 août 10:15',
    isStarred: false,
    isImportant: false
  }
];

// Composant générique pour créer des onglets de tableau
const createTableTab = (
  tabName: string, 
  columns: TableColumn[], 
  mockData: GenericTableItem[]
) => {
  return function TableTab({
    selectedItems,
    hoveredItem,
    onSelectItem,
    onToggleStar,
    onHoverItem
  }: {
    selectedItems: string[];
    hoveredItem: string | null;
    onSelectItem: (itemId: string, checked: boolean) => void;
    onToggleStar: (itemId: string) => void;
    onHoverItem: (itemId: string | null) => void;
  }) {
    const [items, setItems] = useState<GenericTableItem[]>(mockData);
    const [sortColumn, setSortColumn] = useState<string>(columns[0]?.key || '');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
      console.log(`Voir détails ${tabName.toLowerCase()}:`, itemId);
    }, []);

    const handleEdit = useCallback((itemId: string) => {
      console.log(`Modifier ${tabName.toLowerCase()}:`, itemId);
    }, []);

    const handleDelete = useCallback((itemId: string) => {
      console.log(`Supprimer ${tabName.toLowerCase()}:`, itemId);
    }, []);

    return (
      <GenericTable
        items={items}
        columns={columns}
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
  };
};

// Export des composants
export const TransferTab = createTableTab('Transfert', transferColumns, transferData);
export const TransformationTab = createTableTab('Transformation', transformationColumns, transformationData);

// Composant Journal spécialisé avec en-tête de filtres
export function JournalTab({
  selectedItems,
  hoveredItem,
  onSelectItem,
  onToggleStar,
  onHoverItem
}: {
  selectedItems: string[];
  hoveredItem: string | null;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onToggleStar: (itemId: string) => void;
  onHoverItem: (itemId: string | null) => void;
}) {
  const [items, setItems] = useState<GenericTableItem[]>(journalData);
  const [sortColumn, setSortColumn] = useState<string>(journalColumns[0]?.key || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
    console.log(`Voir détails journal:`, itemId);
  }, []);

  const handleEdit = useCallback((itemId: string) => {
    console.log(`Modifier journal:`, itemId);
  }, []);

  const handleDelete = useCallback((itemId: string) => {
    console.log(`Supprimer journal:`, itemId);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* En-tête avec filtres */}
      <JournalFiltersHeader />
      
      {/* Tableau des données */}
      <div className="flex-1 overflow-hidden">
        <GenericTable
          items={items}
          columns={journalColumns}
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
      </div>
    </div>
  );
}
