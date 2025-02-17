using System.Threading.Tasks;

namespace GroomEasyAPI.Helpers
{
    public interface INotificationService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
    }
}
