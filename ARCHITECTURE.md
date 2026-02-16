# PharmaCare - Project Architecture Guide
*For Beginners* 📚

---

## 🏗️ What is This Project?

**PharmaCare** is a pharmacy inventory management system built as a web application. It helps pharmacies track their medicines, manage stock levels, handle suppliers, and get alerts when medicines are running low.

---

## 🛠️ Technology Stack (Tools Used)

### Frontend Framework
- **React 18** - A JavaScript library for building user interfaces
- **TypeScript** - JavaScript with type checking (helps catch errors early)
- **Vite** - A super-fast build tool and development server

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework (write styles using class names)
- **Lucide React** - Beautiful icon library for UI elements

### Backend & Database
- **Supabase** - Backend-as-a-Service (provides database, authentication, and APIs)

### Development Tools
- **ESLint** - Finds and fixes problems in your code
- **PostCSS** - Tool for processing CSS
- **TypeScript Compiler** - Converts TypeScript to JavaScript

---

## 📁 Project Structure Explained

```
pharma-care/
│
├── public/                     # Static files (images, icons)
│   └── vite.svg               # Vite logo
│
├── src/                        # Source code (where you write your code)
│   ├── main.tsx               # Entry point - App starts here
│   ├── App.tsx                # Root component - Main app logic
│   ├── index.css              # Global styles
│   ├── vite-env.d.ts          # TypeScript definitions for Vite
│   │
│   ├── components/            # Reusable UI pieces
│   │   ├── AddMedicineModal.tsx        # Popup to add new medicine
│   │   ├── AlertPanel.tsx              # Shows warnings/alerts
│   │   ├── ConsumptionChart.tsx        # Graph showing medicine usage
│   │   ├── ExportReportModal.tsx       # Popup to export reports
│   │   ├── GenerateReorderModal.tsx    # Popup to reorder medicines
│   │   ├── Header.tsx                  # Top navigation bar
│   │   ├── QuickActions.tsx            # Quick action buttons
│   │   ├── RecentActivity.tsx          # Recent actions list
│   │   ├── Sidebar.tsx                 # Left navigation menu
│   │   ├── StatCard.tsx                # Card showing statistics
│   │   └── StockPredictionChart.tsx    # Graph predicting stock needs
│   │
│   └── pages/                 # Full page views
│       ├── Dashboard.tsx      # Main homepage
│       ├── Inventory.tsx      # Medicine inventory page
│       ├── Alerts.tsx         # Alerts & notifications page
│       ├── Suppliers.tsx      # Supplier management page
│       ├── Analytics.tsx      # Analytics & reports page
│       ├── Settings.tsx       # Settings page
│       └── Login.tsx          # Login page
│
├── index.html                 # Main HTML file
├── package.json               # Project dependencies & scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js         # PostCSS configuration
└── eslint.config.js          # ESLint configuration
```

---

## 🔄 How the Application Works (Data Flow)

### 1. **Application Startup**
```
index.html → main.tsx → App.tsx
```
- Browser loads `index.html`
- React loads `main.tsx` (entry point)
- `main.tsx` renders `App.tsx` (main component)

### 2. **User Login Flow**
```
User → Login Page → Authentication → Dashboard
```
- User sees `Login.tsx` first
- After login, state changes (`isLoggedIn = true`)
- App shows Dashboard with Sidebar & Header

### 3. **Navigation Flow**
```
User clicks Sidebar → App.tsx changes page → Renders new Page Component
```
- User clicks menu item in `Sidebar.tsx`
- `currentPage` state updates
- `App.tsx` renders corresponding page component

### 4. **Component Hierarchy**
```
App.tsx (Root)
├── Login.tsx (if not logged in)
└── Main Layout (if logged in)
    ├── Sidebar.tsx
    ├── Header.tsx
    └── Page Component (Dashboard, Inventory, etc.)
        └── Child Components (StatCard, Charts, Modals, etc.)
```

