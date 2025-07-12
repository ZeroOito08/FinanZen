namespace FinanZen.Server.Services
{
    public interface IEmailSender
    {
        Task EnviarEmailAsync(string destinatario, string assunto, string mensagemHtml);
    }
}
