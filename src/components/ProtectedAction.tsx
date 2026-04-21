import { ReactNode } from 'react';
import { UserRole, canPerformAction, hasFeaturePermission } from '../utils/permissions';

interface ProtectedActionProps {
    children: ReactNode;
    userRole?: UserRole;
    action?: string;
    feature?: string;
    permission?: 'view' | 'create' | 'edit' | 'delete';
    fallback?: ReactNode;
    hideIfNoAccess?: boolean;
}

/**
 * Component that conditionally renders children based on user permissions
 *
 * Usage:
 * <ProtectedAction userRole={user.role} action="addMedicine">
 *   <button>Add Medicine</button>
 * </ProtectedAction>
 *
 * Or with feature-based permission:
 * <ProtectedAction userRole={user.role} feature="inventory" permission="create">
 *   <button>Create Item</button>
 * </ProtectedAction>
 */
export default function ProtectedAction({
    children,
    userRole,
    action,
    feature,
    permission,
    fallback = null,
    hideIfNoAccess = true,
}: ProtectedActionProps) {
    let hasAccess = false;

    // Check action-based permission
    if (action) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hasAccess = canPerformAction(userRole, action as any);
    }
    // Check feature-based permission
    else if (feature && permission) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hasAccess = hasFeaturePermission(userRole, feature as any, permission);
    }

    // If user has access, render children
    if (hasAccess) {
        return <>{children}</>;
    }

    // If no access and should hide, return null
    if (hideIfNoAccess) {
        return null;
    }

    // Otherwise render fallback (if provided)
    return <>{fallback}</>;
}

