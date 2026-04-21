import { useMemo } from 'react';
import {
    UserRole,
    hasFeaturePermission,
    canPerformAction,
    getRolePermissions,
    getRoleActions,
    canAccessPage,
    getAccessibleMenuItems,
    hasMinimumRole,
} from '../utils/permissions';

/**
 * Custom hook for checking user permissions
 * Usage: const { canView, canEdit, canDelete, canDo } = usePermissions(user.role);
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePermissions(role: UserRole | undefined) {
    return useMemo(() => {
        return {
            // Feature-based permissions
            canView: (feature: string) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return hasFeaturePermission(role, feature as any, 'view');
            },
            canCreate: (feature: string) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return hasFeaturePermission(role, feature as any, 'create');
            },
            canEdit: (feature: string) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return hasFeaturePermission(role, feature as any, 'edit');
            },
            canDelete: (feature: string) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return hasFeaturePermission(role, feature as any, 'delete');
            },

            // Action-based permissions
            canDo: (action: string) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return canPerformAction(role, action as any);
            },

            // Page access
            canAccessPage: (page: string) => {
                return canAccessPage(role, page);
            },

            // Get all permissions and actions
            getAllPermissions: () => getRolePermissions(role),
            getAllActions: () => getRoleActions(role),
            getAccessiblePages: () => getAccessibleMenuItems(role),

            // Role comparison
            hasMinimumRole: (requiredRole: UserRole) => {
                return hasMinimumRole(role, requiredRole);
            },

            // Specific common checks
            isAdmin: role === 'admin',
            isManager: role === 'manager',
            isStaff: role === 'staff',
            canManageUsers: canPerformAction(role, 'manageUsers'),
            canConfigureSystem: canPerformAction(role, 'configureSystem'),
        };
    }, [role]);
}

export default usePermissions;

