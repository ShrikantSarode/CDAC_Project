using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GroomEasyAPI.DTOs
{
    public class UserRegisterDTO
    {
        [Required]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }

        [Required]
        public string Mobile { get; set; }

        [Required]
        public int RoleId { get; set; }

        // ✅ Store only List of Service IDs, NOT `StaffService` objects
        [JsonIgnore]
        public List<int>? StaffServices { get; set; }
    }
}
