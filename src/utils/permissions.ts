// Role-based access control configuration for PharmaCare
// Roles: admin, manager, staff

export type UserRole = 'admin' | 'manager' | 'staff';

export interface Permission {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

export interface FeaturePermissions {
    dashboard: Permission;
    inventory: Permission;
    alerts: Permission;
    suppliers: Permission;
    analytics: Permission;
    settings: Permission;
    users: Permission;
    reports: Permission;
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, FeaturePermissions> = {
    // ADMIN - Full access to all features
    admin: {
        dashboard: { view: true, create: true, edit: true, delete: true },
        inventory: { view: true, create: true, edit: true, delete: true },
        alerts: { view: true, create: true, edit: true, delete: true },
        suppliers: { view: true, create: true, edit: true, delete: true },
        analytics: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: true },
        users: { view: true, create: true, edit: true, delete: true },
        reports: { view: true, create: true, edit: true, delete: true },
    },

    // MANAGER - Can view all, create/edit most, limited delete
    manager: {
        dashboard: { view: true, create: true, edit: true, delete: false },
        inventory: { view: true, create: true, edit: true, delete: false },
        alerts: { view: true, create: true, edit: true, delete: false },
        suppliers: { view: true, create: true, edit: true, delete: false },
        analytics: { view: true, create: true, edit: false, delete: false },
        settings: { view: true, create: false, edit: true, delete: false }, // Can only edit own profile
        users: { view: true, create: false, edit: false, delete: false }, // Can only view users
        reports: { view: true, create: true, edit: false, delete: false },
    },

    // STAFF - View most, limited create/edit, no delete
    staff: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        inventory: { view: true, create: false, edit: false, delete: false },
        alerts: { view: true, create: false, edit: false, delete: false },
        suppliers: { view: true, create: false, edit: false, delete: false },
        analytics: { view: false, create: false, edit: false, delete: false }, // No analytics access
        settings: { view: true, create: false, edit: true, delete: false }, // Can only edit own profile
        users: { view: false, create: false, edit: false, delete: false }, // Cannot view users
        reports: { view: true, create: false, edit: false, delete: false },
    },
};

// Specific action permissions
export interface ActionPermissions {
    // Inventory actions
    addMedicine: boolean;
    editMedicine: boolean;
    deleteMedicine: boolean;
    adjustStock: boolean;
    importInventory: boolean;
    exportInventory: boolean;

    // Order actions
    createOrder: boolean;
    approveOrder: boolean;
    cancelOrder: boolean;
    generateReorder: boolean;

    // Supplier actions
    addSupplier: boolean;
    editSupplier: boolean;
    deleteSupplier: boolean;
    contactSupplier: boolean;

    // Alert actions
    dismissAlert: boolean;
    resolveAlert: boolean;
    deleteAlert: boolean;

    // Analytics actions
    viewAnalytics: boolean;
    exportReports: boolean;
    viewPredictions: boolean;

    // Settings actions
    editProfile: boolean;
    changePassword: boolean;
    manageUsers: boolean;
    configureSystem: boolean;
    configureThresholds: boolean;
    configureNotifications: boolean;
}

