export function Footer() {
  return (
    <footer className="footer footer-center bg-primary text-primary-content p-8 mt-auto w-full">
      <aside className="flex flex-col items-center gap-3 text-center">
        <img src="/logo2.png" alt="PaperTrail" className="h-12 w-12 rounded-lg object-contain shadow" />
        <p className="font-bold text-lg">PaperTrail</p>
        <p className="text-sm">
          Projekt zaliczeniowy na przedmiot „Przetwarzanie rozproszone”<br />
          3 rok studiów - 2025<br/>
          Małgorzata Rywalska
        </p>
      </aside>
    </footer>
  );
}
