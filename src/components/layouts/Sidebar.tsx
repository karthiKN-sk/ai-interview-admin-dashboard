import { Link, useLocation } from "react-router-dom";
import {
    Bot,
    LayoutDashboard,
    CalendarCheck,
    PlusCircle,
    Settings, Calendar,
} from "lucide-react";

const Sidebar = () => {
    const { pathname } = useLocation();

    const linkClass = (path: string) =>
        `flex items-center gap-3 px-4 py-2 rounded-md transition-all ${pathname === path
            ? "bg-blue-400 text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <aside className="w-64 bg-white shadow-lg h-full p-4 flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <Bot size={26} className="text-blue-700" />
                GrootCruiter
            </h2>
            {/* Create Interview Button */}
            <Link
                to="/interviews/create"
                className="flex items-center gap-3 px-4 py-2 rounded-md w-50  ml-2
               bg-blue-700 text-white font-medium shadow 
               hover:bg-blue-600 transition-all"
            >
                <PlusCircle size={20} />
                Create Interview
            </Link>
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 mt-4 text-[15px] font-medium grow">
                <Link to="/" className={linkClass("/")}>
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link to="/scheduledInterviews" className={linkClass("/scheduledInterviews")}>
                    <Calendar size={20} />
                    Scheduled Interviews
                </Link>

                <Link to="/completedInterviews" className={linkClass("/completedInterviews")}>
                    <CalendarCheck size={20} />
                    Completed Interviews
                </Link>
                
                <Link to="/settings" className={linkClass("/settings")}>
                    <Settings size={20} />
                    Settings
                </Link>
            </nav>


        </aside>
    );
};

export default Sidebar;
