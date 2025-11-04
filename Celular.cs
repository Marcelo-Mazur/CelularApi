using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CelularApi
{
    public class Celular
    {
        public int Id { get; set; }

        public string? ImagemUrl { get; set; }

        [NotMapped]
        public IFormFile? Imagem { get; set; }

        public string? Marca { get; set; }

        public string? Modelo { get; set; }

        public int Memoria { get; set; }

        public int Armazenamento { get; set; }

        public double Preco { get; set; }
    }
}