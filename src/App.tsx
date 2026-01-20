import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import CreateInterviewPage from "./pages/Interviews/CreateInterviewPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import CompletedInterviews from "./pages/Interviews/CompletedInterviews";
import CompletedInterviewsDetail from "./pages/Interviews/CompletedInterviewsDetail";
import ScheduledInterviews from "./pages/Interviews/ScheduledListPage";
import LoginPage from "./pages/Auth/LoginPage";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import AppLayout from "./components/layouts/AppLayout";

function App() {
  return (
    <BrowserRouter basename="/ai-interview-admin-dashboard">
      <Routes>
        {/* Public Routes*/}
        <Route path="/login" element={<LoginPage />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/completedInterviews" element={<CompletedInterviews />} />
            <Route path="/scheduledInterviews" element={<ScheduledInterviews />} />
            <Route path="/completedInterviews/:id" element={<CompletedInterviewsDetail />} />
            <Route path="/interviews/create" element={<CreateInterviewPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
