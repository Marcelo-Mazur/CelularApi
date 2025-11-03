namespace CelularApi;

public class CelularForm
{
    public string? Marca { get; set; }
    public string? Modelo { get; set; }
    public int Memoria { get; set; }
    public int Armazenamento { get; set; }
    public double Preco { get; set; }
    public IFormFile? Imagem { get; set; }
    public string? ImagemUrl { get; set; }
}
