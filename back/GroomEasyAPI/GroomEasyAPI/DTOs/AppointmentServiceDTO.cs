namespace GroomEasyAPI.DTOs
{
    public class AppointmentServiceDTO
    {
        public int AppointmentId { get; set; }  // ✅ Related Appointment
        public int ServiceId { get; set; }      // ✅ Related Service
        public string ServiceName { get; set; } // ✅ Service Name (Readable)
        public decimal Price { get; set; }      // ✅ Service Price
        public int Duration { get; set; }       // ✅ Service Duration in Minutes
    }
}
