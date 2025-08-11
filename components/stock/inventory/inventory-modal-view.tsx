"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Inventory, InventoryItem } from '@/types/stock';
import { InventoryDetailView } from './inventory-detail-view';

interface InventoryModalViewProps {
    inventory: Inventory | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (inventoryId: string, items: InventoryItem[]) => void;
    onValidate: (inventory: Inventory) => void;
}

export function InventoryModalView({
    inventory,
    isOpen,
    onClose,
    onSave,
    onValidate
}: InventoryModalViewProps) {
    if (!isOpen || !inventory) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[90%] h-[90%] max-w-6xl overflow-hidden">
                <div className="p-4 border-b border-[#e8eaed] flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[#202124]">
                        Détails de l'inventaire - {inventory.reference}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            size="sm"
                            className="border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]"
                        >
                            Fermer
                        </Button>
                    </div>
                </div>
                <div className="p-4 h-[calc(100%-80px)] overflow-auto">
                    <InventoryDetailView 
                        key={inventory.id}
                        inventory={inventory}
                        onSave={onSave}
                        onValidate={() => onValidate(inventory)}
                    />
                </div>
            </div>
        </div>
    );
}
