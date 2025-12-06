import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Footer } from "./Footer";

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div data-theme="aqua" className="min-h-screen bg-base-200 text-base-content flex flex-col">
      <div className="navbar bg-base-300 shadow-md px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2">
            <img src="/logo.png" alt="PaperTrail" className="h-9 w-9 rounded-md object-contain" />
            <span>PaperTrail</span>
          </Link>
          <div className="flex gap-2 ml-4">
            <Link to="/" className={`btn btn-sm ${loc.pathname === "/" ? "btn-primary" : "btn-ghost"}`}>
              Start
            </Link>
            <Link to="/user" className={`btn btn-sm ${loc.pathname.startsWith("/user") ? "btn-primary" : "btn-ghost"}`}>
              Użytkownik
            </Link>
            <Link to="/admin" className={`btn btn-sm ${loc.pathname.startsWith("/admin") ? "btn-primary" : "btn-ghost"}`}>
              Admin
            </Link>
          </div>
        </div>
        <div className="flex-none gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <div className="font-semibold">{user.email}</div>
                <div className="badge badge-outline badge-sm">{user.role}</div>
              </div>
              <button className="btn btn-sm btn-outline" onClick={handleLogout}>
                Wyloguj
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-sm btn-primary">
                Zaloguj
              </Link>
              <Link to="/register" className="btn btn-sm btn-outline">
                Rejestracja
              </Link>
            </div>
          )}
        </div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8 w-full">{children}</main>
      <Footer />
    </div>
  );
}
