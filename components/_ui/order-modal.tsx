"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (order: any) => void;
}

export function OrderModal({ isOpen, onClose, onCreateOrder }: OrderModalProps) {
  const [order, setOrder] = useState({
    // Critères de commande stock
    articlesCriteria: 'rupture', // 'rupture', 'seuil', 'prix'
    prixComparaison: '=',
    prixValeur: '0',
    
    // Magasin
    magasin: 'TOUS',
    tous: false,
    
    // Autres champs
    supplier: '',
    deliveryDate: '',
    notes: ''
  });

  const handleSubmit = () => {
    if (!order.magasin) {
      alert('Veuillez sélectionner un magasin');
      return;
    }
    
    const orderData = {
      ...order,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    onCreateOrder(orderData);
    onClose();
    
    // Reset form
    setOrder({
      articlesCriteria: 'rupture',
      prixComparaison: '=',
      prixValeur: '0',
      magasin: 'SURFACE VENTE MOKOLO',
      tous: false,
      supplier: '',
      deliveryDate: '',
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-[#202124] text-base font-medium">Fiche de commande des articles</DialogTitle>
          <DialogDescription className="text-[#5f6368] text-sm">
            Commande des articles en rupture de stock
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-1 py-4 max-h-[70vh] overflow-y-auto">
          {/* Section Critères de commande stock */}
            <div className="flex w-full justify-between mb-3">
            <div className="flex items-center justify-start w-full">
              <Label className="text-sm font-medium text-[#202124] pr-4 min-w-[120px]">Articles</Label>
              <div className="flex gap-2 w-full">
              <div className="flex items-center w-1/5 space-x-2">
                <input 
                type="radio" 
                id="rupture-stock" 
                name="articlesCriteria" 
                value="rupture"
                checked={order.articlesCriteria === 'rupture'}
                onChange={(e) => setOrder({ ...order, articlesCriteria: e.target.value })}
                className="w-3 h-3"
                />
                <Label htmlFor="rupture-stock" className=" text-sm">en rupture  <br/>de stock</Label>
              </div>
              <div className="flex items-center w-[200px] space-x-2">
                <input 
                type="radio" 
                id="deca-seuil" 
                name="articlesCriteria" 
                value="seuil"
                checked={order.articlesCriteria === 'seuil'}
                onChange={(e) => setOrder({ ...order, articlesCriteria: e.target.value })}
                className="w-3 h-3"
                />
                <Label htmlFor="deca-seuil" className="text-sm">en deçà du seuil de réapprovisionnement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                type="radio" 
                id="prix-achat" 
                name="articlesCriteria"   
                value="prix"
                checked={order.articlesCriteria === 'prix'}
                onChange={(e) => setOrder({ ...order, articlesCriteria: e.target.value })}
                className="w-3 h-3"
                />
                <Label htmlFor="prix-achat" className="text-sm">dont le prix <br/> d'achat est</Label>
                <Select value={order.prixComparaison} onValueChange={(value) => setOrder({ ...order, prixComparaison: value })}>
                <SelectTrigger className="h-8 text-sm min-w-12 border-b border-[#202124] border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-[#1a73e8] focus:border-b-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="=">=</SelectItem>
                  <SelectItem value="<">&lt;</SelectItem>
                  <SelectItem value=">">&gt;</SelectItem>
                  <SelectItem value="<=">≤</SelectItem>
                  <SelectItem value=">=">≥</SelectItem>
                </SelectContent>
                </Select>
                <Input
                type="text"
                value={order.prixValeur}
                onChange={(e) => setOrder({ ...order, prixValeur: e.target.value })}
                className="w-16 h-8 text-sm border-b border-[#202124] border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-[#1a73e8] focus:border-b-2"
                />
              </div>
              </div>
            </div>
            </div>

          {/* Section Magasin */}
          <div className="flex items-end justify-start ">
            <Label className="text-sm font-medium text-[#202124] pb-1 min-w-[140px]">Magasin</Label>
            <div className="flex items-center gap-2">
              <Select value={order.magasin} onValueChange={(value) => setOrder({ ...order, magasin: value })}>
                <SelectTrigger className="h-8 text-sm w-[300px] border-b border-[#202124] border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-[#1a73e8] focus:border-b-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous</SelectItem>
                  <SelectItem value="SURFACE VENTE MOKOLO">SURFACE VENTE MOKOLO</SelectItem>
                  <SelectItem value="SURFACE VENTE MOBILIER">SURFACE VENTE MOBILIER</SelectItem>
                  <SelectItem value="ENTREPOT A">ENTREPOT A</SelectItem>
                  <SelectItem value="ENTREPOT B">ENTREPOT B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-[#5f6368] border-[#dadce0] hover:bg-[#f8f9fa] h-9 text-sm"
          >
            Fermer
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#1a73e8] hover:bg-[#1557b0] text-white h-9 text-sm px-6"
          >
            Générer la commande
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
