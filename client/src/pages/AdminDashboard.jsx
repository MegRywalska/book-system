import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const emptyBook = { id: "", title: "", author: "", description: "", isbn: "", publishDate: "", quantity: 1 };

export function AdminDashboard() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [lendings, setLendings] = useState([]);
  const [logs, setLogs] = useState({ content: [], totalElements: 0 });
  const [bookForm, setBookForm] = useState(emptyBook);
  const [lendForm, setLendForm] = useState({ bookId: "", userId: "" });
  const [logFilters, setLogFilters] = useState({ level: "", action: "", username: "", source: "", page: 0, size: 10 });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lendPage, setLendPage] = useState(0);
  const lendPageSize = 10;

  const showToast = (type, text) => setToast({ type, text });

  const loadBooks = async () => {
    const data = await api.books.list(token);
    setBooks(data);
  };

  const loadLendings = async () => {
    const data = await api.lending.list(token);
    setLendings(data);
  };

  const loadLogs = async () => {
    const data = await api.logs.search(token, logFilters);
    setLogs(data);
  };

  const init = async () => {
    setLoading(true);
    setToast(null);
    try {
      await Promise.all([loadBooks(), loadLendings(), loadLogs()]);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookSubmit = async (method) => {
    setToast(null);
    try {
      if (method === "create") {
        await api.books.create(token, { ...bookForm, id: undefined });
      } else if (method === "update") {
        if (!bookForm.id) throw new Error("Podaj ID książki");
        await api.books.update(token, bookForm.id, bookForm);
      } else if (method === "delete") {
        if (!bookForm.id) throw new Error("Podaj ID książki");
        await api.books.remove(token, bookForm.id);
      }
      await loadBooks();
      setBookForm(emptyBook);
      showToast("success", "Operacja książki zakończona.");
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleLend = async () => {
    setToast(null);
    try {
      if (!lendForm.bookId) throw new Error("Podaj Book ID");
      if (!lendForm.userId) throw new Error("Podaj userId");

      await api.lending.lend(token, {
        bookId: Number(lendForm.bookId),
        userId: Number(lendForm.userId),
      });
      await loadLendings();
      setLendForm({ bookId: "", userId: "" });
      showToast("success", "Wypożyczenie utworzone.");
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleReturn = async (lendingId) => {
    setToast(null);
    try {
      await api.lending.returnBook(token, lendingId);
      await loadLendings();
      showToast("success", "Zwrot zapisany.");
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleLogsSearch = async () => {
    setToast(null);
    try {
      await loadLogs();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const pagedLendings = useMemo(() => {
    const start = lendPage * lendPageSize;
    return lendings.slice(start, start + lendPageSize);
  }, [lendings, lendPage]);
  const lendPages = Math.max(1, Math.ceil(lendings.length / lendPageSize));

  const getBookTitle = (bookId) => books.find((b) => b.id === bookId)?.title || `Książka #${bookId}`;

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`alert ${toast.type === "error" ? "alert-error" : "alert-success"} shadow-lg`}>
          <div>
            <span>{toast.text}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setToast(null)}>
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Panel administratora</h2>
          <p className="text-sm opacity-80">CRUD książek, wypożyczenia, logi systemowe.</p>
        </div>
        <button className="btn btn-outline" onClick={init} disabled={loading}>
          Odśwież wszystko
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title">Książki</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="form-control col-span-2">
                <span className="label-text">ID (dla edycji/usunięcia)</span>
                <input className="input input-bordered" value={bookForm.id} onChange={(e) => setBookForm({ ...bookForm, id: e.target.value })} />
              </label>
              <label className="form-control">
                <span className="label-text">Tytuł</span>
                <input className="input input-bordered" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} />
              </label>
              <label className="form-control">
                <span className="label-text">Autor</span>
                <input className="input input-bordered" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} />
              </label>
              <label className="form-control col-span-2">
                <span className="label-text">Opis</span>
                <textarea className="textarea textarea-bordered" value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} />
              </label>
              <label className="form-control">
                <span className="label-text">ISBN</span>
                <input className="input input-bordered" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} />
              </label>
              <label className="form-control">
                <span className="label-text">Data publikacji</span>
                <input className="input input-bordered" type="date" value={bookForm.publishDate} onChange={(e) => setBookForm({ ...bookForm, publishDate: e.target.value })} />
              </label>
              <label className="form-control">
                <span className="label-text">Ilość</span>
                <input className="input input-bordered" type="number" min={0} value={bookForm.quantity} onChange={(e) => setBookForm({ ...bookForm, quantity: Number(e.target.value) })} />
              </label>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-success" onClick={() => handleBookSubmit("create")}>Dodaj</button>
              <button className="btn btn-primary" onClick={() => handleBookSubmit("update")}>Zapisz zmiany</button>
              <button className="btn btn-error" onClick={() => handleBookSubmit("delete")}>Usuń</button>
              <button className="btn btn-ghost" onClick={() => setBookForm(emptyBook)}>Wyczyść</button>
            </div>
            <div className="divider"></div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {books.map((b) => (
                <div key={b.id} className="border border-base-200 rounded-lg p-3 bg-base-100">
                  <div className="flex justify-between">
                    <div className="font-semibold">{b.title}</div>
                    <div className="badge badge-outline">{b.quantity} szt.</div>
                  </div>
                  <div className="text-sm text-primary">{b.author}</div>
                  <div className="text-xs opacity-70">ISBN: {b.isbn}</div>
                  <div className="text-xs opacity-70">Index: {b.id}</div>
                </div>
              ))}
              {books.length === 0 && <div className="text-sm opacity-70">Brak książek</div>}
            </div>
          </div>
        </div>

        <div className="card bg-base-300 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title">Wypożyczenia</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="form-control">
                <span className="label-text">Book ID</span>
                <input className="input input-bordered" value={lendForm.bookId} onChange={(e) => setLendForm({ ...lendForm, bookId: e.target.value })} />
              </label>
              <label className="form-control">
                <span className="label-text">User ID</span>
                <input className="input input-bordered" value={lendForm.userId} onChange={(e) => setLendForm({ ...lendForm, userId: e.target.value })} />
              </label>
            </div>
            <button className="btn btn-primary" onClick={handleLend}>Wypożycz</button>
            <div className="divider"></div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {pagedLendings.map((l) => (
                <div key={l.id} className="border border-base-200 rounded-lg p-3 bg-base-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">#{l.id} | {getBookTitle(l.bookId)}</div>
                      <div className="text-xs">użytkownik ID: {l.userId}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`badge ${l.returned ? "badge-success" : "badge-warning"}`}>
                        {l.returned ? "zwrócona" : "aktywna"}
                      </div>
                      <button className="btn btn-xs btn-secondary" disabled={l.returned} onClick={() => handleReturn(l.id)}>
                        Zwróć
                      </button>
                    </div>
                  </div>
                  <div className="text-xs opacity-70">od: {l.lendingDate?.replace("T", " ").slice(0, 16)}</div>
                  {l.returnDate && <div className="text-xs opacity-70">do: {l.returnDate.replace("T", " ").slice(0, 16)}</div>}
                </div>
              ))}
              {lendings.length === 0 && <div className="text-sm opacity-70">Brak wypożyczeń</div>}
              {lendings.length > lendPageSize && (
                <div className="join w-full justify-center">
                  <button className="join-item btn btn-sm" disabled={lendPage === 0} onClick={() => setLendPage((p) => Math.max(0, p - 1))}>«</button>
                  <button className="join-item btn btn-sm no-animation">Strona {lendPage + 1} / {lendPages}</button>
                  <button className="join-item btn btn-sm" disabled={lendPage + 1 >= lendPages} onClick={() => setLendPage((p) => Math.min(lendPages - 1, p + 1))}>»</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-300 shadow-lg">
        <div className="card-body space-y-3">
          <h3 className="card-title">Logi</h3>
          <div className="grid md:grid-cols-6 gap-3">
            {["level", "action", "username", "source", "from", "to"].map((field) => (
              <label key={field} className="form-control">
                <span className="label-text capitalize">{field}</span>
                <input
                  className="input input-bordered"
                  value={logFilters[field] ?? ""}
                  onChange={(e) => setLogFilters({ ...logFilters, [field]: e.target.value })}
                  placeholder={field === "from" || field === "to" ? "2025-12-02T00:00:00Z" : ""}
                />
              </label>
            ))}
            <label className="form-control">
              <span className="label-text">Page</span>
              <input className="input input-bordered" type="number" min={0} value={logFilters.page} onChange={(e) => setLogFilters({ ...logFilters, page: Number(e.target.value) })} />
            </label>
            <label className="form-control">
              <span className="label-text">Size</span>
              <input className="input input-bordered" type="number" min={1} value={logFilters.size} onChange={(e) => setLogFilters({ ...logFilters, size: Number(e.target.value) })} />
            </label>
          </div>
          <button className="btn btn-outline" onClick={handleLogsSearch}>Szukaj logów</button>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>czas</th>
                  <th>level</th>
                  <th>action</th>
                  <th>user</th>
                  <th>source</th>
                  <th>message</th>
                </tr>
              </thead>
              <tbody>
                {logs.content?.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.timestamp?.replace("T", " ").slice(0, 19)}</td>
                    <td><span className="badge badge-outline">{log.level}</span></td>
                    <td>{log.action}</td>
                    <td>{log.username}</td>
                    <td>{log.source}</td>
                    <td className="max-w-xs whitespace-normal">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
