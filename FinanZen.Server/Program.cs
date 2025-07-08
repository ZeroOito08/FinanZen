using EFCore.NamingConventions;
using FinanZen.Server.Data;
using FinanZen.Server.Models;
using FinanZen.Server.Models.DTOs; // Adicionado para usar nosso DTO
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuração do Banco de Dados
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    .UseSnakeCaseNamingConvention());

// 2. Configurações de Serviços Essenciais
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors();

// 3. Configuração do Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Version = "v1",
        Title = "FinanZen API",
        Description = "API para o aplicativo de gestão financeira FinanZen"
    });
});

// ==========================================================
// VVV CORREÇÃO ADICIONADA AQUI VVV
// Registra os serviços de autorização necessários.
builder.Services.AddAuthorization();
// ==========================================================


var app = builder.Build();

// Configure the HTTP request pipeline.
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
// ENDPOINTS FINAIS DA API (usando Minimal APIs e DTOs)
// ==========================================================

// Endpoints para Categorias
app.MapGet("/api/categorias", async (ApplicationDbContext context) =>
{
    return await context.Categorias.ToListAsync();
});

app.MapPost("/api/categorias", async (Categoria categoria, ApplicationDbContext context) =>
{
    context.Categorias.Add(categoria);
    await context.SaveChangesAsync();
    return Results.Created($"/api/categorias/{categoria.CategoriaID}", categoria);
});

// Endpoints para Transações
app.MapGet("/api/transacoes", async (ApplicationDbContext context) =>
{
    return await context.Transacoes.ToListAsync();
});

// Endpoint corrigido para usar o DTO
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

app.MapPost("/api/usuarios", async (Usuario usuario, ApplicationDbContext context) =>
{
    context.Usuarios.Add(usuario);
    await context.SaveChangesAsync();
    return Results.Created($"/api/usuarios/{usuario.UsuarioID}", usuario);
});

app.MapFallbackToFile("/index.html");

app.Run();