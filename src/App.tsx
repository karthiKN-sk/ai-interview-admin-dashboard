import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import CreateInterviewPage from "./pages/Interviews/CreateInterviewPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import Sidebar from "./components/Layout/Sidebar";
import Navbar from "./components/Layout/Navbar";
import CompletedInterviews from "./pages/Interviews/CompletedInterviews";
import CompletedInterviewsDetail from "./pages/Interviews/CompletedInterviewsDetail";
import ScheduledInterviews from "./pages/Interviews/ScheduledListPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/completedInterviews" element={<CompletedInterviews />} />
              <Route path="/scheduledInterviews" element={<ScheduledInterviews />} />
              <Route path="/completedInterviews/:id" element={<CompletedInterviewsDetail />} />
              <Route path="/interviews/create" element={<CreateInterviewPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
