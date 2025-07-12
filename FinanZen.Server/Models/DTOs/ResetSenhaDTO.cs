namespace FinanZen.Server.Models.DTOs
{
    public class ResetSenhaDTO
    {
        public string Token { get; set; } = string.Empty;
        public string NovaSenha { get; set; } = string.Empty;
    }
}
