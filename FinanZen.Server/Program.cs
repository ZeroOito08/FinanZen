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

// --- Configuração dos Serviços ---
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
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Por favor, insira 'Bearer ' seguido do seu token",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new string[] { } } });
});


var app = builder.Build();

// --- Configuração do Pipeline de Requisições ---
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
// ENDPOINTS DA API
// ==========================================================

// --- Endpoint de Login ---
app.MapPost("/api/login", async (LoginDTO loginDTO, ApplicationDbContext context, IConfiguration config) =>
{
    var usuario = await context.Usuarios.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);

    if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Senha, usuario.SenhaHash))
        return Results.Unauthorized();

    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, usuario.UsuarioID.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, usuario.Email!),
        new Claim(JwtRegisteredClaimNames.Name, usuario.Nome!),

        // 🆕 Aqui incluímos o ID da família no token!
        new Claim("FamiliaId", usuario.FamiliaId?.ToString() ?? "0")
        new Claim("IsAdmin", usuario.IsAdmin.ToString().ToLower())
    };

    var token = new JwtSecurityToken(
        issuer: config["Jwt:Issuer"],
        audience: config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddHours(8),
        signingCredentials: credentials);

    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

    return Results.Ok(new { Token = tokenString });
});

// --- Endpoint para Dashboard ---
app.MapGet("/api/dashboard/resumo", async (HttpContext httpContext, ApplicationDbContext context) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var hoje = DateTime.UtcNow;
    var primeiroDiaDoMes = new DateOnly(hoje.Year, hoje.Month, 1);
    var ultimoDiaDoMes = primeiroDiaDoMes.AddMonths(1).AddDays(-1);
    var transacoesDoMes = await context.Transacoes.Where(t => t.UsuarioID == userId && t.Data >= primeiroDiaDoMes && t.Data <= ultimoDiaDoMes).Include(t => t.Categoria).ToListAsync();
    var totalReceitas = transacoesDoMes.Where(t => t.Categoria?.Tipo == "Receita").Sum(t => t.Valor);
    var totalDespesas = transacoesDoMes.Where(t => t.Categoria?.Tipo == "Despesa").Sum(t => t.Valor);
    var resumo = new ResumoFinanceiroDTO { TotalReceitas = totalReceitas, TotalDespesas = totalDespesas, Saldo = totalReceitas - totalDespesas };
    return Results.Ok(resumo);
}).RequireAuthorization();

app.MapGet("/api/dashboard/fluxo-caixa", async ([FromQuery] string periodo, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);

    var hoje = DateOnly.FromDateTime(DateTime.UtcNow);
    DateOnly dataInicio;

    switch (periodo)
    {
        case "7dias":
            dataInicio = hoje.AddDays(-6);
            break;
        case "30dias":
            dataInicio = hoje.AddDays(-29);
            break;
        default: // "dia"
            dataInicio = hoje;
            break;
    }

    var todosOsDias = Enumerable.Range(0, (hoje.DayNumber - dataInicio.DayNumber) + 1).Select(offset => dataInicio.AddDays(offset));

    var transacoes = await context.Transacoes
        .Where(t => t.UsuarioID == userId && t.Data >= dataInicio && t.Data <= hoje)
        .Include(t => t.Categoria)
        .ToListAsync();

    var receitasPorDia = transacoes
        .Where(t => t.Categoria?.Tipo == "Receita")
        .GroupBy(t => t.Data)
        .ToDictionary(g => g.Key, g => g.Sum(t => t.Valor));

    var despesasPorDia = transacoes
        .Where(t => t.Categoria?.Tipo == "Despesa")
        .GroupBy(t => t.Data)
        .ToDictionary(g => g.Key, g => g.Sum(t => t.Valor));

    var resultado = new FluxoCaixaDTO
    {
        Labels = todosOsDias.Select(d => d.ToString("dd/MM")).ToList(),
        Receitas = todosOsDias.Select(d => receitasPorDia.GetValueOrDefault(d, 0)).ToList(),
        Despesas = todosOsDias.Select(d => despesasPorDia.GetValueOrDefault(d, 0)).ToList(),
        // VVV LÓGICA ADICIONADA PARA CALCULAR O SALDO DIÁRIO VVV
        Saldos = todosOsDias.Select(d =>
            receitasPorDia.GetValueOrDefault(d, 0) - despesasPorDia.GetValueOrDefault(d, 0)
    ).ToList()
    };

    return Results.Ok(resultado);
}).RequireAuthorization();

