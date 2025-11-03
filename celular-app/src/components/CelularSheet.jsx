import { useState } from "react";

export default function CelularSheet({ celular, onClose, fetchCelulares }) {
  const [form, setForm] = useState({ ...celular });
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (
      !form.marca.trim() ||
      !form.modelo.trim() ||
      !form.memoria ||
      !form.armazenamento ||
      !form.preco
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setErro("");

    await fetch(`http://localhost:5209/celulares/${celular.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        memoria: Number(form.memoria),
        armazenamento: Number(form.armazenamento),
        preco: Number(form.preco)
      })
    });

    fetchCelulares();
    setEditando(false);
  };

  const handleExcluir = async () => {
    await fetch(`http://localhost:5209/celulares/${celular.id}`, {
      method: "DELETE"
    });

    fetchCelulares();
    onClose();
  };

  return (
    <>
      <div className="sheet-overlay" onClick={onClose}></div>
      <div className="sheet">
        <h2>{form.marca} {form.modelo}</h2>

        {erro && <p style={{ color: "red", marginBottom: "0.5rem" }}>{erro}</p>}

        {form.imagemUrl && !editando && (
          <img
            src={form.imagemUrl}
            alt={`${form.marca} ${form.modelo}`}
            style={{ width: "100%", borderRadius: "0.5rem", marginBottom: "1rem" }}
          />
        )}

        {editando ? (
          <>
            <input name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" />
            <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" />
            <input type="number" name="memoria" value={form.memoria} onChange={handleChange} placeholder="Memória (GB)" />
            <input type="number" name="armazenamento" value={form.armazenamento} onChange={handleChange} placeholder="Armazenamento (GB)" />
            <input type="number" step="0.01" name="preco" value={form.preco} onChange={handleChange} placeholder="Preço" />
            <input name="imagemUrl" value={form.imagemUrl} onChange={handleChange} placeholder="URL da imagem" />

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={handleSalvar} style={{ backgroundColor: "#10b981" }}>Salvar</button>
              <button onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <p>Memória: {form.memoria} GB</p>
            <p>Armazenamento: {form.armazenamento} GB</p>
            <p>Preço: R$ {Number(form.preco).toFixed(2)}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={() => setEditando(true)}>Editar</button>

              {confirmarExclusao ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={handleExcluir} style={{ backgroundColor: "#dc2626" }}>Confirmar exclusão</button>
                  <button onClick={() => setConfirmarExclusao(false)}>Cancelar</button>
                </div>
              ) : (
                <button onClick={() => setConfirmarExclusao(true)} style={{ backgroundColor: "#f87171" }}>Excluir</button>
              )}

              <button onClick={onClose}>Fechar</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
