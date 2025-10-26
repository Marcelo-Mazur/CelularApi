using CelularApi;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

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

//GET ALL
app.MapGet("/celulares", async (AppDbContext db) =>
{
    return await db.Celulares.ToListAsync();
});

//GET POR ID
app.MapGet("/celulares/{id}", async (int id, AppDbContext db) =>
{
    var celular = await db.Celulares.FindAsync(id);
    return celular is not null ? Results.Ok(celular) : Results.NotFound("Celular não encontrado");
});

//POST
app.MapPost("/celulares", async (AppDbContext db, Celular novoCelular) =>
{
    db.Celulares.Add(novoCelular);
    await db.SaveChangesAsync();

    return Results.Created($"O celular {novoCelular.Marca}, {novoCelular.Modelo} foi adicionado com sucesso", novoCelular);
});

//PUT
app.MapPut("/celulares/{id}", async (int id, AppDbContext db, Celular celularAtualizado) =>
{
    var celular = await db.Celulares.FindAsync(id);

    if (celular is null) return Results.NotFound("Celular não encontrado");

    celular.Marca = celularAtualizado.Marca;
    celular.Modelo = celularAtualizado.Modelo;
    celular.Memoria = celularAtualizado.Memoria;
    celular.Armazenamento = celularAtualizado.Armazenamento;
    celular.Preco = celularAtualizado.Preco;

    await db.SaveChangesAsync();

    return Results.Ok(celular);
});

//DELETE
app.MapDelete("/celulares/{id}", async (int id, AppDbContext db) =>
{
    var celular = await db.Celulares.FindAsync(id);

    if (celular is null) return Results.NotFound("Celular não encontrado");

    db.Celulares.Remove(celular);
    await db.SaveChangesAsync();

    return Results.NoContent();
});


app.Run();
