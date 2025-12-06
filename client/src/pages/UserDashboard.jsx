import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export function UserDashboard() {
  const { token, user } = useAuth();
  const [books, setBooks] = useState([]);
  const [lendings, setLendings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [b, l] = await Promise.all([
        api.books.list(token),
        user ? api.lending.forUser(token, user.id) : [],
      ]);
      setBooks(b);
      setLendings(l);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Panel użytkownika</h2>
          <p className="text-sm opacity-80">Przegląd dostępnych książek i Twoje wypożyczenia.</p>
        </div>
        <button className="btn btn-outline" onClick={loadData} disabled={loading}>
          Odśwież
        </button>
      </div>
      {message && <div className="alert alert-error">{message}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Dostępne książki</h3>
            <div className="overflow-y-auto max-h-[500px] space-y-2">
              {books.map((b) => (
                <div key={b.id} className="border border-base-200 rounded-lg p-3 bg-base-100">
                  <div className="flex justify-between">
                    <div className="font-semibold">{b.title}</div>
                    <div className="badge badge-outline">{b.quantity} szt.</div>
                  </div>
                  <div className="text-sm text-primary">{b.author}</div>
                  <div className="text-xs opacity-70">ISBN: {b.isbn}</div>
                  <p className="text-sm mt-1 line-clamp-3">{b.description}</p>
                </div>
              ))}
              {books.length === 0 && <div className="text-sm opacity-80">Brak książek</div>}
            </div>
          </div>
        </div>
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Moje wypożyczenia</h3>
            <div className="overflow-y-auto max-h-[500px] space-y-2">
              {lendings.map((l) => (
                <div key={l.id} className="border border-base-200 rounded-lg p-3 bg-base-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">Wypożyczenie #{l.id}</div>
                      <div className="text-sm text-primary">{books.find((b) => b.id === l.bookId)?.title || `Książka #${l.bookId}`}</div>
                      <div className="text-xs opacity-80">{books.find((b) => b.id === l.bookId)?.author}</div>
                    </div>
                    <div className={`badge ${l.returned ? "badge-success" : "badge-warning"}`}>
                      {l.returned ? "zwrócona" : "aktywna"}
                    </div>
                  </div>
                  <div className="text-xs opacity-70">Od: {l.lendingDate?.replace("T", " ").slice(0, 16)}</div>
                  {l.returnDate && <div className="text-xs opacity-70">Do: {l.returnDate.replace("T", " ").slice(0, 16)}</div>}
                </div>
              ))}
              {lendings.length === 0 && <div className="text-sm opacity-80">Brak wypożyczeń</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