---

## 📄 File Descriptions

### Core Files

#### `main.tsx` - The Starting Point
```typescript
// What it does:
- Entry point of the application
- Imports React and App component
- Renders App to the HTML element with id="root"
```

#### `App.tsx` - The Brain
```typescript
// What it does:
- Manages login state (isLoggedIn)
- Manages current page (currentPage)
- Shows Login page if not logged in
- Shows main layout with Sidebar, Header, and Pages if logged in
- Routes between different pages
```

#### `index.css` - Global Styles
```css
/* What it does:
- Imports TailwindCSS
- Defines global fonts and colors
- Sets up base styling for the entire app
*/
```

---

## 🎨 Components Explained

### Layout Components

#### `Sidebar.tsx` - Navigation Menu
- **Purpose**: Left-side navigation menu
- **Features**:
  - Shows PharmaCare logo
  - Lists all pages (Dashboard, Inventory, Alerts, etc.)
  - Highlights current active page
  - Click to navigate between pages

#### `Header.tsx` - Top Bar
- **Purpose**: Top navigation bar
- **Features**:
  - Shows page title
  - User profile/logout button
  - Notifications (optional)

---

### Dashboard Components

#### `StatCard.tsx` - Statistics Display
- **Purpose**: Shows important numbers in a card
- **Example**: Total Medicines, Low Stock Items, Expiring Soon

#### `AlertPanel.tsx` - Warning Display
- **Purpose**: Shows urgent alerts and warnings
- **Example**: "Aspirin is low on stock", "Medicine X expires in 3 days"

#### `ConsumptionChart.tsx` - Usage Graph
- **Purpose**: Visual chart showing medicine consumption over time
- **Data**: Daily/weekly/monthly usage patterns

#### `StockPredictionChart.tsx` - Prediction Graph
- **Purpose**: Predicts when you'll run out of stock
- **Data**: Based on current usage patterns

#### `QuickActions.tsx` - Action Buttons
- **Purpose**: Fast access buttons for common tasks
- **Actions**: Add Medicine, Generate Reorder, Export Report

#### `RecentActivity.tsx` - Activity Log
- **Purpose**: Shows recent actions and changes
- **Example**: "Added Paracetamol", "Updated Supplier X"

---

### Modal Components (Popups)

#### `AddMedicineModal.tsx`
- **Purpose**: Popup form to add new medicine
- **Fields**: Medicine name, quantity, expiry date, supplier, etc.

#### `GenerateReorderModal.tsx`
- **Purpose**: Popup to generate reorder list
- **Output**: List of medicines to reorder from suppliers

#### `ExportReportModal.tsx`
- **Purpose**: Popup to export reports
- **Options**: PDF, Excel, date range selection

---

## 📱 Pages Explained

### `Dashboard.tsx` - Homepage
- **What you see**: Overview of everything
- **Components used**:
  - StatCards (Total medicines, low stock, expiring soon)
  - AlertPanel (Urgent warnings)
  - Charts (Consumption & Prediction)
  - QuickActions (Add, Reorder, Export)
  - RecentActivity (Latest changes)

### `Inventory.tsx` - Medicine List
- **What you see**: List/table of all medicines
- **Features**:
  - Search and filter medicines
  - View medicine details
  - Edit/delete medicines
  - Sort by name, quantity, expiry date

### `Alerts.tsx` - Notifications
- **What you see**: All alerts and warnings
- **Types**:
  - Low stock alerts
  - Expiry warnings
  - Out of stock items

### `Suppliers.tsx` - Supplier Management
- **What you see**: List of suppliers
- **Features**:
  - Add/edit/delete suppliers
  - View supplier details
  - Contact information

### `Analytics.tsx` - Reports & Analysis
- **What you see**: Detailed reports and charts
- **Features**:
  - Sales trends
  - Stock movement
  - Supplier performance
  - Custom reports

