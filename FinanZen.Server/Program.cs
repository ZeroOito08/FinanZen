using BCrypt.Net;
using EFCore.NamingConventions;
using FinanZen.Server.Data;
using FinanZen.Server.Models;
using FinanZen.Server.Models.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// --- Service Configuration ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    .UseSnakeCaseNamingConvention());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Version = "v1", Title = "FinanZen API" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { In = ParameterLocation.Header, Description = "Please enter 'Bearer ' followed by your token", Name = "Authorization", Type = SecuritySchemeType.ApiKey, Scheme = "Bearer" });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new string[] { } } });
});


var app = builder.Build();

// --- Request Pipeline Configuration ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthentication();
app.UseAuthorization();

// ==========================================================
// API ENDPOINTS
// ==========================================================

#region Authentication Endpoints
app.MapPost("/api/login", async (LoginDTO loginDTO, ApplicationDbContext context, IConfiguration config) =>
{
    var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);
    if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Senha, usuario.SenhaHash)) return Results.Unauthorized();

    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
    var claims = new[] { new Claim(JwtRegisteredClaimNames.Sub, usuario.UsuarioID.ToString()), new Claim(JwtRegisteredClaimNames.Email, usuario.Email!), new Claim(JwtRegisteredClaimNames.Name, usuario.Nome!) };
    var token = new JwtSecurityToken(issuer: config["Jwt:Issuer"], audience: config["Jwt:Audience"], claims: claims, expires: DateTime.Now.AddHours(8), signingCredentials: credentials);

    return Results.Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token) });
});
#endregion

#region User Endpoints
app.MapPost("/api/usuarios", async (CreateUsuarioDTO usuarioDTO, ApplicationDbContext context) =>
{
    var novoUsuario = new Usuario { Nome = usuarioDTO.Nome, Email = usuarioDTO.Email, SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDTO.Senha) };
    context.Usuarios.Add(novoUsuario);
    await context.SaveChangesAsync();
    novoUsuario.SenhaHash = "";
    return Results.Created($"/api/usuarios/{novoUsuario.UsuarioID}", novoUsuario);
});
#endregion

#region Category Endpoints
app.MapGet("/api/categorias", async (HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    return Results.Ok(await context.Categorias.Where(c => c.UsuarioID == userId || c.UsuarioID == null).ToListAsync());
}).RequireAuthorization();

app.MapPost("/api/categorias", async (CreateCategoriaDTO categoriaDTO, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var novaCategoria = new Categoria { Nome = categoriaDTO.Nome, Tipo = categoriaDTO.Tipo, UsuarioID = userId };
    context.Categorias.Add(novaCategoria);
    await context.SaveChangesAsync();
    return Results.Created($"/api/categorias/{novaCategoria.CategoriaID}", novaCategoria);
}).RequireAuthorization();

app.MapPut("/api/categorias/{id}", async (int id, CreateCategoriaDTO categoriaDTO, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var categoriaDb = await context.Categorias.FirstOrDefaultAsync(c => c.CategoriaID == id && c.UsuarioID == userId);
    if (categoriaDb == null) return Results.NotFound();

    categoriaDb.Nome = categoriaDTO.Nome;
    categoriaDb.Tipo = categoriaDTO.Tipo;
    await context.SaveChangesAsync();
    return Results.Ok(categoriaDb);
}).RequireAuthorization();

