using GroomEasyAPI.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class Appointment
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public User Customer { get; set; }
    public int? StaffId { get; set; }
    public Staff? Staff { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string AppointmentTime { get; set; }
    public string Status { get; set; }
    public string PaymentStatus { get; set; }
    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [JsonIgnore]
    public ICollection<AppointmentService> AppointmentServices { get; set; } = new List<AppointmentService>();
}
