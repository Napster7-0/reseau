export interface Warehouse {
    id: string;
    name: string;
    code?: string;
    address?: string;
    isActive?: boolean;
}

export interface StockMovementItem {
    productId: string;
    quantity: number;
    costPrice: number;
    // Champs optionnels pour l'affichage
    code?: string;
    name?: string;
    stockBefore?: number;
    stockAfter?: number;
    unit?: string;
    // Champs pour traçabilité
    lotNumber?: string;
    expirationDate?: string;
}

export interface StockMovement {
    id: string;
    type: 'entry' | 'exit' | 'transformation' | 'adjustment' | 'transfer';
    reference: string;
    date: string | Date;
    warehouseId: string;
    warehouseDestinationId?: string; // Pour les transferts
    notes?: string;
    items: StockMovementItem[];
    // Champs supplémentaires pour journal
    createdBy?: string;
    validatedBy?: string;
    validatedAt?: string | Date;
    status: 'draft' | 'pending' | 'validated' | 'cancelled';
    source: 'manual' | 'sale' | 'purchase' | 'inventory' | 'system';
    documentNumber?: string; // Numéro de facture/bon de commande
    supplierId?: string; // Pour les entrées
    customerId?: string; // Pour les sorties
    totalValue?: number; // Valeur totale du mouvement
}

export interface InventoryItem {
    productId: string;
    productCode: string;
    productName: string;
    theoreticalQty: number; // Stock machine au moment de la création
    physicalQty: number | null; // Stock physique compté
    // Champs supplémentaires
    unit?: string;
    location?: string; // Emplacement dans l'entrepôt
    lotNumber?: string;
    expirationDate?: string;
    variance?: number; // Écart calculé automatiquement
    costPrice?: number;
    notes?: string; // Notes spécifiques à cet item
}

export interface Inventory {
    id: string;
    reference: string;
    warehouseId: string;
    date: string | Date;
    status: 'En cours' | 'Validé' | 'Annulé';
    type: 'Annuel' | 'Spontané' | 'Tournant' | 'Cycle';
    notes?: string;
    items: InventoryItem[];
    // Champs supplémentaires pour gestion
    createdBy?: string;
    validatedBy?: string;
    validatedAt?: string | Date;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    totalVariance?: number; // Écart total en valeur
    itemsCount?: number; // Nombre total d'articles
    completionPercentage?: number; // Pourcentage de complétude
    // Pour inventaires tournants
    zone?: string;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
}

// Types pour les filtres de journal
export interface JournalFilters {
    dateFrom: string;
    dateTo: string;
    movementType?: 'all' | 'entry' | 'exit' | 'transformation' | 'adjustment' | 'transfer';
    warehouseId?: string;
    status?: 'all' | 'draft' | 'pending' | 'validated' | 'cancelled';
    source?: 'all' | 'manual' | 'sale' | 'purchase' | 'inventory' | 'system';
    productId?: string;
    reference?: string;
}

// Type pour les statistiques de stock
export interface StockStats {
    totalValue: number;
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    expiringItems: number;
    lastMovementDate?: string;
}