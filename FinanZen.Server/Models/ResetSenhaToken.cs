using System;

namespace FinanZen.Server.Models
{
    public class ResetSenhaToken
    {
        // Identificador único do token
        public int Id { get; set; }

        // Chave estrangeira para o usuário que solicitou a redefinição
        public int UsuarioId { get; set; }

        // Token gerado para a redefinição de senha
        public string Token { get; set; } = null!;

        // Data e hora de expiração do token
        public DateTime ExpiraEm { get; set; }

        // Navegação para o usuário relacionado
        public Usuario Usuario { get; set; } = null!;
    }
}