export const ROLE_ACTIONS: Record<UserRole, ActionPermissions> = {
    admin: {
        // Inventory
        addMedicine: true,
        editMedicine: true,
        deleteMedicine: true,
        adjustStock: true,
        importInventory: true,
        exportInventory: true,

        // Orders
        createOrder: true,
        approveOrder: true,
        cancelOrder: true,
        generateReorder: true,

        // Suppliers
        addSupplier: true,
        editSupplier: true,
        deleteSupplier: true,
        contactSupplier: true,

        // Alerts
        dismissAlert: true,
        resolveAlert: true,
        deleteAlert: true,

        // Analytics
        viewAnalytics: true,
        exportReports: true,
        viewPredictions: true,

        // Settings
        editProfile: true,
        changePassword: true,
        manageUsers: true,
        configureSystem: true,
        configureThresholds: true,
        configureNotifications: true,
    },

    manager: {
        // Inventory
        addMedicine: true,
        editMedicine: true,
        deleteMedicine: false, // Cannot delete, only archive
        adjustStock: true,
        importInventory: true,
        exportInventory: true,

        // Orders
        createOrder: true,
        approveOrder: true,
        cancelOrder: true,
        generateReorder: true,

        // Suppliers
        addSupplier: true,
        editSupplier: true,
        deleteSupplier: false,
        contactSupplier: true,

        // Alerts
        dismissAlert: true,
        resolveAlert: true,
        deleteAlert: false,

        // Analytics
        viewAnalytics: true,
        exportReports: true,
        viewPredictions: true,

        // Settings
        editProfile: true,
        changePassword: true,
        manageUsers: false, // Cannot manage other users
        configureSystem: false,
        configureThresholds: true,
        configureNotifications: true,
    },

    staff: {
        // Inventory
        addMedicine: false,
        editMedicine: false,
        deleteMedicine: false,
        adjustStock: false,
        importInventory: false,
        exportInventory: false,

        // Orders
        createOrder: false,
        approveOrder: false,
        cancelOrder: false,
        generateReorder: false,

        // Suppliers
        addSupplier: false,
        editSupplier: false,
        deleteSupplier: false,
        contactSupplier: false,

        // Alerts
        dismissAlert: true, // Can dismiss own viewed alerts
        resolveAlert: false,
        deleteAlert: false,

        // Analytics
        viewAnalytics: false,
        exportReports: false, // Can only view reports, not export
        viewPredictions: false,

        // Settings
        editProfile: true, // Can edit own profile
        changePassword: true,
        manageUsers: false,
        configureSystem: false,
        configureThresholds: false,
        configureNotifications: true, // Can configure own notifications
    },
};

/**
 * Check if user has permission for a feature
 */
export function hasFeaturePermission(
    role: UserRole | undefined,
    feature: keyof FeaturePermissions,
    action: keyof Permission
): boolean {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role];
    return permissions?.[feature]?.[action] || false;
}

/**
 * Check if user can perform a specific action
 */
export function canPerformAction(
    role: UserRole | undefined,
    action: keyof ActionPermissions
): boolean {
    if (!role) return false;
    return ROLE_ACTIONS[role]?.[action] || false;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole | undefined): FeaturePermissions | null {
    if (!role) return null;
    return ROLE_PERMISSIONS[role];
}

/**
 * Get all actions for a role
 */
export function getRoleActions(role: UserRole | undefined): ActionPermissions | null {
    if (!role) return null;
    return ROLE_ACTIONS[role];
}

/**
 * Check if user has access to a page
 */
export function canAccessPage(role: UserRole | undefined, page: string): boolean {
    if (!role) return false;

    const pageFeatureMap: Record<string, keyof FeaturePermissions> = {
        dashboard: 'dashboard',
        inventory: 'inventory',
        alerts: 'alerts',
        suppliers: 'suppliers',
        analytics: 'analytics',
        settings: 'settings',
    };

    const feature = pageFeatureMap[page];
    if (!feature) return false;

    return hasFeaturePermission(role, feature, 'view');
}

/**
 * Get accessible menu items for a role
 */
export function getAccessibleMenuItems(role: UserRole | undefined): string[] {
    if (!role) return [];

    const allPages = ['dashboard', 'inventory', 'alerts', 'suppliers', 'analytics', 'settings'];
    return allPages.filter(page => canAccessPage(role, page));
}

/**
 * Role hierarchy helper
 */
export function getRoleLevel(role: UserRole | undefined): number {
    const levels: Record<UserRole, number> = {
        admin: 3,
        manager: 2,
        staff: 1,
    };
    return role ? levels[role] : 0;
}

/**
 * Check if user role is at least the required role
 */
export function hasMinimumRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
    return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}

