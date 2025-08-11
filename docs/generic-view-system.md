# Système de Vue Générique

## Vue d'ensemble

Le système de vue générique permet de créer des interfaces cohérentes et réutilisables dans toute l'application. Il se compose de trois composants principaux :

- `GenericView` : Le composant principal orchestrateur
- `GenericToolbar` : Barre d'outils personnalisable
- `GenericTabNavigation` : Navigation par onglets avec gestion du débordement

## Structure des fichiers

```
components/
├── stock/
│   ├── generic-view.tsx              # Composant principal générique
│   ├── stock-view-generic.tsx        # Exemple d'usage pour le stock
│   └── layout/
│       ├── generic-toolbar.tsx       # Toolbar générique
│       └── generic-tab-navigation.tsx # Navigation générique
├── customers/
│   └── customer-view-generic.tsx     # Exemple d'usage pour les clients
└── invoices/
    └── invoice-view-generic.tsx      # Exemple d'usage pour les factures
```

## Utilisation de base

### 1. Configuration des onglets

```typescript
const tabs: ViewTab[] = [
  {
    id: 'tab-1',
    label: 'Mon Onglet',
    icon: <Package className="h-4 w-4" />,
    badge: {
      text: '150',
      className: 'bg-[#e8f0fe] text-[#1a73e8] border-[#1a73e8]'
    },
    preview: 'Description de l\'onglet'
  }
];
```

### 2. Configuration des actions de toolbar

```typescript
const customActions: ViewToolbarAction[] = [
  {
    id: 'custom-action',
    icon: <Download className="h-4 w-4" />,
    label: 'Action personnalisée',
    onClick: () => console.log('Action déclenchée'),
    variant: 'primary' // 'default' | 'primary' | 'danger'
  }
];
```

### 3. Fonction de rendu du contenu

```typescript
const renderContent = (activeTab: string, commonProps: any) => {
  switch (activeTab) {
    case 'tab-1':
      return <MonComposant {...commonProps} />;
    default:
      return <div>Onglet non implémenté</div>;
  }
};
```

### 4. Utilisation complète

```typescript
export function MaVuePersonnalisee() {
  return (
    <GenericView
      tabs={tabs}
      defaultActiveTab="tab-1"
      toolbarActions={customActions}
      showSelectAll={true}
      showPagination={true}
      renderContent={renderContent}
      getTotalCount={(activeTab) => getCount(activeTab)}
      onTabChange={(tab) => console.log('Onglet changé:', tab)}
      filterModal={{ enabled: true }}
      orderModal={{ enabled: true }}
      onApplyFilters={(filters) => console.log('Filtres:', filters)}
      onCreateOrder={(order) => console.log('Commande:', order)}
      onRefresh={(tab) => console.log('Rafraîchir:', tab)}
      onToggleStar={(id, tab) => console.log('Étoile:', id, tab)}
    />
  );
}
```

## Props du GenericView

### Props obligatoires

- `tabs`: Array des onglets à afficher
- `renderContent`: Fonction qui rend le contenu selon l'onglet actif

### Props de configuration

- `defaultActiveTab`: Onglet actif par défaut
- `toolbarActions`: Actions personnalisées dans la toolbar
- `showSelectAll`: Afficher la case "tout sélectionner" (défaut: true)
- `showPagination`: Afficher la pagination (défaut: true)

### Props de callbacks

- `getTotalCount`: Fonction qui retourne le nombre d'éléments par onglet
- `onTabChange`: Callback lors du changement d'onglet
- `onApplyFilters`: Callback lors de l'application de filtres
- `onCreateOrder`: Callback lors de la création d'une commande
- `onRefresh`: Callback lors du rafraîchissement
- `onToggleStar`: Callback lors du toggle d'une étoile

### Props de modals

- `filterModal`: Configuration de la modal de filtres
  ```typescript
  {
    enabled: boolean,
    component?: React.ComponentType // Modal personnalisée
  }
  ```
- `orderModal`: Configuration de la modal de commandes

### Props de style

- `className`: Classes CSS additionnelles
- `containerClassName`: Classes CSS du conteneur principal

## Exemples d'implémentation

### Stock Management
Voir `stock-view-generic.tsx` pour un exemple complet avec :
- 6 onglets différents (État, Entrée, Sortie, Transfert, Transformation, Journal)
- Actions personnalisées (Export, Envoi de rapport)
- Filtres et commandes activés

### Customer Management
Voir `customer-view-generic.tsx` pour un exemple avec :
- 6 onglets clients (Actifs, Prospects, Inactifs, Historique, Communications, RDV)
- Actions spécifiques clients (Nouveau client, Import, Paramètres)

### Invoice Management
Voir `invoice-view-generic.tsx` pour un exemple avec :
- Modal de filtres personnalisée
- Actions métier (Nouvelle facture, Rappels, Export, Impression)
- Gestion des statuts de factures

## Personnalisation avancée

### Modal personnalisée

```typescript
const CustomFilterModal = ({ isOpen, onClose, onApplyFilters }) => {
  // Votre composant modal personnalisé
  return (
    // JSX de votre modal
  );
};

// Utilisation
<GenericView
  filterModal={{ 
    enabled: true, 
    component: CustomFilterModal 
  }}
  // ... autres props
/>
```

### Styling personnalisé

```typescript
<GenericView
  className="ma-classe-personnalisee"
  containerClassName="mon-conteneur-personnalise"
  // ... autres props
/>
```

## Cohérence avec le design Gmail

Le système respecte automatiquement :
- Les couleurs Gmail (#1a73e8, #5f6368, #f1f3f4, etc.)
- La police Google Sans
- Les espacements et bordures cohérents
- Les interactions hover et focus

## Migration depuis les composants existants

Pour migrer un composant existant :

1. Extraire la configuration des onglets dans un array `ViewTab[]`
2. Extraire las actions de toolbar dans un array `ViewToolbarAction[]`
3. Créer une fonction `renderContent` qui switch sur l'onglet actif
4. Remplacer le composant par `GenericView` avec la configuration appropriée

## Avantages

- **Cohérence** : Interface unifiée dans toute l'application
- **Réutilisabilité** : Un seul composant pour toutes les vues tabulaires
- **Maintenabilité** : Modifications centralisées
- **Flexibilité** : Personnalisation complète possible
- **Performance** : Gestion optimisée des onglets et du débordement
