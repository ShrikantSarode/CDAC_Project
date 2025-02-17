using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GroomEasyAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Mobile { get; set; }

        [Required]
        public int RoleId { get; set; }

        [JsonIgnore]
        public int? StaffId { get; set; }

        [JsonIgnore]
        public Role? Role { get; set; } // Made nullable to prevent validation issues

        [JsonIgnore]
        public ICollection<Appointment>? Appointments { get; set; }


        [JsonIgnore]
        public virtual ICollection<StaffService> StaffServices { get; set; } // ✅ Add this
    }
}