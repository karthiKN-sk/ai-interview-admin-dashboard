import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
