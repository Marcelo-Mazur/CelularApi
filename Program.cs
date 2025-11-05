using CelularApi;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=celulares.db"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("PermitirTudo");

app.MapGet("/celulares", async (AppDbContext db) =>
{
    return await db.Celulares.ToListAsync();
});

app.MapGet("/celulares/{id}", async (int id, AppDbContext db) =>
{
    var celular = await db.Celulares.FindAsync(id);
    return celular is not null ? Results.Ok(celular) : Results.NotFound("Celular não encontrado");
});

app.MapPost("/celulares/upload", async ([FromForm] CelularForm form, AppDbContext db) =>
{
    try
    {
        Directory.CreateDirectory("wwwroot/imagens");

        var celular = new Celular
        {
            Marca = form.Marca,
            Modelo = form.Modelo,
            Memoria = form.Memoria,
            Armazenamento = form.Armazenamento,
            Preco = form.Preco
        };

        if (form.Imagem != null && form.Imagem.Length > 0)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(form.Imagem.FileName);
            var path = Path.Combine("wwwroot/imagens", fileName);

            using var stream = new FileStream(path, FileMode.Create);
            await form.Imagem.CopyToAsync(stream);

            celular.ImagemUrl = $"/imagens/{fileName}";
        }
        else if (!string.IsNullOrWhiteSpace(form.ImagemUrl))
        {
            celular.ImagemUrl = form.ImagemUrl;
        }

        db.Celulares.Add(celular);
        await db.SaveChangesAsync();

        return Results.Created($"/celulares/{celular.Id}", celular);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro no upload: {ex.Message}");
        return Results.StatusCode(500);
    }
}).DisableAntiforgery();

app.MapPut("/celulares/{id}", async (int id, [FromForm] CelularForm form, AppDbContext db) =>
{
    var celular = await db.Celulares.FindAsync(id);
    if (celular is null) return Results.NotFound("Celular não encontrado");

    celular.Marca = form.Marca;
    celular.Modelo = form.Modelo;
    celular.Memoria = form.Memoria;
    celular.Armazenamento = form.Armazenamento;
    celular.Preco = form.Preco;

    if (form.Imagem != null && form.Imagem.Length > 0)
    {
        Directory.CreateDirectory("wwwroot/imagens");

        var fileName = Guid.NewGuid() + Path.GetExtension(form.Imagem.FileName);
        var path = Path.Combine("wwwroot/imagens", fileName);
        using var stream = new FileStream(path, FileMode.Create);
        await form.Imagem.CopyToAsync(stream);

        celular.ImagemUrl = $"/imagens/{fileName}";
    }
    else if (!string.IsNullOrWhiteSpace(form.ImagemUrl))
    {
        celular.ImagemUrl = form.ImagemUrl;
    }

    await db.SaveChangesAsync();

    return Results.Ok(celular);
}).DisableAntiforgery();


app.MapDelete("/celulares/{id}", async (int id, AppDbContext db) =>
{
    var celular = await db.Celulares.FindAsync(id);

    if (celular is null) return Results.NotFound("Celular não encontrado");

    db.Celulares.Remove(celular);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.UseStaticFiles();
app.Run();