app.MapGet("/api/dashboard/despesas-por-categoria", async (HttpContext httpContext, ApplicationDbContext context) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var hoje = DateTime.UtcNow;
    var primeiroDiaDoMes = new DateOnly(hoje.Year, hoje.Month, 1);
    var ultimoDiaDoMes = primeiroDiaDoMes.AddMonths(1).AddDays(-1);
    var dadosGrafico = await context.Transacoes.Where(t => t.UsuarioID == userId && t.Data >= primeiroDiaDoMes && t.Data <= ultimoDiaDoMes && t.Categoria != null && t.Categoria.Tipo == "Despesa").GroupBy(t => t.Categoria!.Nome).Select(g => new { Categoria = g.Key, Total = g.Sum(t => t.Valor) }).ToListAsync();
    return Results.Ok(dadosGrafico);
}).RequireAuthorization();

// --- Endpoints para Usuários ---
app.MapPost("/api/usuarios", async (CreateUsuarioDTO usuarioDTO, ApplicationDbContext context) =>
{
    var novoUsuario = new Usuario { Nome = usuarioDTO.Nome, Email = usuarioDTO.Email, SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDTO.Senha) };
    context.Usuarios.Add(novoUsuario);
    await context.SaveChangesAsync();
    novoUsuario.SenhaHash = "";
    return Results.Created($"/api/usuarios/{novoUsuario.UsuarioID}", novoUsuario);
});

// --- Endpoints para Categorias ---
app.MapGet("/api/categorias", async (HttpContext httpContext, ApplicationDbContext context) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var categorias = await context.Categorias.Where(c => c.UsuarioID == userId || c.UsuarioID == null).ToListAsync();
    return Results.Ok(categorias);
}).RequireAuthorization();

app.MapPost("/api/categorias", async (CreateCategoriaDTO categoriaDTO, HttpContext httpContext, ApplicationDbContext context) =>
{
    var isAdmin = httpContext.User.Claims.FirstOrDefault(c => c.Type == "IsAdmin")?.Value;
    if (isAdmin != "true") return Results.Forbid();

    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var novaCategoria = new Categoria { Nome = categoriaDTO.Nome, Tipo = categoriaDTO.Tipo, UsuarioID = userId };
    context.Categorias.Add(novaCategoria);
    await context.SaveChangesAsync();
    return Results.Created($"/api/categorias/{novaCategoria.CategoriaID}", novaCategoria);
}).RequireAuthorization();

app.MapPut("/api/categorias/{id}", async (int id, CreateCategoriaDTO categoriaDTO, HttpContext httpContext, ApplicationDbContext context) =>
{
    var isAdmin = httpContext.User.Claims.FirstOrDefault(c => c.Type == "IsAdmin")?.Value;
    if (isAdmin != "true") return Results.Forbid();

    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var categoriaExistente = await context.Categorias.FirstOrDefaultAsync(c => c.CategoriaID == id && c.UsuarioID == userId);
    if (categoriaExistente == null) return Results.NotFound();
    categoriaExistente.Nome = categoriaDTO.Nome;
    categoriaExistente.Tipo = categoriaDTO.Tipo;
    await context.SaveChangesAsync();
    return Results.Ok(categoriaExistente);
}).RequireAuthorization();

