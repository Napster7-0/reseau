"use client";

import React, { useState, useCallback } from 'react';
import { GenericTable, TableColumn, GenericTableItem } from '../../_ui/generic-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Inventory, Warehouse } from '@/types/stock';
import { Product } from '@/types/core';
import { NewInventoryDialog } from './new-inventory-dialog';

interface InventoryListViewProps {
    inventories: Inventory[];
    warehouses: Warehouse[];
    products: Product[];
    onInventorySelect: (inventory: Inventory) => void;
    onInventoryCreate: (data: { 
        warehouseId: string; 
        type: Inventory['type'];
        date: Date;
        code: string;
        description: string;
        notes: string;
        items: { productId: string; theoreticalQty: number; physicalQty: number | null }[];
    }) => void;
    onInventoryValidate: (inventoryId: string) => void;
    onInventoryDelete: (inventoryId: string) => void;
    selectedInventoryId?: string;
}

// Définition des colonnes pour le tableau d'inventaires
const inventoryColumns: TableColumn[] = [
    {
        key: 'code',
        label: 'Code',
        width: 'w-48',
        align: 'left',
        sortable: true,
        type: 'text'
    },
    {
        key: 'libelle',
        label: 'Libelle',
        width: 'w-48',
        align: 'left',
        sortable: true,
        type: 'text'
    },
    {
        key: 'dateInv',
        label: 'Date Inv',
        width: 'w-24',
        align: 'center',
        sortable: true,
        type: 'date'
    },
    {
        key: 'typeInv',
        label: 'TypeInv',
        width: 'w-20',
        align: 'center',
        sortable: true,
        type: 'text'
    },
    {
        key: 'magasin',
        label: 'Magasin',
        width: 'w-48',
        align: 'left',
        sortable: true,
        type: 'text'
    },
    {
        key: 'status',
        label: 'Status',
        width: 'w-32',
        align: 'center',
        sortable: true,
        type: 'text'
    }
];

// Fonction pour transformer les données d'inventaire en items de tableau
const transformInventoryToTableItem = (inventory: Inventory, warehouses: Warehouse[]): GenericTableItem => {
    const warehouse = warehouses.find(w => w.id === inventory.warehouseId);
    
    return {
        id: inventory.id,
        code: inventory.reference,
        libelle: inventory.type,
        dateInv: new Date(inventory.date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        }),
        typeInv: inventory.type,
        magasin: warehouse?.name || 'N/A',
        status: inventory.status,
        isStarred: false,
        isImportant: inventory.status === 'En cours'
    };
};

export function InventoryListView({ 
    inventories, 
    warehouses, 
    products,
    onInventorySelect, 
    onInventoryCreate,
    onInventoryValidate,
    onInventoryDelete,
}: InventoryListViewProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState<string>('dateInv');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    
    // Transformer les données pour le tableau
    const tableItems = inventories.map(inv => transformInventoryToTableItem(inv, warehouses));

    // Gestion des actions du tableau
    const handleSelectItem = (itemId: string, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, itemId]);
        } else {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(tableItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleToggleStar = (itemId: string) => {
        console.log('Toggle star for:', itemId);
    };

    const handleHoverItem = (itemId: string | null) => {
        setHoveredItem(itemId);
    };

    const handleSort = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);
    };

    // Actions spécifiques aux inventaires
    const handleView = useCallback((itemId: string) => {
        const inventory = inventories.find(inv => inv.id === itemId);
        if (inventory) {
            onInventorySelect(inventory);
        }
    }, [inventories, onInventorySelect]);

    const handleEdit = useCallback((itemId: string) => {
        const inventory = inventories.find(inv => inv.id === itemId);
        if (inventory && inventory.status === 'En cours') {
            onInventorySelect(inventory);
        } else {
            alert('Seuls les inventaires en cours peuvent être modifiés.');
        }
    }, [inventories, onInventorySelect]);

    // const handleValidate = useCallback((itemId: string) => {
    //     const inventory = inventories.find(inv => inv.id === itemId);
    //     if (inventory && inventory.status === 'En cours') {
    //         onInventoryValidate(itemId);
    //     } else {
    //         alert('Seuls les inventaires en cours peuvent être validés.');
    //     }
    // }, [inventories, onInventoryValidate]);

    // const handlePrint = useCallback((itemId: string) => {
    //     console.log('Imprimer inventaire:', itemId);
    //     // Implémentation de l'impression
    // }, []);

    const handleDelete = useCallback((itemId: string) => {
        const inventory = inventories.find(inv => inv.id === itemId);
        if (inventory && inventory.status === 'En cours') {
            if (window.confirm(`Voulez-vous vraiment supprimer l'inventaire ${inventory.reference} ?`)) {
                onInventoryDelete(itemId);
            }
        } else {
            alert('Seuls les inventaires en cours peuvent être supprimés.');
        }
    }, [inventories, onInventoryDelete]);

    const handleCreateInventory = async (data: { 
        warehouseId: string; 
        type: Inventory['type'];
        date: Date;
        code: string;
        description: string;
        notes: string;
        items: { productId: string; theoreticalQty: number; physicalQty: number | null }[];
    }) => {
        onInventoryCreate(data);
        setIsNewDialogOpen(false);
    };

    return (
        <div className="h-full bg-white font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]">
            {/* En-tête avec bouton nouveau */}
            <div className="flex items-center justify-between p-4 pt-2 border-b border-[#e8eaed]">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-medium text-[#202124]">Liste des inventaires</h1>
                </div>
                <Button 
                    onClick={() => setIsNewDialogOpen(true)}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau
                </Button>
            </div>

            {/* Tableau des inventaires */}
            <div className="flex-1 overflow-hidden">
                <GenericTable
                    items={tableItems}
                    columns={inventoryColumns}
                    selectedItems={selectedItems}
                    hoveredItem={hoveredItem}
                    showSelection={true}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSelectItem={handleSelectItem}
                    onSelectAll={handleSelectAll}
                    onToggleStar={handleToggleStar}
                    onHoverItem={handleHoverItem}
                    onSort={handleSort}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Dialog de création */}
            <NewInventoryDialog 
                isOpen={isNewDialogOpen}
                onClose={() => setIsNewDialogOpen(false)}
                warehouses={warehouses}
                products={products}
                onSubmit={handleCreateInventory}
            />
        </div>
    );
}
