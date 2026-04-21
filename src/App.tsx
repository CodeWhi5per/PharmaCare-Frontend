import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Alerts from './pages/Alerts';
import Suppliers from './pages/Suppliers';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Read user from localStorage (set during login/register)
    const storedUser = localStorage.getItem('pharmacare_user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard onNavigate={setCurrentPage} />;
            case 'inventory':
                return <Inventory />;
            case 'alerts':
                return <Alerts />;
            case 'suppliers':
                return <Suppliers />;
            case 'analytics':
                return <Analytics />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#F7FDFC]">
            <Sidebar
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                userRole={user?.role as 'admin' | 'manager' | 'staff'}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onLogout={() => { localStorage.removeItem('pharmacare_token'); localStorage.removeItem('pharmacare_user'); setIsLoggedIn(false); }}
                    onNavigate={(page: string) => setCurrentPage(page)}
                    user={user}
                />
                <main className="flex-1 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}

export default App;
