# Composants d'Inventaire - Architecture Modulaire

Ce module contient une architecture modulaire pour la gestion des inventaires, séparée en composants spécialisés pour une meilleure maintenabilité et réutilisabilité.

## Structure des Composants

### `InventoryView` (composant principal)
- **Rôle** : Orchestrateur principal qui gère l'état global et la logique métier
- **Responsabilités** :
  - Gestion de l'état des inventaires
  - API calls pour CRUD operations
  - Coordination entre les composants enfants
  - Gestion des modales et de la navigation

### `InventoryListView` 
- **Rôle** : Affichage de la liste des inventaires sous forme de tableau
- **Responsabilités** :
  - Rendu du tableau avec GenericTable
  - Gestion des actions de liste (sélection, tri, filtrage)
  - Interface de création de nouveaux inventaires
  - Événements de sélection et d'actions sur les items

### `InventoryModalView`
- **Rôle** : Wrapper modal pour l'affichage des détails d'inventaire
- **Responsabilités** :
  - Gestion de l'état d'ouverture/fermeture de la modale
  - Wrapper UI pour InventoryDetailView
  - Gestion des actions de sauvegarde et validation

### `InventoryDetailView`
- **Rôle** : Vue détaillée d'un inventaire spécifique
- **Responsabilités** :
  - Affichage des informations détaillées
  - Édition des quantités d'inventaire
  - Actions de validation et sauvegarde

## Avantages de cette Architecture

1. **Séparation des Responsabilités** : Chaque composant a un rôle clair et défini
2. **Réutilisabilité** : Les composants peuvent être utilisés indépendamment
3. **Maintenabilité** : Plus facile de modifier ou déboguer un composant spécifique
4. **Testabilité** : Chaque composant peut être testé isolément
5. **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités

## Flux de Données

```
InventoryView (État global)
    ↓ (props)
InventoryListView (Liste) ← → InventoryModalView (Détails)
    ↓ (events)                    ↓ (wraps)
InventoryView (Actions)      InventoryDetailView
```

## Utilisation

```tsx
import { InventoryView } from './components/stock/inventory';

// Utilisation simple
<InventoryView 
  initialInventories={inventories}
  products={products}
  warehouses={warehouses}
/>

// Utilisation modulaire
import { InventoryListView, InventoryModalView } from './components/stock/inventory';

<InventoryListView 
  inventories={inventories}
  onInventorySelect={handleSelect}
  // ... autres props
/>
```
