using System.Text.Json.Serialization;

namespace GroomEasyAPI.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public int Duration { get; set; }

        [JsonIgnore]
        public ICollection<Appointment>? Appointments { get; set; }

        [JsonIgnore]
        public virtual ICollection<StaffService> StaffServices { get; set; } // ✅ Add this

        [JsonIgnore]
        public ICollection<AppointmentService> AppointmentServices { get; set; } = new List<AppointmentService>();
    }
}