### `Settings.tsx` - Configuration
- **What you see**: App settings
- **Options**:
  - User profile
  - Notification preferences
  - Alert thresholds
  - System settings

### `Login.tsx` - Authentication
- **What you see**: Login form
- **Fields**: Username/Email and Password
- **Action**: Authenticates user and redirects to Dashboard

---

## 🎯 State Management

### What is "State"?
State is data that can change over time. When state changes, the UI updates automatically.

### States in App.tsx
```typescript
1. isLoggedIn (boolean)
   - true: Show main app
   - false: Show login page

2. currentPage (string)
   - 'dashboard': Show Dashboard
   - 'inventory': Show Inventory
   - 'alerts': Show Alerts
   - etc.
```

### How State Changes
```
User Action → Event Handler → setState → React Re-renders → UI Updates
```

**Example:**
```typescript
User clicks "Inventory" → onNavigate('inventory') 
→ setCurrentPage('inventory') → App re-renders 
→ Shows Inventory page
```

---

## 🎨 Styling Approach

### TailwindCSS Utility Classes
Instead of writing CSS files, we use class names:

```typescript
// Traditional CSS:
<div className="card">...</div>
// CSS file: .card { padding: 1rem; background: white; border-radius: 0.5rem; }

// Tailwind approach:
<div className="p-4 bg-white rounded-lg">...</div>
```

### Color Scheme
- **Primary Green**: `#2EBE76` and `#0BAF8C` (buttons, highlights)
- **Background**: `#F7FDFC` (light mint)
- **Text**: `#1A1A1A` (dark gray)
- **Secondary Text**: `#6C757D` (medium gray)

---

## 🔌 How Components Communicate

### 1. **Props (Parent → Child)**
Parent sends data to child:
```typescript
// Parent (App.tsx)
<Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

// Child (Sidebar.tsx) receives:
function Sidebar({ currentPage, onNavigate }) {
  // Can use currentPage and onNavigate
}
```

### 2. **Callbacks (Child → Parent)**
Child sends action back to parent:
```typescript
// Child clicks button
<button onClick={() => onNavigate('inventory')}>Inventory</button>

// Parent receives the action and updates state
const setCurrentPage = (page) => { ... }
```

### 3. **State Lifting**
When two components need to share data, lift the state to their common parent.

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
- Starts development server
- Opens app at `http://localhost:5173`
- Hot reload: Changes appear instantly

### Build for Production
```bash
npm run build
```
- Creates optimized production files
- Output goes to `dist/` folder

### Type Checking
```bash
npm run typecheck
```
- Checks for TypeScript errors without building

### Linting
```bash
npm run lint
```
- Checks code quality and style issues

---

## 📦 Key Dependencies

### Production Dependencies
```json
{
  "react": "UI library for building components",
  "react-dom": "React renderer for web browsers",
  "@supabase/supabase-js": "Backend database & auth",
  "lucide-react": "Icon library"
}
```

### Development Dependencies
```json
{
  "vite": "Build tool & dev server",
  "typescript": "Type checking for JavaScript",
  "tailwindcss": "Utility-first CSS framework",
  "eslint": "Code quality checker"
}
```

---

## 🔐 Authentication Flow

```
1. User opens app → App.tsx checks isLoggedIn
2. isLoggedIn = false → Show Login.tsx
3. User enters credentials → Login component validates
4. Valid credentials → onLogin() callback → setIsLoggedIn(true)
5. App.tsx re-renders → Shows main layout with Dashboard
```

---

## 📊 Data Structure Examples

### Medicine Object
```typescript
{
  id: "1",
  name: "Paracetamol 500mg",
  quantity: 500,
  minQuantity: 100,
  expiryDate: "2026-12-31",
  supplier: "MedSupply Inc",
  price: 5.99,
  category: "Pain Relief"
}
```

### Alert Object
```typescript
{
  id: "1",
  type: "low_stock",
  message: "Aspirin is running low",
  severity: "high",
  timestamp: "2026-02-15T10:30:00"
}
```

