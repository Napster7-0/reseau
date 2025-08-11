"use client";

import { useForm } from 'react-hook-form';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Package, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Warehouse, Inventory } from '@/types/stock';
import { Product } from '@/types/core';

interface NewInventoryFormData {
    warehouseId: string;
    type: Inventory['type'];
    date: Date;
    code: string;
    description: string;
    notes: string;
}

interface NewInventoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    warehouses: Warehouse[];
    products: Product[];
    onSubmit: (data: NewInventoryFormData & { items: { productId: string; theoreticalQty: number; physicalQty: number | null }[] }) => void;
}

export function NewInventoryDialog({ isOpen, onClose, warehouses, products, onSubmit }: NewInventoryDialogProps) {
    const [selectedProducts, setSelectedProducts] = useState<{ productId: string; theoreticalQty: number; physicalQty: number | null }[]>([]);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [productToAdd, setProductToAdd] = useState('');
    const [physicalQtyToAdd, setPhysicalQtyToAdd] = useState(0);
    
    const form = useForm<NewInventoryFormData>({
        defaultValues: { 
            warehouseId: '', 
            type: 'Spontané',
            date: new Date(),
            code: '',
            description: '',
            notes: ''
        }
    });

    // Obtenir le produit sélectionné pour l'ajout
    const selectedProduct = products.find(p => p.id === productToAdd);

    // Fonction pour ajouter un produit à l'inventaire
    const handleAddProduct = () => {
        if (!productToAdd || !selectedProduct) return;
        
        console.log('Ajout du produit:', selectedProduct.name, 'Qté:', physicalQtyToAdd);
        
        const newItem = {
            productId: productToAdd,
            theoreticalQty: selectedProduct.stock,
            physicalQty: physicalQtyToAdd
        };
        
        setSelectedProducts(prev => [...prev, newItem]);
        
        // Reset des champs
        setProductToAdd('');
        setPhysicalQtyToAdd(0);
    };

    // Fonction pour supprimer un produit de l'inventaire
    const handleRemoveProduct = (productId: string) => {
        const product = products.find(p => p.id === productId);
        console.log('Suppression du produit:', product?.name);
        setSelectedProducts(prev => prev.filter(item => item.productId !== productId));
    };

    // Fonction pour mettre à jour la quantité physique d'un produit
    const updateProductQuantity = (productId: string, physicalQty: number | null) => {
        setSelectedProducts(prev => 
            prev.map(item => 
                item.productId === productId 
                    ? { ...item, physicalQty }
                    : item
            )
        );
    };

    // Filtrer les produits selon la case à cocher "Toutes les familles"
    const filteredProducts = useMemo(() => 
        showAllProducts ? products : products.filter(p => p.stock > 0),
        [showAllProducts, products]
    );

    // Produits affichés dans le tableau (seulement ceux sélectionnés)
    const displayedProducts = useMemo(() => 
        products.filter(p => selectedProducts.some(sp => sp.productId === p.id)),
        [products, selectedProducts]
    );

    // Initialiser les produits sélectionnés quand le magasin change
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'warehouseId' && value.warehouseId) {
                if (!showAllProducts) {
                    const productsToAdd = products.filter(p => p.stock > 0);
                    const initialItems = productsToAdd.map(p => ({
                        productId: p.id,
                        theoreticalQty: p.stock,
                        physicalQty: null
                    }));
                    setSelectedProducts(initialItems);
                } else {
                    // Si "Toutes les familles" est coché, ne pas auto-ajouter les produits
                    setSelectedProducts([]);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form, showAllProducts, products]);

    // Effet séparé pour gérer le changement de "Toutes les familles"
    useEffect(() => {
        const warehouseId = form.getValues('warehouseId');
        if (warehouseId) {
            if (!showAllProducts) {
                const productsToAdd = products.filter(p => p.stock > 0);
                const initialItems = productsToAdd.map(p => ({
                    productId: p.id,
                    theoreticalQty: p.stock,
                    physicalQty: null
                }));
                setSelectedProducts(initialItems);
            } else {
                setSelectedProducts([]);
            }
        }
    }, [showAllProducts, products, form]);

    const handleSubmit = (data: NewInventoryFormData) => {
        // Générer un code automatique si vide
        if (!data.code) {
            const warehouse = warehouses.find(w => w.id === data.warehouseId);
            const warehouseCode = warehouse?.code || warehouse?.id || 'WH';
            data.code = `INV-${warehouseCode}-${Date.now()}`;
        }
        
        onSubmit({
            ...data,
            items: selectedProducts
        });
        form.reset();
        setSelectedProducts([]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-auto min-w-[95vw] h-auto min-h-[95vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl font-medium text-[#202124]">
                        Nouvel Inventaire
                    </DialogTitle>
                </DialogHeader>
                
                <div className="overflow-y-auto max-h-[80vh]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Première ligne : Type, Magasin, Date */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-[#5f6368]">
                                                Type Inventaire
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 border-[#dadce0] focus:border-[#1a73e8]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Spontané">Spontané</SelectItem>
                                                    <SelectItem value="Tournant">Tournant</SelectItem>
                                                    <SelectItem value="Annuel">Annuel</SelectItem>
                                                    <SelectItem value="Cycle">Cycle</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="warehouseId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-[#5f6368]">
                                                Magasin
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 border-[#dadce0] focus:border-[#1a73e8]">
                                                        <SelectValue placeholder="Choisir..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {warehouses.map(w => (
                                                        <SelectItem key={w.id} value={w.id}>
                                                            {w.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="date" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-[#5f6368]">
                                                Date
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "h-9 w-full justify-start text-left font-normal border-[#dadce0] focus:border-[#1a73e8]",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? (
                                                                format(field.value, "dd-MMM-yy", { locale: fr })
                                                            ) : (
                                                                <span>Sélectionner...</span>
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )} />
                                </div>

                                {/* Deuxième ligne : Code et Description */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="code" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-[#5f6368]">
                                                Code
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    placeholder="Auto-généré si vide"
                                                    className="h-9 border-[#dadce0] focus:border-[#1a73e8]"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="description" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-[#5f6368]">
                                                Description
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    placeholder="Description de l'inventaire"
                                                    className="h-9 border-[#dadce0] focus:border-[#1a73e8]"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                </div>

                                {/* Notes */}
                                <FormField control={form.control} name="notes" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-[#5f6368]">
                                            Notes
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                {...field}
                                                placeholder="Notes et observations sur cet inventaire..."
                                                className="min-h-[60px] border-[#dadce0] focus:border-[#1a73e8] resize-none"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )} />

                                {/* Section Ajout de produit */}
                                {form.watch('warehouseId') && (
                                    <div className="border-t border-[#e8eaed] pt-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Plus className="h-4 w-4 text-[#5f6368]" />
                                            <h3 className="text-base font-medium text-[#202124]">
                                                Ajouter un produit à l'inventaire
                                            </h3>
                                        </div>

                                        {/* Formulaire d'ajout de produit */}
                                        <div className="bg-[#f8f9fa] p-4 rounded-lg border border-[#dadce0] mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                                <div>
                                                    <label className="text-sm font-medium text-[#5f6368] mb-1 block">
                                                        Produit
                                                    </label>
                                                    <Select value={productToAdd} onValueChange={setProductToAdd}>
                                                        <SelectTrigger className="h-9 border-[#dadce0] focus:border-[#1a73e8]">
                                                            <SelectValue placeholder="Sélectionner un produit..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {products
                                                                .filter(p => !selectedProducts.some(sp => sp.productId === p.id))
                                                                .map((product) => (
                                                                    <SelectItem key={product.id} value={product.id}>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-mono text-xs text-[#5f6368]">
                                                                                {product.code}
                                                                            </span>
                                                                            <span>{product.name}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[#5f6368] mb-1 block">
                                                        Qté Physique
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        value={physicalQtyToAdd}
                                                        onChange={(e) => setPhysicalQtyToAdd(e.target.value ? parseInt(e.target.value) : 0)}
                                                        className="h-9 border-[#dadce0] focus:border-[#1a73e8]"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[#5f6368] mb-1 block">
                                                        Stock Théorique
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        value={selectedProduct?.stock || 0}
                                                        disabled
                                                        className="h-9 bg-gray-50 border-[#dadce0] text-[#5f6368]"
                                                    />
                                                </div>
                                                <div className="col-span-1 md:col-span-4 lg:col-span-1">
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddProduct}
                                                        disabled={!productToAdd || physicalQtyToAdd < 0}
                                                        className="h-9 w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                                                    >
                                                        <Plus className="mr-1 h-4 w-4" />
                                                        Ajouter
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section Saisie et enregistrement Quantité */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-4 w-4 text-[#5f6368]" />
                                                <h3 className="text-base font-medium text-[#202124]">
                                                    Saisie et enregistrement Quantité
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="allFamilies"
                                                    checked={showAllProducts}
                                                    onChange={(e) => setShowAllProducts(e.target.checked)}
                                                    className="rounded border-[#dadce0]"
                                                />
                                                <label 
                                                    htmlFor="allFamilies" 
                                                    className="text-sm text-[#d73502] font-medium cursor-pointer"
                                                >
                                                    Toutes les familles
                                                </label>
                                            </div>
                                        </div>

                                        {/* En-tête de filtre */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label className="text-sm font-medium text-[#5f6368]">Code:</label>
                                                <Input 
                                                    placeholder="Filtrer par code..."
                                                    className="h-8 text-sm border-[#dadce0] focus:border-[#1a73e8]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[#5f6368]">Libellé:</label>
                                                <Input 
                                                    placeholder="Filtrer par libellé..."
                                                    className="h-8 text-sm border-[#dadce0] focus:border-[#1a73e8]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[#5f6368]">Qté:</label>
                                                <Input 
                                                    placeholder="Filtrer par quantité..."
                                                    className="h-8 text-sm border-[#dadce0] focus:border-[#1a73e8]"
                                                />
                                            </div>
                                        </div>

                                        {/* Tableau des produits */}
                                        <div className="border border-[#dadce0] rounded-lg max-h-48 overflow-y-auto">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm min-w-[600px]">
                                                    <thead className="bg-[#f8f9fa] border-b border-[#dadce0] sticky top-0">
                                                        <tr>
                                                            <th className="text-left p-2 font-medium text-[#5f6368]">Code</th>
                                                            <th className="text-left p-2 font-medium text-[#5f6368]">Libellé</th>
                                                            <th className="text-center p-2 font-medium text-[#5f6368]">Stock Théorique</th>
                                                            <th className="text-center p-2 font-medium text-[#5f6368]">Qté Physique</th>
                                                            <th className="text-center p-2 font-medium text-[#5f6368]">Écart</th>
                                                            <th className="text-center p-2 font-medium text-[#5f6368]">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {displayedProducts.map((product) => {
                                                            const item = selectedProducts.find(sp => sp.productId === product.id);
                                                            const variance = item?.physicalQty !== null 
                                                                ? (item?.physicalQty || 0) - (item?.theoreticalQty || 0)
                                                                : null;
                                                            
                                                            return (
                                                                <tr key={product.id} className="border-b border-[#e8eaed] hover:bg-[#f8f9fa]">
                                                                    <td className="p-2 font-mono text-xs">{product.code}</td>
                                                                    <td className="p-2 text-sm">{product.name}</td>
                                                                    <td className="p-2 text-center font-medium">{product.stock}</td>
                                                                    <td className="p-2 text-center">
                                                                        <Input
                                                                            type="number"
                                                                            value={item?.physicalQty || ''}
                                                                            onChange={(e) => updateProductQuantity(
                                                                                product.id, 
                                                                                e.target.value ? parseInt(e.target.value) : null
                                                                            )}
                                                                            className="h-7 w-16 text-center text-sm border-[#dadce0] focus:border-[#1a73e8]"
                                                                            placeholder="-"
                                                                        />
                                                                    </td>
                                                                    <td className="p-2 text-center">
                                                                        {variance !== null && (
                                                                            <span className={cn(
                                                                                "font-medium text-sm",
                                                                                variance > 0 ? "text-green-600" : variance < 0 ? "text-red-600" : "text-[#5f6368]"
                                                                            )}>
                                                                                {variance > 0 ? '+' : ''}{variance}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-2 text-center">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleRemoveProduct(product.id)}
                                                                            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        {displayedProducts.length === 0 && (
                                                            <tr>
                                                                <td colSpan={6} className="p-4 text-center text-[#5f6368] text-sm">
                                                                    Aucun produit ajouté à l'inventaire. Utilisez le formulaire ci-dessus pour ajouter des produits.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#e8eaed]">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={onClose}
                                    className="w-full sm:w-auto border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]"
                                >
                                    Annuler
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={!form.watch('warehouseId')}
                                    className="w-full sm:w-auto bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                                >
                                    Enregistrer
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
