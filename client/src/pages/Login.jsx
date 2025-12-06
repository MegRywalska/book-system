import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, setError, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const nav = useNavigate();

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const me = await login(email, password);
      if (me.role === "ADMIN") nav("/admin");
      else nav("/user");
    } catch (err) {
      const friendly = err?.message && err.message !== "Forbidden"
        ? err.message
        : "Nieprawidłowy email lub hasło. Sprawdź dane i spróbuj ponownie.";
      setError(friendly);
      showToast("error", friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto relative">
      {toast && (
        <div className={`alert ${toast.type === "error" ? "alert-error" : "alert-success"} shadow-lg fixed left-1/2 -translate-x-1/2 top-6 z-50 max-w-md w-[90%]`}>
          <div>
            <span>{toast.text}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setToast(null)}>✕</button>
        </div>
      )}
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="card-title">Logowanie</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input className="input input-bordered" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email " />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Hasło</span>
              </div>
              <input className="input input-bordered" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="•••••••" />
            </label>
            <button className="btn btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Logowanie..." : "Zaloguj"}
            </button>
          </form>
          <div className="text-sm text-right">
            Nie masz konta? <Link className="link" to="/register">Rejestracja</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
