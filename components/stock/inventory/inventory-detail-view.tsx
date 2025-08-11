"use client";

import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Inventory, InventoryItem } from '@/types/stock';
import { ColumnDef } from '@tanstack/react-table';
import { Save, CheckCircle, Printer} from 'lucide-react';
import { format } from 'date-fns';

interface InventoryDetailViewProps {
    inventory: Inventory;
    onSave: (inventoryId: string, items: InventoryItem[]) => void;
    onValidate: (inventory: Inventory) => void;
}

export function InventoryDetailView({ inventory, onSave, onValidate }: InventoryDetailViewProps) {
    const isReadOnly = inventory.status === 'Validé';
    const form = useForm<{ items: InventoryItem[] }>({
        defaultValues: { items: inventory.items }
    });
    const { control, handleSubmit } = form;
    const { fields } = useFieldArray({ control, name: "items" });

    const columns: ColumnDef<InventoryItem>[] = [
        { accessorKey: "productCode", header: "Code" },
        { accessorKey: "productName", header: "Libellé", cell: ({row}) => <div className='w-[250px] truncate'>{row.original.productName}</div>},
        { accessorKey: "theoreticalQty", header: "Stock Mach.", cell: ({row}) => <div className='text-center'>{row.original.theoreticalQty}</div>},
        {
            accessorKey: 'physicalQty', header: 'Stock Phys.', cell: ({ row, table }) => (
                <Controller
                    control={control}
                    name={`items.${row.index}.physicalQty`}
                    render={({ field }) => (
                        <Input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                            className="w-24 text-center"
                            readOnly={isReadOnly}
                        />
                    )}
                />
            )
        },
        {
            id: 'discrepancy', header: 'Écart', cell: ({ row }) => {
                const physical = row.original.physicalQty;
                const theoretical = row.original.theoreticalQty;
                const discrepancy = physical !== null ? physical - theoretical : null;
                const color = discrepancy === null ? '' : discrepancy > 0 ? 'text-green-600' : discrepancy < 0 ? 'text-red-600' : '';
                return <div className={`text-center font-bold ${color}`}>{discrepancy}</div>;
            }
        }
    ];

    const onSubmit = (data: { items: InventoryItem[] }) => {
        onSave(inventory.id, data.items);
    };

    const getStatusBadgeColor = () => {
        switch(inventory.status) {
            case 'En cours': return 'bg-[#fef7cd] text-[#b45309] border-[#fcd34d]';
            case 'Validé': return 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]';
            case 'Annulé': return 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]';
            default: return 'bg-[#f3f4f6] text-[#374151] border-[#d1d5db]';
        }
    };

    return (
        <div className="h-full bg-white font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]">
            {/* En-tête principal */}
            <div className="flex items-center justify-between p-4 pt-2 border-b border-[#e8eaed]">
                <div className="flex items-center gap-3">
                    {inventory.status === 'En cours' && (
                        <Button 
                            onClick={() => onValidate(inventory)}
                            className="bg-[#137333] hover:bg-[#0d5016] text-white"
                            size="sm"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Valider l&apos;inventaire
                        </Button>
                    )}
                </div>
            </div>

            {/* Section d'informations de l'inventaire */}
            <div className="p-4 border-b border-[#e8eaed] bg-white">
                <div className="space-y-3">
                    {/* Première ligne : Type, Magasin, Dates */}
                    <div className="flex gap-8 items-center">
                        {/* Type Inventaire */}
                        <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[100px]">Type Inventaire :</Label>
                            <div className="min-w-[150px] px-3 py-2 border border-[#dadce0] rounded bg-[#f8f9fa] text-sm">
                                {inventory.type}
                            </div>
                        </div>

                        {/* Magasin */}
                        <div className="flex items-center gap-3 flex-1">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[60px]">Magasin :</Label>
                            <div className="flex-1 px-3 py-2 border border-[#dadce0] rounded bg-[#f8f9fa] text-sm">
                                ENTREPOT MOKOLO II
                            </div>
                        </div>

                        {/* Date création */}
                        <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[90px]">Date création :</Label>
                            <div className="min-w-[100px] px-3 py-2 border border-[#dadce0] rounded bg-[#f8f9fa] text-sm text-center">
                                {format(new Date(inventory.date), 'dd-MMM-yy')}
                            </div>
                        </div>

                        {/* Date dern. MAJ */}
                        <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[90px]">Date dern. MAJ :</Label>
                            <div className="min-w-[100px] px-3 py-2 border border-[#dadce0] rounded bg-[#f8f9fa] text-sm text-center">
                                {format(new Date(inventory.date), 'dd-MMM-yy')}
                            </div>
                        </div>
                    </div>

                    {/* Deuxième ligne : Code et Description */}
                    <div className="flex gap-8 items-center">
                        {/* Code */}
                        <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[100px]">Code :</Label>
                            <div className="min-w-[150px] px-3 py-2 border border-[#dadce0] rounded bg-[#f8f9fa] text-sm font-mono">
                                {inventory.reference}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex items-center gap-3 flex-1">
                            <Label className="text-sm font-medium text-[#5f6368] min-w-[80px]">Description :</Label>
                            <div className="flex-1 px-3 py-2 border border-[#dadce0] rounded bg-[#f8f9fa] text-sm">
                                sortie de Mr YEMDJI Nestor
                            </div>
                        </div>
                    </div>

                    {/* Troisième ligne : Notes */}
                    <div className="flex items-start gap-3">
                        <Label className="text-sm font-medium text-[#5f6368] min-w-[100px] mt-2">Notes :</Label>
                        <div className="flex-1 px-3 py-2 border border-[#dadce0] rounded bg-[#f8f9fa] text-sm min-h-[40px]">
                            Entree de Mr DJEBAYI Marcel
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal - Tableau des items */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <form id={`inventory-form-${inventory.id}`} onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <DataTable columns={columns} data={fields} />
                    </div>
                    
                    {/* Footer avec actions */}
                    <div className="flex items-center justify-between p-4 border-t border-[#e8eaed] bg-[#f8f9fa]">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-[#5f6368]">Statut :</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor()}`}>
                                {inventory.status}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                type="button"
                                variant="outline" 
                                className="border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]"
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimer
                            </Button>
                            {!isReadOnly && (
                                <Button 
                                    type="submit" 
                                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Enregistrer les saisies
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}