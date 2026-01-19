import { useAuthStore } from "../../store/authStore";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";



const Navbar = () => {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
            <h1 className="text-lg font-semibold">Admin Panel</h1>

            <div className="flex items-center gap-4">
                {/* Admin Name */}
                <span className="text-gray-700 font-medium">
                    {user?.name || "Admin"}
                </span>

                {/* Avatar */}
                <img
                    src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}`}
                    alt="Admin Avatar"
                    className="w-9 h-9 rounded-full"
                />

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