---

## 🎓 Learning Path for Beginners

### 1. **Start Here**
- `index.html` - See how React connects
- `main.tsx` - Entry point
- `App.tsx` - Main logic

### 2. **Learn Components**
- `Sidebar.tsx` - Simple navigation
- `Header.tsx` - Top bar
- `StatCard.tsx` - Reusable component

### 3. **Understand Pages**
- `Dashboard.tsx` - How components combine
- `Inventory.tsx` - List/table rendering

### 4. **Advanced Features**
- Modals (AddMedicineModal, etc.)
- Charts (ConsumptionChart, StockPredictionChart)
- State management across components

---

## 🐛 Common Beginner Mistakes & Solutions

### 1. **Forgetting to import components**
```typescript
// ❌ Error: Component not imported
<StatCard title="Total" value="100" />

// ✅ Solution: Import at top
import StatCard from '../components/StatCard';
```

### 2. **Props not passed correctly**
```typescript
// ❌ Error: Props don't match
<Sidebar page={currentPage} />

// ✅ Solution: Use correct prop names
<Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
```

### 3. **State not updating**
```typescript
// ❌ Error: Direct mutation
currentPage = 'inventory';

// ✅ Solution: Use setState function
setCurrentPage('inventory');
```

---

## 📝 File Naming Conventions

- **Components**: PascalCase (e.g., `StatCard.tsx`, `AddMedicineModal.tsx`)
- **Pages**: PascalCase (e.g., `Dashboard.tsx`, `Inventory.tsx`)
- **Config files**: lowercase with dots (e.g., `vite.config.ts`, `tailwind.config.js`)
- **Styles**: lowercase (e.g., `index.css`)

---

## 🎯 Best Practices Used

1. **Component Reusability**: Components like `StatCard` can be used multiple times
2. **Separation of Concerns**: Pages and Components are separated
3. **TypeScript**: Types prevent errors (e.g., `DashboardProps`, `SidebarProps`)
4. **Consistent Styling**: TailwindCSS for uniform look
5. **State Lifting**: Shared state in parent components

---

## 🚦 Application Flow Summary

```
START
  ↓
index.html loads
  ↓
main.tsx executes
  ↓
App.tsx renders
  ↓
Is user logged in?
  ├─ NO → Show Login.tsx
  │         ↓
  │      User logs in
  │         ↓
  │      setIsLoggedIn(true)
  │         ↓
  └─ YES → Show Main Layout
            ├─ Sidebar (navigation)
            ├─ Header (top bar)
            └─ Current Page
               ├─ Dashboard
               ├─ Inventory
               ├─ Alerts
               ├─ Suppliers
               ├─ Analytics
               └─ Settings
```

---

## 📚 Further Learning Resources

### To understand this project better, learn:
1. **React Basics** - Components, Props, State
2. **TypeScript** - Types, Interfaces
3. **TailwindCSS** - Utility classes
4. **React Hooks** - useState, useEffect
5. **Component Composition** - Building UIs with components

### Recommended Order:
1. HTML/CSS/JavaScript basics
2. React fundamentals
3. TypeScript basics
4. TailwindCSS
5. Advanced React patterns

---

## 💡 Quick Tips

- **Each `.tsx` file** is a React component
- **Components** are like LEGO blocks - combine them to build pages
- **Props** pass data from parent to child (one way only)
- **State** holds data that can change
- **When state changes**, React automatically updates the UI
- **TailwindCSS classes** replace traditional CSS files

---

## 🎉 Summary

**PharmaCare** is a modern web app for managing pharmacy inventory. It uses:
- **React** for UI components
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Vite** for fast development
- **Supabase** for backend

The app follows a **component-based architecture** where small reusable pieces (components) combine to create pages, and pages combine to create the full application.

**Key Concept**: Everything is a component! 🧩

---

*Made with ❤️ for beginners learning React & TypeScript*