app.MapDelete("/api/categorias/{id}", async (int id, HttpContext httpContext, ApplicationDbContext context) =>
{
    var isAdmin = httpContext.User.Claims.FirstOrDefault(c => c.Type == "IsAdmin")?.Value;
    if (isAdmin != "true") return Results.Forbid();

    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var categoria = await context.Categorias.FirstOrDefaultAsync(c => c.CategoriaID == id && c.UsuarioID == userId);
    if (categoria == null) return Results.NotFound();
    var isUsed = await context.Transacoes.AnyAsync(t => t.CategoriaID == id);
    if (isUsed) return Results.BadRequest("Não pode excluir uma categoria que já está em uso.");
    context.Categorias.Remove(categoria);
    await context.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapGet("/api/transacoes", async (HttpContext httpContext, ApplicationDbContext context, [FromQuery] DateOnly? dataInicio, [FromQuery] DateOnly? dataFim, [FromQuery] string? tipo, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);

    var query = context.Transacoes.Where(t => t.UsuarioID == userId);

    // --- Lógica de Filtro ---
    if (dataInicio.HasValue)
    {
        query = query.Where(t => t.Data >= dataInicio.Value);
    }
    if (dataFim.HasValue)
    {
        query = query.Where(t => t.Data <= dataFim.Value);
    }
    if (!string.IsNullOrEmpty(tipo) && tipo != "Todos")
    {
        query = query.Where(t => t.Categoria!.Tipo == tipo);
    }

    // --- Nova Lógica de Paginação ---
    var totalItems = await query.CountAsync();
    var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

    var transacoesPaginadas = await query
        .OrderByDescending(t => t.Data)
        .Skip((pageNumber - 1) * pageSize) // Pula os itens das páginas anteriores
        .Take(pageSize) // Pega apenas os itens desta página
        .Include(t => t.Categoria)
        .Select(t => new TransacaoDetalhesDTO
        {
            TransacaoID = t.TransacaoID,
            Descricao = t.Descricao,
            Valor = t.Valor,
            Data = t.Data,
            UsuarioID = t.UsuarioID,
            CategoriaID = t.CategoriaID,
            CategoriaNome = t.Categoria!.Nome,
            Tipo = t.Categoria!.Tipo
        })
        .ToListAsync();

    var resultado = new PaginatedResultDTO<TransacaoDetalhesDTO>
    {
        Items = transacoesPaginadas,
        CurrentPage = pageNumber,
        TotalPages = totalPages
    };

    return Results.Ok(resultado);
}).RequireAuthorization();

app.MapPost("/api/transacoes", async (CreateTransacaoDTO transacaoDTO, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var novaTransacao = new Transacao { Descricao = transacaoDTO.Descricao, Valor = transacaoDTO.Valor, Data = transacaoDTO.Data, UsuarioID = userId, CategoriaID = transacaoDTO.CategoriaID };
    context.Transacoes.Add(novaTransacao);
    await context.SaveChangesAsync();
    return Results.Created($"/api/transacoes/{novaTransacao.TransacaoID}", novaTransacao);
}).RequireAuthorization();

app.MapPut("/api/transacoes/{id}", async (int id, CreateTransacaoDTO transacaoAtualizada, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var transacao = await context.Transacoes.FirstOrDefaultAsync(t => t.TransacaoID == id && t.UsuarioID == userId);
    if (transacao is null) return Results.NotFound("Transação não encontrada.");
    transacao.Descricao = transacaoAtualizada.Descricao;
    transacao.Valor = transacaoAtualizada.Valor;
    transacao.Data = transacaoAtualizada.Data;
    transacao.CategoriaID = transacaoAtualizada.CategoriaID;
    await context.SaveChangesAsync();
    return Results.Ok(transacao);
}).RequireAuthorization();

app.MapDelete("/api/transacoes/{id}", async (int id, HttpContext httpContext, ApplicationDbContext context) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);
    var transacao = await context.Transacoes.FirstOrDefaultAsync(t => t.TransacaoID == id && t.UsuarioID == userId);
    if (transacao is null) return Results.NotFound();
    context.Transacoes.Remove(transacao);
    await context.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

// VVV ENDPOINT DE ORÇAMENTO ADICIONADO AQUI VVV
app.MapGet("/api/orcamentos", async (HttpContext httpContext, ApplicationDbContext context) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var userId = int.Parse(userIdClaim.Value);

    var hoje = DateTime.UtcNow;
    var anoAtual = hoje.Year;
    var mesAtual = hoje.Month;

    // 1. Pega todas as categorias de despesa do usuário de uma só vez
    var categoriasDeDespesa = await context.Categorias
        .Where(c => c.UsuarioID == userId && c.Tipo == "Despesa")
        .ToListAsync();

    // 2. Pega todos os orçamentos definidos para o mês atual de uma só vez
    var orcamentosDoMes = await context.Orcamentos
        .Where(o => o.UsuarioID == userId && o.Ano == anoAtual && o.Mes == mesAtual)
        .ToDictionaryAsync(o => o.CategoriaID);

    // 3. Pega todos os gastos do mês atual, agrupados por categoria, de uma só vez
    var gastosDoMes = await context.Transacoes
        .Where(t => t.UsuarioID == userId && t.Data.Year == anoAtual && t.Data.Month == mesAtual && t.Categoria != null && t.Categoria.Tipo == "Despesa")
        .GroupBy(t => t.CategoriaID)
        .Select(g => new { CategoriaID = g.Key, TotalGasto = g.Sum(t => t.Valor) })
        .ToDictionaryAsync(g => g.CategoriaID);

    // 4. Monta o resultado final em memória (muito mais rápido e seguro)
    var resultado = categoriasDeDespesa.Select(c => new OrcamentoDetalhesDTO
    {
        CategoriaID = c.CategoriaID,
        CategoriaNome = c.Nome,
        ValorOrcado = orcamentosDoMes.GetValueOrDefault(c.CategoriaID)?.Valor ?? 0,
        ValorGasto = gastosDoMes.GetValueOrDefault(c.CategoriaID)?.TotalGasto ?? 0
    }).ToList();

    return Results.Ok(resultado);

}).RequireAuthorization();

app.MapFallbackToFile("/index.html");

app.Run();