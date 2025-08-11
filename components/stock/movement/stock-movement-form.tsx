"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/ui/data-table';
import { Product } from '@/types/core';
import { Warehouse, StockMovementItem } from '@/types/stock';
import { createStockMovement, updateProduct } from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2, Save, Package, ArrowUpCircle, ArrowDownCircle, RefreshCw, ChevronDown } from 'lucide-react';

interface StockMovementFormProps {
    products: Product[];
    warehouses: Warehouse[];
}

type FormValues = {
    type: 'entry' | 'exit' | 'transformation';
    warehouseId: string;
    reference: string;
    date: Date;
    notes: string;
    items: (StockMovementItem & { code: string; name: string, stock: number })[];
};

export function StockMovementForm({ products, warehouses }: StockMovementFormProps) {
    const [productCode, setProductCode] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    
    const form = useForm<FormValues>({
        defaultValues: { type: 'entry', warehouseId: '', reference: '', date: new Date(), notes: '', items: [] }
    });
    const { control, handleSubmit, setValue, getValues, reset } = form;
    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    const movementType = form.watch('type');
    const selectedProduct = useMemo(() => products.find(p => p.code === productCode), [products, productCode]);
    
    // Mettre à jour le prix unitaire quand un produit est sélectionné
    useEffect(() => {
        if (selectedProduct) {
            setUnitPrice(selectedProduct.costPrice);
        } else {
            setUnitPrice(0);
        }
    }, [selectedProduct]);

    const handleAddItem = useCallback(() => {
        if (!selectedProduct || quantity <= 0 || unitPrice <= 0) return;
        
        const existingItemIndex = fields.findIndex(item => item.productId === selectedProduct.id);
        
        if (existingItemIndex >= 0) {
            // Mise à jour de l'item existant
            const existingItem = fields[existingItemIndex];
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + quantity,
                costPrice: unitPrice
            };
            setValue(`items.${existingItemIndex}`, updatedItem);
        } else {
            // Ajout d'un nouvel item
            append({
                productId: selectedProduct.id,
                code: selectedProduct.code,
                name: selectedProduct.name,
                quantity,
                costPrice: unitPrice,
                stock: selectedProduct.stock || 0,
                stockBefore: selectedProduct.stock || 0,
                stockAfter: (selectedProduct.stock || 0) + (movementType === 'entry' ? quantity : -quantity)
            });
        }
        
        // Reset des champs
        setProductCode('');
        setQuantity(1);
        setUnitPrice(0);
    }, [selectedProduct, quantity, unitPrice, append, fields, setValue, movementType]);

    const onSubmit = async (data: FormValues) => {
        if (data.items.length === 0) {
            alert("Veuillez ajouter au moins un article.");
            return;
        }
        
        const newMovement = {
            type: data.type,
            reference: data.reference || `${data.type.toUpperCase()}-${Date.now()}`,
            date: data.date.toISOString(),
            warehouseId: data.warehouseId,
            notes: data.notes,
            items: data.items.map(({ productId, quantity, costPrice }) => ({ productId, quantity, costPrice }))
        };

        try {
            await createStockMovement(newMovement);
            
            const stockUpdates = data.items.map(item => {
                const newStock = data.type === 'entry' ? item.stock + item.quantity : item.stock - item.quantity;
                return updateProduct(item.productId, { stock: newStock });
            });
            await Promise.all(stockUpdates);

            alert("Mouvement de stock enregistré avec succès !");
            reset();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement du mouvement.");
        }
    };

    const columns: ColumnDef<any>[] = [
        { 
            accessorKey: "code", 
            header: "Code",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-[#202124]">{row.original.code}</span>
            )
        },
        { 
            accessorKey: "name", 
            header: "Libellé", 
            cell: ({ row }) => (
                <div className='w-[200px] truncate text-sm text-[#5f6368]'>{row.original.name}</div>
            )
        },
        { 
            accessorKey: "quantity", 
            header: "Qté",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-[#202124] text-center">{row.original.quantity}</span>
            )
        },
        { 
            accessorKey: "stockBefore", 
            header: "Solde Avt",
            cell: ({ row }) => (
                <span className="text-sm text-[#5f6368] text-center">{row.original.stockBefore || 0}</span>
            )
        },
        { 
            accessorKey: "stockAfter", 
            header: "Solde Après",
            cell: ({ row }) => (
                <span className="text-sm text-[#5f6368] text-center">{row.original.stockAfter || 0}</span>
            )
        },
        { 
            accessorKey: "costPrice", 
            header: "P. U.", 
            cell: ({ row }) => (
                <span className="text-sm text-[#5f6368] text-right">{row.original.costPrice.toLocaleString()} F</span>
            )
        },
        { 
            id: 'total', 
            header: 'Total', 
            cell: ({ row }) => (
                <span className="text-sm font-medium text-[#202124] text-right">
                    {(row.original.quantity * row.original.costPrice).toLocaleString()} F
                </span>
            )
        },
        { 
            id: 'actions', 
            header: '',
            cell: ({ row }) => (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => remove(row.index)}
                    className="h-8 w-8 p-0 hover:bg-[#f8f9fa] hover:text-[#d73025]"
                >
                    <Trash2 className="h-4 w-4"/>
                </Button>
            )
        }
    ];

    const getMovementIcon = () => {
        switch(movementType) {
            case 'entry': return <ArrowUpCircle className="h-4 w-4 text-[#137333]" />;
            case 'exit': return <ArrowDownCircle className="h-4 w-4 text-[#d73025]" />;
            case 'transformation': return <RefreshCw className="h-4 w-4 text-[#1a73e8]" />;
            default: return <Package className="h-4 w-4" />;
        }
    };

    const getMovementLabel = () => {
        switch(movementType) {
            case 'entry': return 'Entrée de Stock';
            case 'exit': return 'Sortie de Stock';  
            case 'transformation': return 'Transformation';
            default: return 'Mouvement';
        }
    };

    const totalValue = fields.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);

    return (
        <div className="h-full bg-white font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]">
            {/* Header avec sélecteur de type */}
            <div className="flex items-center justify-between p-4 pt-1 border-b border-[#e8eaed]">
                <div className="flex items-center gap-3">
                    {getMovementIcon()}
                    <h1 className="text-lg font-medium text-[#202124]">{getMovementLabel()}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-[#5f6368]">Type de mouvement:</span>
                    <FormField control={control} name="type" render={({field}) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-8 w-48 border-[#dadce0] focus:border-[#1a73e8] bg-white">
                                <div className="flex items-center gap-2">
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="entry" className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <ArrowUpCircle className="h-4 w-4 text-[#137333]" />
                                        Entrée de Stock
                                    </div>
                                </SelectItem>
                                <SelectItem value="exit" className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <ArrowDownCircle className="h-4 w-4 text-[#d73025]" />
                                        Sortie de Stock
                                    </div>
                                </SelectItem>
                                <SelectItem value="transformation" className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 text-[#1a73e8]" />
                                        Transformation
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    )}/>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="h-[calc(100%-80px)] flex flex-col">
                    {/* Configuration compacte */}
                    <div className="p-2 border-b border-[#e8eaed] bg-white">
                        <div className="space-y-2">
                            {/* Première ligne : Magasin et Référence */}
                            <div className="flex justify-between items-center">
                                {/* Magasin */}
                                <div className="flex items-center gap-3">
                                    <FormLabel className="text-sm font-medium text-[#5f6368] min-w-[60px]">Magasin</FormLabel>
                                    <FormField control={control} name="warehouseId" render={({field}) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="h-9 w-64 border-[#dadce0] focus:border-[#1a73e8]">
                                                    <SelectValue placeholder="Sélectionner..."/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warehouses.map(w => (
                                                        <SelectItem key={w.id} value={w.id} className="text-sm">
                                                            {w.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}/>
                                </div>

                                {/* Référence */}
                                <div className="flex items-center gap-3">
                                    <FormLabel className="text-sm font-medium text-[#5f6368] min-w-[70px]">Nos Références</FormLabel>
                                    <FormField control={control} name="reference" render={({field}) => (
                                        <FormItem>
                                            <Input 
                                                {...field} 
                                                className="h-9 w-64 border-[#dadce0] focus:border-[#1a73e8] text-sm"
                                                placeholder="Auto-généré si vide"
                                            />
                                        </FormItem>
                                    )}/>
                                </div>
                                {/* Référence */}
                                <div className="flex items-center gap-3">
                                    <FormLabel className="text-sm font-medium text-[#5f6368] min-w-[70px]">Vos Références</FormLabel>
                                    <FormField control={control} name="reference" render={({field}) => (
                                        <FormItem>
                                            <Input 
                                                {...field} 
                                                className="h-9 w-64 border-[#dadce0] focus:border-[#1a73e8] text-sm"
                                                placeholder="Auto-généré si vide"
                                            />
                                        </FormItem>
                                    )}/>
                                </div>
                            </div>

                            {/* Deuxième ligne : Notes sur toute la largeur */}
                            <div className="flex items-center gap-3">
                                <FormLabel className="text-sm font-medium text-[#5f6368] min-w-[60px]">Notes</FormLabel>
                                <FormField control={control} name="notes" render={({field}) => (
                                    <FormItem className="flex-1">
                                        <Input 
                                            {...field} 
                                            className="h-9 w-full border-[#dadce0] focus:border-[#1a73e8] text-sm"
                                            placeholder="Optionnel"
                                        />
                                    </FormItem>
                                )}/>
                            </div>
                        </div>
                    </div>

                    {/* Sélection de produit */}
                    <div className="p-4 border-b border-[#e8eaed]">
                        <div className="flex gap-3 items-center flex-wrap">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium text-[#5f6368] min-w-[40px]">Code</Label>
                                <Input 
                                    value={productCode} 
                                    onChange={e => setProductCode(e.target.value.toUpperCase())} 
                                    className="h-9 w-28 border-[#dadce0] focus:border-[#1a73e8] text-sm text-center font-mono"
                                    placeholder="Code"
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                <Label className="text-sm font-medium text-[#5f6368] min-w-[50px]">Libellé</Label>
                                <Input 
                                    value={selectedProduct?.name ?? ''} 
                                    readOnly 
                                    className="h-9 flex-1 bg-[#f8f9fa] border-[#dadce0] text-sm"
                                    placeholder="Libellé du produit"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium text-[#5f6368] min-w-[50px]">Stock</Label>
                                <Input 
                                    value={selectedProduct?.stock ?? 0} 
                                    readOnly 
                                    className="h-9 w-16 bg-[#f8f9fa] border-[#dadce0] text-sm text-center font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium text-[#5f6368] min-w-[40px]">Qté</Label>
                                <Input 
                                    type="number" 
                                    value={quantity} 
                                    onChange={e => setQuantity(Number(e.target.value))} 
                                    className="h-9 w-16 border-[#dadce0] focus:border-[#1a73e8] text-sm text-center"
                                    min="1"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium text-[#5f6368] min-w-[50px]">P.U.</Label>
                                <Input 
                                    type="number"
                                    step="0.01"
                                    value={unitPrice} 
                                    onChange={e => setUnitPrice(Number(e.target.value))}
                                    className="h-9 w-24 border-[#dadce0] focus:border-[#1a73e8] text-sm text-right"
                                    min="0"
                                />
                            </div>
                            <Button 
                                type="button" 
                                onClick={handleAddItem} 
                                disabled={!selectedProduct || quantity <= 0 || unitPrice <= 0}
                                className="h-9 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-3"
                            >
                                <Plus className="mr-1 h-4 w-4"/>
                                Ajouter
                            </Button>
                        </div>
                    </div>

                    {/* Liste des articles */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between p-4 border-b border-[#e8eaed]">
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-[#5f6368]"/>
                                <span className="text-sm font-medium text-[#202124]">
                                    Articles ({fields.length})
                                </span>
                            </div>
                            {fields.length > 0 && (
                                <div className="text-sm text-[#5f6368]">
                                    Total: <span className="font-medium text-[#202124]">
                                        {totalValue.toLocaleString()} F
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-auto">
                            {fields.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <Package className="h-12 w-12 text-[#dadce0] mb-4"/>
                                    <p className="text-[#5f6368] text-sm mb-2">Aucun article ajouté</p>
                                    <p className="text-[#9aa0a6] text-xs">
                                        Sélectionnez un produit ci-dessus pour commencer
                                    </p>
                                </div>
                            ) : (
                                <DataTable columns={columns} data={fields} />
                            )}
                        </div>
                    </div>

                    {/* Footer avec actions */}
                    <div className="flex items-center justify-between p-4 border-t border-[#e8eaed] bg-[#f8f9fa]">
                        <div className="text-sm text-[#5f6368]">
                            {fields.length > 0 && (
                                <>
                                    {fields.length} article{fields.length > 1 ? 's' : ''} • 
                                    Total: {totalValue.toLocaleString()} F
                                </>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => reset()}
                                className="border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]"
                            >
                                Annuler
                            </Button>
                            <Button 
                                type="submit"
                                disabled={fields.length === 0}
                                className="bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}