type NavBarProps = {
    token: string;
    onLoginClick: () => void;
    onLogout: () => void;
};

export default function NavBar({ token, onLoginClick, onLogout }: NavBarProps) {
    return (
        <nav className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-3 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-950">Products</h1>
            {token ? (
                <button onClick={onLogout} className="rounded bg-slate-950 px-5 py-2 font-bold text-white cursor-pointer">
                    Logout
                </button>
            ) : (
                <button onClick={onLoginClick} className="rounded bg-slate-950 px-5 py-2 font-bold text-white cursor-pointer">
                    Login
                </button>
            )}
        </nav>
    );
}