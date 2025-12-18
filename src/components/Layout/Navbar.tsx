const Navbar = () => {
    return (
        <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
            <h1 className="text-lg font-semibold">Admin Panel</h1>

            <div className="flex items-center gap-4">
                <span className="text-gray-700">Admin</span>
                <img
                    src="https://ui-avatars.com/api/?name=Admin"
                    className="w-9 h-9 rounded-full"
                />
            </div>
        </header>
    );
};

export default Navbar;
