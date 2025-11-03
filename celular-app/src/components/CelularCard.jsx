export default function CelularCard({ celular, onClick }) {
    return (
        <div onClick={onClick} className="card">
            <img
                src={
                    celular.imagemUrl
                        ? `http://localhost:5209${celular.imagemUrl}`
                        : "http://localhost:5209/imagens/placeholder.png"
                }
                alt={`${celular.marca} ${celular.modelo}`}
                style={{ width: "100%", height: "auto", borderRadius: "0.5rem", marginBottom: "0.5rem" }}
            />
            <h2>{celular.marca} {celular.modelo}</h2>
            <p>R$ {celular.preco.toFixed(2)}</p>
        </div>
    );
}