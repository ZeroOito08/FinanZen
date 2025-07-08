using BCrypt.Net;
using EFCore.NamingConventions;
using FinanZen.Server.Data;
using FinanZen.Server.Models;
using FinanZen.Server.Models.DTOs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Configuração dos Serviços ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    .UseSnakeCaseNamingConvention());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors();
builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Version = "v1",
        Title = "FinanZen API",
        Description = "API para o aplicativo de gestão financeira FinanZen"
    });
});

var app = builder.Build();

// --- Configuração do Pipeline de Requisições ---
app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthorization();

// ==========================================================
// ENDPOINTS FINAIS DA API
// ==========================================================

// Endpoints para Categorias
app.MapGet("/api/categorias", async (ApplicationDbContext context) =>
{
    return await context.Categorias.ToListAsync();
});

// Corrigido para usar DTO
app.MapPost("/api/categorias", async (CreateCategoriaDTO categoriaDTO, ApplicationDbContext context) =>
{
    var novaCategoria = new Categoria
    {
        Nome = categoriaDTO.Nome,
        Tipo = categoriaDTO.Tipo,
        UsuarioID = categoriaDTO.UsuarioID
    };
    context.Categorias.Add(novaCategoria);
    await context.SaveChangesAsync();
    return Results.Created($"/api/categorias/{novaCategoria.CategoriaID}", novaCategoria);
});

// Endpoints para Transações
app.MapGet("/api/transacoes", async (ApplicationDbContext context) =>
{
    return await context.Transacoes.ToListAsync();
});

// Corrigido para usar DTO
app.MapPost("/api/transacoes", async (CreateTransacaoDTO transacaoDTO, ApplicationDbContext context) =>
{
    var novaTransacao = new Transacao
    {
        Descricao = transacaoDTO.Descricao,
        Valor = transacaoDTO.Valor,
        Data = transacaoDTO.Data,
        UsuarioID = transacaoDTO.UsuarioID,
        CategoriaID = transacaoDTO.CategoriaID
    };

    context.Transacoes.Add(novaTransacao);
    await context.SaveChangesAsync();
    return Results.Created($"/api/transacoes/{novaTransacao.TransacaoID}", novaTransacao);
});

// Endpoints para Usuários
app.MapGet("/api/usuarios", async (ApplicationDbContext context) =>
{
    return await context.Usuarios.ToListAsync();
});

// Corrigido para usar DTO e sem duplicatas
app.MapPost("/api/usuarios", async (CreateUsuarioDTO usuarioDTO, ApplicationDbContext context) =>
{
    var novoUsuario = new Usuario
    {
        Nome = usuarioDTO.Nome,
        Email = usuarioDTO.Email,
        SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDTO.Senha)
    };

    context.Usuarios.Add(novoUsuario);
    await context.SaveChangesAsync();

    novoUsuario.SenhaHash = "";
    return Results.Created($"/api/usuarios/{novoUsuario.UsuarioID}", novoUsuario);
});


app.MapFallbackToFile("/index.html");

app.Run();