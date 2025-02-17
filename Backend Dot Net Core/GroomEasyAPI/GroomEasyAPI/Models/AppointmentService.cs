using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GroomEasyAPI.Models
{
    public class AppointmentService
    {
        public int AppointmentId { get; set; }
        public int ServiceId { get; set; }
        [ForeignKey("AppointmentId")]
        public Appointment Appointment { get; set; }
        [ForeignKey("ServiceId")]
        public Service Service { get; set; }
    }
}
