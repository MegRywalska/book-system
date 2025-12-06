import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register, setError, error } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        setError("Hasła muszą być identyczne");
        setLoading(false);
        return;
      }
      const me = await register(firstName, lastName, email, password, confirmPassword);
      if (me.role === "ADMIN") nav("/admin");
      else nav("/user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="card-title">Rejestracja</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Imię</span>
              </div>
              <input className="input input-bordered" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Małgorzata" />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Nazwisko</span>
              </div>
              <input className="input input-bordered" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Rywalska" />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input className="input input-bordered" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@example.com" />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Hasło (min 6 znaków)</span>
              </div>
              <input className="input input-bordered" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="•••••••" />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Powtórz hasło</span>
              </div>
              <input className="input input-bordered" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} placeholder="•••••••" />
            </label>
            <button className="btn btn-primary w-full" disabled={loading} type="submit">
              {loading ? "Rejestracja..." : "Zarejestruj"}
            </button>
          </form>
          <div className="text-sm text-right">
            Masz już konto? <Link className="link" to="/login">Zaloguj</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
