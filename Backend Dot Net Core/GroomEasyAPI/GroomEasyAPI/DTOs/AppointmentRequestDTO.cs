using System;
using System.Collections.Generic;

namespace GroomEasyAPI.Models
{
    public class AppointmentRequestDTO
    {
        public int CustomerId { get; set; }
        public int StaffId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string AppointmentTime { get; set; }
        public List<int> Services { get; set; } = new List<int>(); // List of selected service IDs
    }
}
