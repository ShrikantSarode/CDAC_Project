 
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GroomEasyAPI.Models
{
    public class Staff
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        // Explicitly define UserId as a foreign key
        [ForeignKey("User")]
        public int UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        [JsonIgnore]
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
