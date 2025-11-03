import { useState } from "react";

export default function CelularForm({ fetchCelulares }) {
  const [form, setForm] = useState({
    imagemUrl: "",
    marca: "",
    modelo: "",
    memoria: "",
    armazenamento: "",
    preco: ""
  });

  const [imagem, setImagem] = useState(null);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (
      Number(form.memoria) <= 0 ||
      Number(form.armazenamento) <= 0 ||
      Number(form.preco) <= 0
    ) {
      setErro("Valores numéricos devem ser maiores que zero.");
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
    } else if (form.imagemUrl.trim()) {
      formData.append("imagemUrl", form.imagemUrl);
    }

    await fetch("http://localhost:5209/celulares/upload", {
      method: "POST",
      body: formData
    });

    setForm({
      imagemUrl: "",
      marca: "",
      modelo: "",
      memoria: "",
      armazenamento: "",
      preco: ""
    });
    setImagem(null);
    fetchCelulares();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <input
        name="imagemUrl"
        placeholder="URL da imagem (opcional)"
        value={form.imagemUrl}
        onChange={handleChange}
      />
      <input type="file" onChange={handleFileChange} />
      <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} />
      <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} />
      <input type="number" name="memoria" placeholder="Memória (GB)" value={form.memoria} onChange={handleChange} />
      <input type="number" name="armazenamento" placeholder="Armazenamento (GB)" value={form.armazenamento} onChange={handleChange} />
      <input type="number" step="0.01" name="preco" placeholder="Preço" value={form.preco} onChange={handleChange} />
      <button type="submit">Adicionar</button>
    </form>
  );
}
