import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Witaj w PaperTrail</h2>
          <div className="flex gap-2 mt-4">
            <Link className="btn btn-primary" to="/login">
              Zaloguj
            </Link>
            <Link className="btn btn-outline" to="/register">
              Rejestracja
            </Link>
          </div>
        </div>
      </div>
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Dostępne panele</h2>
          <ul className="space-y-2">
            <li>
              <b>Użytkownik</b> — przegląd książek, moje wypożyczenia.
            </li>
            <li>
              <b>Admin</b> — CRUD książek, wypożyczenia, podgląd logów.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