app.MapDelete("/api/categorias/{id}", async (int id, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var categoria = await context.Categorias.FirstOrDefaultAsync(c => c.CategoriaID == id && c.UsuarioID == userId);
    if (categoria == null) return Results.NotFound();

    var isUsed = await context.Transacoes.AnyAsync(t => t.CategoriaID == id && t.UsuarioID == userId);
    if (isUsed) return Results.BadRequest("Category is in use and cannot be deleted.");

    context.Categorias.Remove(categoria);
    await context.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();
#endregion

#region Transaction Endpoints
app.MapGet("/api/transacoes", async (HttpContext httpContext, ApplicationDbContext context, [FromQuery] DateOnly? dataInicio, [FromQuery] DateOnly? dataFim) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var query = context.Transacoes.Where(t => t.UsuarioID == userId);
    if (dataInicio.HasValue) query = query.Where(t => t.Data >= dataInicio.Value);
    if (dataFim.HasValue) query = query.Where(t => t.Data <= dataFim.Value);

    var transacoes = await query.Include(t => t.Categoria)
        .Select(t => new TransacaoDetalhesDTO { TransacaoID = t.TransacaoID, Descricao = t.Descricao, Valor = t.Valor, Data = t.Data, UsuarioID = t.UsuarioID, CategoriaID = t.CategoriaID, CategoriaNome = t.Categoria != null ? t.Categoria.Nome : null, Tipo = t.Categoria != null ? t.Categoria.Tipo : null })
        .OrderByDescending(t => t.Data).ToListAsync();
    return Results.Ok(transacoes);
}).RequireAuthorization();

app.MapPost("/api/transacoes", async (CreateTransacaoDTO transacaoDTO, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var novaTransacao = new Transacao { Descricao = transacaoDTO.Descricao, Valor = transacaoDTO.Valor, Data = transacaoDTO.Data, UsuarioID = userId, CategoriaID = transacaoDTO.CategoriaID };
    context.Transacoes.Add(novaTransacao);
    await context.SaveChangesAsync();
    return Results.Created($"/api/transacoes/{novaTransacao.TransacaoID}", novaTransacao);
}).RequireAuthorization();

app.MapPut("/api/transacoes/{id}", async (int id, CreateTransacaoDTO transacaoAtualizada, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var transacao = await context.Transacoes.FirstOrDefaultAsync(t => t.TransacaoID == id && t.UsuarioID == userId);
    if (transacao is null) return Results.NotFound();

    transacao.Descricao = transacaoAtualizada.Descricao;
    transacao.Valor = transacaoAtualizada.Valor;
    transacao.Data = transacaoAtualizada.Data;
    transacao.CategoriaID = transacaoAtualizada.CategoriaID;
    await context.SaveChangesAsync();
    return Results.Ok(transacao);
}).RequireAuthorization();

app.MapDelete("/api/transacoes/{id}", async (int id, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var transacao = await context.Transacoes.FirstOrDefaultAsync(t => t.TransacaoID == id && t.UsuarioID == userId);
    if (transacao is null) return Results.NotFound();
    context.Transacoes.Remove(transacao);
    await context.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();
#endregion

#region Dashboard Endpoints
app.MapGet("/api/dashboard/resumo", async (HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var hoje = DateTime.UtcNow;
    var primeiroDiaDoMes = new DateOnly(hoje.Year, hoje.Month, 1);
    var ultimoDiaDoMes = primeiroDiaDoMes.AddMonths(1).AddDays(-1);
    var transacoesDoMes = await context.Transacoes.Where(t => t.UsuarioID == userId && t.Data >= primeiroDiaDoMes && t.Data <= ultimoDiaDoMes).Include(t => t.Categoria).ToListAsync();
    var totalReceitas = transacoesDoMes.Where(t => t.Categoria?.Tipo == "Receita").Sum(t => t.Valor);
    var totalDespesas = transacoesDoMes.Where(t => t.Categoria?.Tipo == "Despesa").Sum(t => t.Valor);
    var resumo = new ResumoFinanceiroDTO { TotalReceitas = totalReceitas, TotalDespesas = totalDespesas, Saldo = totalReceitas - totalDespesas };
    return Results.Ok(resumo);
}).RequireAuthorization();

app.MapGet("/api/dashboard/despesas-por-categoria", async (HttpContext httpContext, ApplicationDbContext context) =>
{
    var userId = int.Parse(httpContext.User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    var hoje = DateTime.UtcNow;
    var primeiroDiaDoMes = new DateOnly(hoje.Year, hoje.Month, 1);
    var ultimoDiaDoMes = primeiroDiaDoMes.AddMonths(1).AddDays(-1);
    var dadosGrafico = await context.Transacoes.Where(t => t.UsuarioID == userId && t.Data >= primeiroDiaDoMes && t.Data <= ultimoDiaDoMes && t.Categoria != null && t.Categoria.Tipo == "Despesa").GroupBy(t => t.Categoria!.Nome).Select(g => new { Categoria = g.Key, Total = g.Sum(t => t.Valor) }).ToListAsync();
    return Results.Ok(dadosGrafico);
}).RequireAuthorization();
#endregion


app.MapFallbackToFile("/index.html");

app.Run();