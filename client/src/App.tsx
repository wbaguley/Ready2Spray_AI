import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Customers from "./pages/Customers";
import Personnel from "./pages/Personnel";
import Chat from "./pages/Chat";
import Maps from "./pages/Maps";
import ProductLookup from "./pages/ProductLookup";
import Settings from "./pages/Settings";
import JobDetail from "@/pages/JobDetail";
import FlightBoard from "@/pages/FlightBoard";
import Calendar from "@/pages/Calendar";
import Equipment from "@/pages/Equipment";
import EquipmentDashboard from "@/pages/EquipmentDashboard";
import Sites from "./pages/Sites";
import ServicePlans from "./pages/ServicePlans";
import EmailTest from "./pages/EmailTest";
import CustomerPortal from "./pages/CustomerPortal";
import UserManagement from "./pages/UserManagement";
import AuditLog from "./pages/AuditLog";
import BulkJobImport from "./pages/BulkJobImport";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/jobs/:id" component={JobDetail} />
      <Route path="/flight-board">
        {() => <ProtectedRoute requiredPermission="view_flight_board"><FlightBoard /></ProtectedRoute>}
      </Route>
      <Route path="/calendar" component={Calendar} />
      <Route path="/equipment" component={Equipment} />
      <Route path="/equipment-dashboard">
        {() => <ProtectedRoute requiredPermission="view_equipment_analytics"><EquipmentDashboard /></ProtectedRoute>}
      </Route>
        <Route path="/sites" component={Sites} />
      <Route path="/service-plans">
        {() => <ProtectedRoute requiredPermission="view_service_plans"><ServicePlans /></ProtectedRoute>}
      </Route>
        <Route path="/jobs" component={Jobs} />
        <Route path="/customers" component={Customers} />
        <Route path="/personnel">
          {() => <ProtectedRoute requiredPermission="view_personnel"><Personnel /></ProtectedRoute>}
        </Route>
        <Route path="/chat" component={Chat} />
        <Route path="/maps" component={Maps} />
        <Route path="/product-lookup" component={ProductLookup} />
        <Route path="/settings">
          {() => <ProtectedRoute requiredPermission="view_settings"><Settings /></ProtectedRoute>}
        </Route>
        <Route path="/email-test" component={EmailTest} />
        <Route path="/customer-portal" component={CustomerPortal} />
        <Route path="/user-management">
          {() => <ProtectedRoute requiredPermission="view_user_management"><UserManagement /></ProtectedRoute>}
        </Route>
        <Route path="/audit-log">
          {() => <ProtectedRoute requiredPermission="view_settings"><AuditLog /></ProtectedRoute>}
        </Route>
        <Route path="/bulk-import">
          {() => <ProtectedRoute requiredPermission="create_jobs"><BulkJobImport /></ProtectedRoute>}
        </Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
