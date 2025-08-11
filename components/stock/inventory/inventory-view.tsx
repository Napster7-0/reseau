"use client";

import React, { useState, useCallback } from 'react';
import { Inventory, Warehouse, InventoryItem } from '@/types/stock';
import { Product } from '@/types/core';
import { InventoryListView } from './inventory-list-view';
import { InventoryModalView } from './inventory-modal-view';
import { updateInventory, createInventory, updateProduct, getInventories } from '@/lib/api';

interface InventoryViewProps {
    initialInventories: Inventory[];
    products: Product[];
    warehouses: Warehouse[];
}

export function InventoryView({ initialInventories, products, warehouses }: InventoryViewProps) {
    const [inventories, setInventories] = useState<Inventory[]>(initialInventories);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    const refreshInventories = useCallback(async () => {
        const data = await getInventories();
        setInventories(data);
    }, []);

    const handleCreateInventory = async (data: { 
        warehouseId: string; 
        type: Inventory['type'];
        date: Date;
        code: string;
        description: string;
        notes: string;
        items: { productId: string; theoreticalQty: number; physicalQty: number | null }[];
    }) => {
        // Utiliser les items du formulaire directement
        const inventoryItems = data.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                productCode: product?.code || '',
                productName: product?.name || '',
                theoreticalQty: item.theoreticalQty,
                physicalQty: item.physicalQty,
            };
        });

        const newInventory: Omit<Inventory, 'id'> = {
            reference: data.code,
            warehouseId: data.warehouseId,
            date: data.date.toISOString(),
            status: 'En cours',
            type: data.type,
            notes: data.notes,
            items: inventoryItems,
            createdBy: 'user-001', // À remplacer par l'utilisateur connecté
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            itemsCount: inventoryItems.length,
            completionPercentage: 0,
            priority: data.type === 'Annuel' ? 'high' : 'medium'
        };

        try {
            await createInventory(newInventory);
            await refreshInventories();
        } catch (error) {
            console.error("Failed to create inventory", error);
        }
    };
    
    const handleSaveInventoryItems = async (inventoryId: string, items: InventoryItem[]) => {
        try {
            const updated = await updateInventory(inventoryId, { items });
            setSelectedInventory(updated);
            await refreshInventories();
        } catch (error) {
            console.error("Failed to save inventory items", error);
        }
    };

    const handleValidateInventory = async (inventory: Inventory) => {
        if (!window.confirm(`Voulez-vous vraiment valider l'inventaire ${inventory.reference} ? Cette action mettra à jour les stocks et est irréversible.`)) {
            return;
        }
        try {
            const stockUpdates = inventory.items
                .filter(item => item.physicalQty !== null && item.physicalQty !== item.theoreticalQty)
                .map(item => updateProduct(item.productId, { stock: item.physicalQty! }));
            
            await Promise.all(stockUpdates);
            await updateInventory(inventory.id, { status: 'Validé' });
            await refreshInventories();
            setIsDetailModalOpen(false);
            setSelectedInventory(null);
            alert("Inventaire validé et stocks mis à jour !");
        } catch (error) {
            console.error("Failed to validate inventory", error);
        }
    };

    const handleInventorySelect = (inventory: Inventory) => {
        setSelectedInventory(inventory);
        setIsDetailModalOpen(true);
    };

    const handleInventoryValidate = async (inventoryId: string) => {
        const inventory = inventories.find(inv => inv.id === inventoryId);
        if (inventory) {
            await handleValidateInventory(inventory);
        }
    };

    const handleInventoryDelete = async (inventoryId: string) => {
        console.log('Supprimer inventaire:', inventoryId);
        // Implémentation de la suppression
        await refreshInventories();
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedInventory(null);
    };

    return (
        <>
            <InventoryListView
                inventories={inventories}
                warehouses={warehouses}
                products={products}
                onInventorySelect={handleInventorySelect}
                onInventoryCreate={handleCreateInventory}
                onInventoryValidate={handleInventoryValidate}
                onInventoryDelete={handleInventoryDelete}
                selectedInventoryId={selectedInventory?.id}
            />

            <InventoryModalView
                inventory={selectedInventory}
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveInventoryItems}
                onValidate={handleValidateInventory}
            />
        </>
    );
}