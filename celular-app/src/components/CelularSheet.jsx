import { useState } from "react";

export default function CelularSheet({ celular, onClose, fetchCelulares }) {
  const [form, setForm] = useState({ ...celular });
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [imagem, setImagem] = useState(undefined);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]);
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

    const formData = new FormData();
    formData.append("marca", form.marca);
    formData.append("modelo", form.modelo);
    formData.append("memoria", form.memoria);
    formData.append("armazenamento", form.armazenamento);
    formData.append("preco", form.preco);


    if (imagem) {
      formData.append("imagem", imagem);
    } else if (form.imagemUrl) {
      formData.append("imagemUrl", form.imagemUrl);
    }

    const response = await fetch(`http://localhost:5209/celulares/${celular.id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      setErro("Erro ao salvar alterações.");
      return;
    }

    fetchCelulares();
    setEditando(false);
    setImagem(undefined);
  };

  const handleExcluir = async () => {
    await fetch(`http://localhost:5209/celulares/${celular.id}`, {
      method: "DELETE",
    });

    fetchCelulares();
    onClose();
  };

  return (
    <>
      <div className="sheet-overlay" onClick={onClose}></div>
      <div className="sheet">
        <h2>
          {form.marca} {form.modelo}
        </h2>

        {erro && <p style={{ color: "red", marginBottom: "0.5rem" }}>{erro}</p>}

        {form.imagemUrl && (
          <img
            src={
              form.imagemUrl.startsWith("http")
                ? form.imagemUrl
                : `http://localhost:5209${form.imagemUrl}`
            }
            alt={`${form.marca} ${form.modelo}`}
            style={{
              width: "50%",
              borderRadius: "0.5rem",
              marginBottom: "1rem", 
            }}
          />
        )}

        {editando ? (
          <>
            <input
              name="marca"
              value={form.marca}
              onChange={handleChange}
              placeholder="Marca"
            />
            <input
              name="modelo"
              value={form.modelo}
              onChange={handleChange}
              placeholder="Modelo"
            />
            <input
              type="number"
              name="memoria"
              value={form.memoria}
              onChange={handleChange}
              placeholder="Memória (GB)"
            />
            <input
              type="number"
              name="armazenamento"
              value={form.armazenamento}
              onChange={handleChange}
              placeholder="Armazenamento (GB)"
            />
            <input
              type="number"
              step="0.01"
              name="preco"
              value={form.preco}
              onChange={handleChange}
              placeholder="Preço"
            />
            <input
              name="imagemUrl"
              value={form.imagemUrl || ""}
              onChange={handleChange}
              placeholder="URL da imagem"
            />
            <input type="file" onChange={handleFileChange} />

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                onClick={handleSalvar}
                style={{ backgroundColor: "#10b981" }}
              >
                Salvar
              </button>
              <button onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <p>Memória: {form.memoria} GB</p>
            <p>Armazenamento: {form.armazenamento} GB</p>
            <p>Preço: R$ {Number(form.preco).toFixed(2)}</p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <button onClick={() => setEditando(true)}>Editar</button>

              {confirmarExclusao ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleExcluir}
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    Confirmar exclusão
                  </button>
                  <button onClick={() => setConfirmarExclusao(false)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmarExclusao(true)}
                  style={{ backgroundColor: "#ec6b6bff" }}
                >
                  Excluir
                </button>
              )}

              <button onClick={onClose}>Fechar</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
