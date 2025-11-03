import { useEffect, useState } from "react";

import CelularCard from "./components/celularCard";
import CelularSheet from "./components/CelularSheet";
import CelularForm from "./components/CelularForm";

function App() {
  const [celulares, setCelulares] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCelulares = async () => {
    const res = await fetch("http://localhost:5209/celulares");
    const data = await res.json();
    setCelulares(data);
  };

  useEffect(() => {
    fetchCelulares();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filtered = celulares.filter(
    (c) =>
      c.marca?.toLowerCase().includes(search.toLowerCase()) ||
      c.modelo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Catálogo de Celulares</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={search}
          onChange={handleSearch}
        />
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Fechar" : "Cadastrar"}
        </button>
      </div>

      {showForm && <CelularForm fetchCelulares={fetchCelulares} />}

      <div className="grid">
        {filtered.map((celular) => (
          <CelularCard
            key={celular.id}
            celular={celular}
            onClick={() => setSelected(celular)}
          />
        ))}
      </div>

      {selected && (
        <CelularSheet
          celular={selected}
          onClose={() => setSelected(null)}
          fetchCelulares={fetchCelulares}
        />
      )}
    </div>
  );
}

export default App;
