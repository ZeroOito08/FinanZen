// Pasta: Models/DTOs/CreateUsuarioDTO.cs
namespace FinanZen.Server.Models.DTOs
{
    public class CreateUsuarioDTO
    {
        public required string Nome { get; set; }
        public required string Email { get; set; }
        public required string Senha { get; set; }
    }
}