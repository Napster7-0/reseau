import { Client, Product, Supplier } from "@/types/core";
import { Profile, SystemAudit, User } from "@/types/personnel";
import { Invoice, Order, OrderJournalEntry } from "@/types/sales";
import { GeneralOptions, FiscalYear } from "@/types/settings";
import { Warehouse, StockMovement, Inventory, JournalFilters, StockStats } from "@/types/stock";

const API_BASE_URL = "http://localhost:3001";

const apiRequest = async <T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> => {
    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        let errorMessage = `Erreur API: ${method} ${endpoint} - ${response.status}`;
        try {
            const errorInfo = await response.json();
            errorMessage = errorInfo.message || errorMessage;
        } catch {
            // If response is not JSON (like HTML 404 page), use the status text
            errorMessage = `${errorMessage} - ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
    
    if (method === 'DELETE' || response.status === 204) {
        return {} as T; 
    }

    return response.json();
};

export const getClients = (query?: string): Promise<Client[]> => apiRequest<Client[]>(`/clients${query ? `?q=${query}` : ''}`);
export const createClient = (data: Omit<Client, 'id'>): Promise<Client> => apiRequest<Client>("/clients", 'POST', data);
export const updateClient = (id: string, data: Partial<Client>): Promise<Client> => apiRequest<Client>(`/clients/${id}`, 'PATCH', data);
export const deleteClient = (id: string): Promise<void> => apiRequest<void>(`/clients/${id}`, 'DELETE');

export const getProducts = (query?: string): Promise<Product[]> => apiRequest<Product[]>(`/products${query ? `?q=${query}` : ''}`);
export const createProduct = (data: Omit<Product, 'id'>): Promise<Product> => apiRequest<Product>("/products", 'POST', data);
export const updateProduct = (id: string, data: Partial<Product>): Promise<Product> => apiRequest<Product>(`/products/${id}`, 'PATCH', data);
export const deleteProduct = (id: string): Promise<void> => apiRequest<void>(`/products/${id}`, 'DELETE');

export const getInvoices = async (): Promise<Invoice[]> => {
    const invoices = await apiRequest<Invoice[]>("/invoices");
    return invoices.map(invoice => ({ ...invoice, orderDate: new Date(invoice.orderDate), dueDate: new Date(invoice.dueDate) }));
};

export const getOrderJournal = async (): Promise<OrderJournalEntry[]> => {
    const journal = await apiRequest<OrderJournalEntry[]>("/orderJournal");
    return journal.map(entry => ({ ...entry, orderDate: new Date(entry.orderDate) }));
};
export const updateOrderJournalEntry = (id: string, data: Partial<OrderJournalEntry>): Promise<OrderJournalEntry> => apiRequest<OrderJournalEntry>(`/orderJournal/${id}`, 'PATCH', data);
export const deleteOrderJournalEntry = (id: string): Promise<void> => apiRequest<void>(`/orderJournal/${id}`, 'DELETE');

export const getOrders = async (): Promise<Order[]> => {
    const orders = await apiRequest<Order[]>("/orders");
    return orders.map(order => ({ ...order, orderDate: new Date(order.orderDate) }));
};
export const createOrder = (data: Omit<Order, 'id'>): Promise<Order> => apiRequest<Order>("/orders", 'POST', data);
export const updateOrder = (id: string, data: Partial<Order>): Promise<Order> => apiRequest<Order>(`/orders/${id}`, 'PATCH', data);

export const getWarehouses = (): Promise<Warehouse[]> => apiRequest<Warehouse[]>('/warehouses');
export const getStockMovements = (): Promise<StockMovement[]> => apiRequest<StockMovement[]>('/stockMovements?_expand=warehouse');
export const createStockMovement = (data: Omit<StockMovement, 'id'>): Promise<StockMovement> => apiRequest<StockMovement>('/stockMovements', 'POST', data);

export const getInventories = (): Promise<Inventory[]> => apiRequest<Inventory[]>('/inventories');
export const createInventory = (data: Omit<Inventory, 'id'>): Promise<Inventory> => apiRequest<Inventory>('/inventories', 'POST', data);
export const updateInventory = (id: string, data: Partial<Inventory>): Promise<Inventory> => apiRequest<Inventory>(`/inventories/${id}`, 'PATCH', data);

export const getUsers = (): Promise<User[]> => apiRequest<User[]>('/users');
export const createUser = (data: Omit<User, 'id' | 'creationDate'>): Promise<User> => apiRequest<User>('/users', 'POST', { ...data, creationDate: new Date().toISOString() });
export const updateUser = (id: string, data: Partial<User>): Promise<User> => apiRequest<User>(`/users/${id}`, 'PATCH', data);

export const getProfiles = (): Promise<Profile[]> => apiRequest<Profile[]>('/profiles');
export const createProfile = (data: Omit<Profile, 'id'>): Promise<Profile> => apiRequest<Profile>('/profiles', 'POST', data);
export const updateProfile = (id: string, data: Partial<Profile>): Promise<Profile> => apiRequest<Profile>(`/profiles/${id}`, 'PATCH', data);
export const deleteProfile = (id: string): Promise<void> => apiRequest<void>(`/profiles/${id}`, 'DELETE');

export const getSystemAudits = (): Promise<SystemAudit[]> => apiRequest<SystemAudit[]>('/systemAudits');

export const getSuppliers = (query?: string): Promise<Supplier[]> => apiRequest<Supplier[]>(`/suppliers${query ? `?q=${query}` : ''}`);
export const createSupplier = (data: Omit<Supplier, 'id'>): Promise<Supplier> => apiRequest<Supplier>("/suppliers", 'POST', data);
export const updateSupplier = (id: string, data: Partial<Supplier>): Promise<Supplier> => apiRequest<Supplier>(`/suppliers/${id}`, 'PATCH', data);
export const deleteSupplier = (id: string): Promise<void> => apiRequest<void>(`/suppliers/${id}`, 'DELETE');

export const getGeneralOptions = async (): Promise<GeneralOptions> => {
    const options = await apiRequest<GeneralOptions[]>('/generalOptions');
    return options[0];
};
export const updateGeneralOptions = (data: GeneralOptions): Promise<GeneralOptions> => apiRequest<GeneralOptions>('/generalOptions/main', 'PUT', data);

export const getFiscalYears = (): Promise<FiscalYear[]> => apiRequest<FiscalYear[]>('/fiscalYears');
export const createFiscalYear = (data: Omit<FiscalYear, 'id'>): Promise<FiscalYear> => apiRequest<FiscalYear>('/fiscalYears', 'POST', data);
export const updateFiscalYear = (id: string, data: Partial<FiscalYear>): Promise<FiscalYear> => apiRequest<FiscalYear>(`/fiscalYears/${id}`, 'PATCH', data);

// Nouvelles fonctions pour les filtres de journal et statistiques
export const getStockMovementsFiltered = (filters: JournalFilters): Promise<StockMovement[]> => {
    const params = new URLSearchParams();
    
    if (filters.dateFrom) params.append('date_gte', filters.dateFrom);
    if (filters.dateTo) params.append('date_lte', filters.dateTo);
    if (filters.movementType && filters.movementType !== 'all') params.append('type', filters.movementType);
    if (filters.warehouseId && filters.warehouseId !== 'all') params.append('warehouseId', filters.warehouseId);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.source && filters.source !== 'all') params.append('source', filters.source);
    if (filters.productId) params.append('items.productId', filters.productId);
    if (filters.reference) params.append('reference_like', filters.reference);
    
    return apiRequest<StockMovement[]>(`/stockMovements?${params.toString()}`);
};

export const getStockStatistics = async (warehouseId?: string): Promise<StockStats> => {
    const products = await getProducts();
    const movements = await getStockMovements();
    
    let filteredProducts = products;
    if (warehouseId && warehouseId !== 'all') {
        // Filter logic for warehouse-specific stats
        filteredProducts = products; // À implémenter selon la logique métier
    }
    
    const totalValue = filteredProducts.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
    const totalItems = filteredProducts.length;
    const lowStockItems = filteredProducts.filter(p => p.stock <= (p.threshold || 0)).length;
    const outOfStockItems = filteredProducts.filter(p => p.stock === 0).length;
    const expiringItems = 0; // À implémenter selon la logique des dates d'expiration
    
    const lastMovement = movements
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    return {
        totalValue,
        totalItems,
        lowStockItems,
        outOfStockItems,
        expiringItems,
        lastMovementDate: lastMovement?.date?.toString()
    };
};

export const validateStockMovement = (id: string): Promise<StockMovement> => 
    apiRequest<StockMovement>(`/stockMovements/${id}`, 'PATCH', { status: 'validated', validatedAt: new Date().toISOString() });

export const cancelStockMovement = (id: string): Promise<StockMovement> => 
    apiRequest<StockMovement>(`/stockMovements/${id}`, 'PATCH', { status: 'cancelled' });