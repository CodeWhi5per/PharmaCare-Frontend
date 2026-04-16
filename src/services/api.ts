/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('pharmacare_token');

const headers = (extra: Record<string, string> = {}): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...extra,
});

const handleResponse = async (res: Response) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

// AUTH
export const authAPI = {
    login: (email: string, password: string) =>
        fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) }).then(handleResponse),
    register: (name: string, email: string, password: string) =>
        fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify({ name, email, password }) }).then(handleResponse),
    getMe: () =>
        fetch(`${API_BASE}/auth/me`, { headers: headers() }).then(handleResponse),

    // OTP registration
    sendRegistrationOtp: (email: string) =>
        fetch(`${API_BASE}/auth/send-registration-otp`, { method: 'POST', headers: headers(), body: JSON.stringify({ email }) }).then(handleResponse),
    verifyRegistrationOtp: (name: string, email: string, password: string, otp: string) =>
        fetch(`${API_BASE}/auth/verify-registration-otp`, { method: 'POST', headers: headers(), body: JSON.stringify({ name, email, password, otp }) }).then(handleResponse),

    // Forgot password
    forgotPassword: (email: string) =>
        fetch(`${API_BASE}/auth/forgot-password`, { method: 'POST', headers: headers(), body: JSON.stringify({ email }) }).then(handleResponse),
    verifyForgotOtp: (email: string, otp: string) =>
        fetch(`${API_BASE}/auth/verify-forgot-otp`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, otp }) }).then(handleResponse),
    resetPassword: (email: string, resetToken: string, newPassword: string) =>
        fetch(`${API_BASE}/auth/reset-password`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, resetToken, newPassword }) }).then(handleResponse),
};

// DASHBOARD
export const dashboardAPI = {
    getStats: () => fetch(`${API_BASE}/dashboard/stats`, { headers: headers() }).then(handleResponse),
    getConsumptionChart: () => fetch(`${API_BASE}/dashboard/consumption-chart`, { headers: headers() }).then(handleResponse),
    getStockPrediction: () => fetch(`${API_BASE}/dashboard/stock-prediction`, { headers: headers() }).then(handleResponse),
    getRecentActivity: () => fetch(`${API_BASE}/dashboard/recent-activity`, { headers: headers() }).then(handleResponse),
};

// INVENTORY
export const inventoryAPI = {
    getAll: (params: Record<string, string> = {}) => {
        const qs = new URLSearchParams(params).toString();
        return fetch(`${API_BASE}/inventory${qs ? '?' + qs : ''}`, { headers: headers() }).then(handleResponse);
    },
    getOne: (id: string) => fetch(`${API_BASE}/inventory/${id}`, { headers: headers() }).then(handleResponse),
    create: (data: any) =>
        fetch(`${API_BASE}/inventory`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
    update: (id: string, data: any) =>
        fetch(`${API_BASE}/inventory/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
    delete: (id: string) =>
        fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse),
    reorder: (id: string, quantity: number) =>
        fetch(`${API_BASE}/inventory/${id}/reorder`, { method: 'POST', headers: headers(), body: JSON.stringify({ quantity }) }).then(handleResponse),
    getLowStock: () =>
        fetch(`${API_BASE}/inventory/low-stock`, { headers: headers() }).then(handleResponse),
    bulkReorder: (medicines: Array<{ id: string; quantity: number }>) =>
        fetch(`${API_BASE}/inventory/bulk-reorder`, { method: 'POST', headers: headers(), body: JSON.stringify({ medicines }) }).then(handleResponse),
};

// ALERTS
export const alertsAPI = {
    getAll: (filter?: string) => {
        const qs = filter && filter !== 'All' ? `?filter=${encodeURIComponent(filter)}` : '';
        return fetch(`${API_BASE}/alerts${qs}`, { headers: headers() }).then(handleResponse);
    },
    create: (data: any) =>
        fetch(`${API_BASE}/alerts`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
    resolve: (id: string) =>
        fetch(`${API_BASE}/alerts/${id}/resolve`, { method: 'PATCH', headers: headers() }).then(handleResponse),
    dismiss: (id: string) =>
        fetch(`${API_BASE}/alerts/${id}/dismiss`, { method: 'PATCH', headers: headers() }).then(handleResponse),
};

// SUPPLIERS
export const suppliersAPI = {
    getAll: (search = '') => {
        const qs = search ? `?search=${encodeURIComponent(search)}` : '';
        return fetch(`${API_BASE}/suppliers${qs}`, { headers: headers() }).then(handleResponse);
    },
    create: (data: any) =>
        fetch(`${API_BASE}/suppliers`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
    update: (id: string, data: any) =>
        fetch(`${API_BASE}/suppliers/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
    delete: (id: string) =>
        fetch(`${API_BASE}/suppliers/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse),
    getCommunications: () =>
        fetch(`${API_BASE}/suppliers/communications`, { headers: headers() }).then(handleResponse),
};

// ANALYTICS
export const analyticsAPI = {
    getTopMedicines: () => fetch(`${API_BASE}/analytics/top-medicines`, { headers: headers() }).then(handleResponse),
    getDemandForecast: () => fetch(`${API_BASE}/analytics/demand-forecast`, { headers: headers() }).then(handleResponse),
    getUsageHeatmap: () => fetch(`${API_BASE}/analytics/usage-heatmap`, { headers: headers() }).then(handleResponse),
    getRevenue: () => fetch(`${API_BASE}/analytics/revenue`, { headers: headers() }).then(handleResponse),
};

// SETTINGS
export const settingsAPI = {
    getProfile: () => fetch(`${API_BASE}/settings/profile`, { headers: headers() }).then(handleResponse),
    updateProfile: (data: any) =>
        fetch(`${API_BASE}/settings/profile`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
    changePassword: (currentPassword: string, newPassword: string) =>
        fetch(`${API_BASE}/settings/password`, { method: 'PUT', headers: headers(), body: JSON.stringify({ currentPassword, newPassword }) }).then(handleResponse),
    updateNotifications: (data: any) =>
        fetch(`${API_BASE}/settings/notifications`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
    updateThresholds: (data: any) =>
        fetch(`${API_BASE}/settings/thresholds`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
};
