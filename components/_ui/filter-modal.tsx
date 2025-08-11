"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function FilterModal({ isOpen, onClose, onApplyFilters }: FilterModalProps) {
  const [filters, setFilters] = useState({
    // Critères d'analyse de stock
    magasins: 'TOUS',
    surface: 'SURFACE VENTE MOBILIER',
    triResultats: 'Libellé',
    uniquementArticlesEnStock: false,
    categoriesProduit: '',
    
    // Exercice
    exercice: '2025',
    codeEtatStock: ''
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      // Critères d'analyse de stock
      magasins: 'TOUS',
      surface: 'SURFACE VENTE MOBILIER',
      triResultats: 'Libellé',
      uniquementArticlesEnStock: false,
      categoriesProduit: '',
      
      // Exercice
      exercice: '2025',
      codeEtatStock: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] font-['Google_Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-[#202124] text-base font-medium">Critères d'analyse de stock</DialogTitle>
          <DialogDescription className="text-[#5f6368] text-sm">
            Définissez vos critères de recherche et de filtrage
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-1 py-4 max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between">
            <div className="flex items-center justify-start ">
                <Label className="text-sm font-medium text-[#202124] pr-4 min-w-[120px]">Trier les résultats par</Label>
                <div className="flex gap-4 w-[300px]">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="tri-code" 
                      name="triResultats" 
                      value="Code"
                      checked={filters.triResultats === 'Code'}
                      onChange={(e) => setFilters({ ...filters, triResultats: e.target.value })}
                      className="w-3 h-3"
                    />
                    <Label htmlFor="tri-code" className="text-sm">Code</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="tri-libelle" 
                      name="triResultats" 
                      value="Libellé"
                      checked={filters.triResultats === 'Libellé'}
                      onChange={(e) => setFilters({ ...filters, triResultats: e.target.value })}
                      className="w-3 h-3"
                    />
                    <Label htmlFor="tri-libelle" className="text-sm">Libellé</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uniquement-stock"
                    checked={filters.uniquementArticlesEnStock}
                    onCheckedChange={(checked) => setFilters({ ...filters, uniquementArticlesEnStock: !!checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="uniquement-stock" className="text-sm text-[#202124]">
                    Uniquement les articles en stock
                  </Label>
                </div>
              </div>
          </div>
          {/* Section Magasins */}
          <div className="flex items-end justify-between p-2">
            <Label className="text-sm font-medium text-[#202124] pb-1 min-w-[120px]">Tous les magasins</Label>
            <Select value={filters.magasins} onValueChange={(value) => setFilters({ ...filters, magasins: value })}>
              <SelectTrigger className="h-8 text-sm min-w-[300px] border-b border-[#202124] border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-[#1a73e8] focus:border-b-2">
                <SelectValue placeholder="Sélectionner un magasin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TOUS">TOUS</SelectItem>
                <SelectItem value="SURFACE VENTE MOBILIER">SURFACE VENTE MOBILIER</SelectItem>
                <SelectItem value="ENTREPOT A">ENTREPOT A</SelectItem>
                <SelectItem value="ENTREPOT B">ENTREPOT B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section Surface */}
          <div className="flex items-end justify-between p-2">
            <Label className="text-sm font-medium text-[#202124] pb-1 min-w-[120px]">Surface</Label>
            <Select value={filters.surface} onValueChange={(value) => setFilters({ ...filters, surface: value })}>
              <SelectTrigger className="h-8 text-sm min-w-[300px] border-b border-[#202124] border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-[#1a73e8] focus:border-b-2">
                <SelectValue placeholder="Sélectionner une surface" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SURFACE VENTE MOBILIER">SURFACE VENTE MOBILIER</SelectItem>
                <SelectItem value="SURFACE VENTE DECORATION">SURFACE VENTE DECORATION</SelectItem>
                <SelectItem value="SURFACE STOCKAGE">SURFACE STOCKAGE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section Exercice */}
          <div className="flex items-end justify-between p-2">
            <Label className="text-sm font-medium text-[#202124] pb-1 min-w-[120px]">Exercice</Label>
            <Select value={filters.exercice} onValueChange={(value) => setFilters({ ...filters, exercice: value })}>
              <SelectTrigger className="h-8 text-sm min-w-[300px] border-b border-[#202124] border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-[#1a73e8] focus:border-b-2">
                <SelectValue placeholder="Sélectionner un exercice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
            
            <div className="flex items-end justify-between p-2">
              <Label className="text-sm font-medium text-[#202124] min-w-[120px]">Catégorie produit</Label>
              <Input
                placeholder="[oute]"
                value={filters.categoriesProduit}
                onChange={(e) => setFilters({ ...filters, categoriesProduit: e.target.value })}
                className="h-8 text-sm min-w-[300px] border-b border-[#202124] border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-b-[#1a73e8] focus:border-b-2"
              />
            </div>

            <div className="flex items-end justify-between p-2">
              <Label className="text-sm font-medium text-[#202124] min-w-[120px]">Code</Label>
              <Input
                placeholder="CodeEtatStock"
                value={filters.codeEtatStock}
                onChange={(e) => setFilters({ ...filters, codeEtatStock: e.target.value })}
                className="h-8 text-sm min-w-[300px] border-b border-[#202124] border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:border-[#1a73e8] focus:border-b-2"
              />
            </div>

        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-[#5f6368] border-[#dadce0] hover:bg-[#f8f9fa] h-9 text-sm"
          >
            Réinitialiser
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-[#5f6368] border-[#dadce0] hover:bg-[#f8f9fa] h-9 text-sm px-6"
            >
              Annuler
            </Button>
            <Button
              onClick={handleApply}
              className="bg-[#1a73e8] hover:bg-[#1557b0] text-white h-9 text-sm px-6"
            >
              Appliquer les filtres
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
